import type * as TE from 'fp-ts/lib/TaskEither.js';
import type { Stock } from '../../domain/model/market.schema';
import type { TimeStamp } from '../../domain/model/timestamp';

export interface MarketRepo {
    getKBars: (start: TimeStamp, end: TimeStamp) => (stockIds: string[]) => TE.TaskEither<string, Stock[]>;
    getStocks: () => TE.TaskEither<string, Stock['stock'][]>;
}
