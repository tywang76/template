import { useState, useEffect } from 'react';

export function ItemList() {
    const [rows, setRows] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/items')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json() as Promise<Record<string, unknown>[]>;
            })
            .then(setRows)
            .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch data'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!rows.length) return <p>No data.</p>;

    const headers = Object.keys(rows[0]);

    return (
        <table>
            <thead>
                <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i}>
                        {headers.map((h) => <td key={h}>{String(row[h] ?? '')}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
