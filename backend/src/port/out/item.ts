import type * as TE from 'fp-ts/lib/TaskEither.js';
import type { Item } from '../../domain/model/item.schema';

export interface ItemRepo {
    getItems: () => TE.TaskEither<string, Item[]>;
}
