import { useState, useEffect, useRef } from 'react';

type SortKey = 'stock' | 'status' | 'a1' | 'a2' | 'ts';
type SortOrder = 'asc' | 'desc';

interface MAStatusRow {
    stock: string;
    status: string;
    a1: number;
    a2: number;
    ts: string;
}

interface MAReport {
    stock: string;
    maStatus: { status: string; a1: number; a2: number; ts: string }[];
}

export function MAReportTable() {
    const [rows, setRows] = useState<MAStatusRow[]>([]);
    const [sortKey, setSortKey] = useState<SortKey>('ts');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState('2025-09-01');
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                start_date: startDate,
                end_date: endDate,
            });
            const response = await fetch(`http://localhost:3000/api/report/ma?${params}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data: MAReport[] = await response.json();

            const flatRows: MAStatusRow[] = data.flatMap(report =>
                report.maStatus.map(status => ({
                    stock: report.stock,
                    status: status.status,
                    a1: status.a1,
                    a2: status.a2,
                    ts: status.ts,
                }))
            );
            setRows(flatRows);
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const sortedRows = [...rows].sort((a, b) => {
        let comparison = 0;
        if (sortKey === 'ts') {
            comparison = new Date(a.ts).getTime() - new Date(b.ts).getTime();
        } else if (sortKey === 'a1' || sortKey === 'a2') {
            comparison = a[sortKey] - b[sortKey];
        } else {
            comparison = a[sortKey].localeCompare(b[sortKey]);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const formatDate = (ts: string) => {
        return new Date(ts).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };
    const formatNumber = (n: number | undefined | null) => n != null ? n.toFixed(2) : "—";

    const getSortIcon = (key: SortKey) => {
        if (sortKey !== key) return '⇅';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="ma-report-table">
            <div className="table-header">
                <h2>MA Report ({rows.length} records)</h2>
                <div className="date-controls">
                    <label>
                        Start:
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="date-input"
                        />
                    </label>
                    <label>
                        End:
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="date-input"
                        />
                    </label>
                    <button onClick={fetchData} className="refresh-btn">
                        {loading ? 'Loading...' : 'Fetch'}
                    </button>
                </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('stock')}>
                            Stock {getSortIcon('stock')}
                        </th>
                        <th onClick={() => handleSort('status')}>
                            Status {getSortIcon('status')}
                        </th>
                        <th onClick={() => handleSort('a1')}>
                            MA1 {getSortIcon('a1')}
                        </th>
                        <th onClick={() => handleSort('a2')}>
                            MA2 {getSortIcon('a2')}
                        </th>
                        <th onClick={() => handleSort('ts')}>
                            Date {getSortIcon('ts')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedRows.map((row, index) => (
                        <tr key={`${row.stock}-${row.ts}-${index}`}>
                            <td>{row.stock}</td>
                            <td className={`status-${row.status.toLowerCase()}`}>
                                {row.status}
                            </td>
                            <td>{formatNumber(row.a1)}</td>
                            <td>{formatNumber(row.a2)}</td>
                            <td>{formatDate(row.ts)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
