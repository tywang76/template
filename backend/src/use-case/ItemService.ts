import type { ItemRepo } from '../port/out/item';
import type * as TE from 'fp-ts/lib/TaskEither.js';
import type { Item } from '../domain/model/item.schema';

export class ItemService {
    constructor(private itemRepo: ItemRepo) {}

    getItems = (): TE.TaskEither<string, Item[]> => {
        return this.itemRepo.getItems();
    };
}
