import { prisma } from './prisma.js';
import * as TE from 'fp-ts/lib/TaskEither.js';
import type { ItemRepo } from '../../../port/out/item.js';
import type { Item } from '../../../domain/model/item.schema.js';

export class ItemPrisma implements ItemRepo {
    getItems = (): TE.TaskEither<string, Item[]> =>
        TE.tryCatch(
            async () => {
                const result = await prisma.item.findMany();
                return result as Item[];
            },
            (error) => `Failed to fetch items: ${String(error)}`
        );
}
