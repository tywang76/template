import { left, right, type Either } from 'fp-ts/lib/Either.js';
import { none, some, type Option } from 'fp-ts/lib/Option.js';
import { pipe } from 'fp-ts/lib/function.js';
import * as A from 'fp-ts/lib/Array.js';
import type { KBar, MASchema } from '../model/market.api';
import type { MARelation } from '../model/report.schema';
import * as Apply from 'fp-ts/lib/Apply.js';
import * as E from 'fp-ts/lib/Either.js';

const ma_relation = (a1: number, a2: number) => (data: MASchema[]): MARelation[] => {
    const ma_a1 = ma(a1)(data);
    const ma_a2 = ma(a2)(data);

    return pipe(
        Apply.sequenceT(E.Apply)(ma_a1, ma_a2),
        E.map(([arr1, arr2]) => {
            const result: MARelation[] = [];

            for (let i = 0; i < arr1.length; i++) {
                const v1 = arr1[i];
                const v2 = arr2[i];

                // Only process when both MAs have values
                if (v1._tag === 'Some' && v2._tag === 'Some') {
                    const val1 = parseFloat(v1.value.value);
                    const val2 = parseFloat(v2.value.value);

                    result.push({
                        a1: val1,
                        a2: val2,
                        ts: v1.value.ts,
                    });
                }
            }
            return result;
        }),
        E.getOrElse(() => [] as MARelation[])
    );
}

const ma = (period: number) => (data: MASchema[]): Either<Error, Option<MASchema>[]> => {
    if (data.length === 0) {
        return left(new Error('No data provided'));
    }

    const result: Option<MASchema>[] = [];
    let sum = 0;

    for (let i = 0; i < data.length; i++) {
        sum += parseFloat(data[i].value);

        if (i < period - 1) {
            result.push(none);
        } else {
            if (i >= period) {
                sum -= parseFloat(data[i - period].value);
            }

            result.push(some({
                ts: data[i].ts,
                value: (sum / period).toString(),
            }));
        }
    }
    return right(result);
}

export const ma_algo = (a1: number, a2: number) => (kbars: KBar[]): MARelation[] =>
    pipe(
        kbars,
        A.map((k: KBar) => ({ ts: k.ts, value: k.close })),  // KBar to MASchema
        ma_relation(a1, a2),
    );
