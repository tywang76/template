import { Router } from 'express';
import { ItemPrisma } from '../out/prisma/item.prisma.js';
import { ItemService } from '../../use-case/ItemService.js';
import { pipe } from 'fp-ts/lib/function.js';
import * as TE from 'fp-ts/lib/TaskEither.js';

const router = Router();

const itemRepo = new ItemPrisma();
const itemService = new ItemService(itemRepo);

router.get('/items', async (_req, res) => {
    await pipe(
        itemService.getItems(),
        TE.fold(
            (error) => async () => {
                res.status(500).json({ error });
            },
            (data) => async () => {
                res.json(data);
            },
        ),
    )();
});

export default router;
