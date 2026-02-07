import { pipe } from 'fp-ts/lib/function.js';
import { ma_algo } from '../domain/service/strategy'
import type { MarketRepo } from '../port/out/market';
import * as TE from 'fp-ts/lib/TaskEither.js';
import * as A from 'fp-ts/lib/Array.js';
import { ma_report } from '../domain/service/report';
import { parseTimestampString, type TimeStamp } from '../domain/model/timestamp';
import { groupCompact } from '../domain/service/KBar';

type GroupByKey = 'year' | 'month' | 'day' | 'hour' | 'minute';

type MAConfig = {
    a1: number;
    a2: number;
    unit: GroupByKey;
};

export class ReportService {
    private maConfig: MAConfig = {
        a1: 43,
        a2: 87,
        unit: "day"
    };

    constructor(private marketRepo: MarketRepo) { }

    reportMAs = (startDate: string, endDate: string) => {
        const start: TimeStamp = parseTimestampString(`${startDate} 09:00:00`);
        const end: TimeStamp = parseTimestampString(`${endDate} 14:00:00`);

        return pipe(
            this.marketRepo.getStocks(),
            TE.flatMap(this.marketRepo.getKBars(start, end)),
            TE.map(A.map(it => ({
                stock: it.stock,
                maRelations: pipe(
                    it.kbar,
                    groupCompact(this.maConfig.unit),
                    ma_algo(this.maConfig.a1, this.maConfig.a2)
                )
            }))),
            TE.map(A.map(({ stock, maRelations }) => ma_report(stock, maRelations))),
        );
    };
}
