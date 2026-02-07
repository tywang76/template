import { Router } from 'express';
import { MarketPrisma } from '../out/prisma/market.prisma.js';
import { ReportService } from '../../use-case/ReportService.js';
import { pipe } from 'fp-ts/lib/function.js';
import * as TE from 'fp-ts/lib/TaskEither.js';
const router = Router();

const prismaMarketRepo = new MarketPrisma();
const reportService = new ReportService(prismaMarketRepo)

router.get('/report/ma', async (req, res) => {
    const startDate = (req.query.start_date as string) || '2025-09-01';
    const endDate = (req.query.end_date as string) || new Date().toISOString().slice(0, 10);

    console.log(`API /report/ma called with start_date=${startDate}, end_date=${endDate}`);

    await pipe(
        reportService.reportMAs(startDate, endDate),
        TE.fold(
            (error) => async () => {
                console.error('Error:', error);
                res.status(500).json({ error });
            },
            (data) => async () => {
                console.log('Success, data count:', data.length);
                res.json(data);
            },
        ),
    )();
});

export default router;
