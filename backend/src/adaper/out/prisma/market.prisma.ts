import { prisma } from './prisma.js'
import * as TE from 'fp-ts/lib/TaskEither.js';
import type { MarketRepo } from '../../../port/out/market.js';
import type { Stock } from '../../../domain/model/market.schema.js';
import { type TimeStamp, toDate } from '../../../domain/model/timestamp.js';

export class MarketPrisma implements MarketRepo {
    getStocks = (): TE.TaskEither<string, Stock['stock'][]> =>
        TE.tryCatch(
            async () => {
                const result = await prisma.cb.findMany({
                    select: { code: true },
                    // where: { code: { in: ['62194', '61793', '27271'] } }
                });
                const codes = result.map((r: { code: string }) => r.code.substring(0, 4));
                return [...new Set(codes)];
            },
            (error) => `Failed to fetch stocks: ${String(error)}`
        );

    getKBars = (start: TimeStamp, end: TimeStamp) => (stockIds: string[]): TE.TaskEither<string, Stock[]> =>
        TE.tryCatch(
            async () => {
                const CHUNK_SIZE = 50;
                const results: Stock[] = [];
                const startDate = toDate(start);
                const endDate = toDate(end);

                for (let i = 0; i < stockIds.length; i += CHUNK_SIZE) {
                    const chunk = stockIds.slice(i, i + CHUNK_SIZE);
                    const chunkResult = await prisma.stock.findMany({
                        where: { stock: { in: chunk } },
                        include: {
                            kbar: {
                                where: {
                                    ts: {
                                        gte: startDate,
                                        lte: endDate,
                                    },
                                },
                            },
                        },
                    });
                    results.push(...(chunkResult as Stock[]));
                }
                return results;
            },
            (error) => `Failed to fetch stocks: ${String(error)}`
        );
}
