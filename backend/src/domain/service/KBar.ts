import type { KBar } from '../model/market.api';
import { pipe } from 'fp-ts/lib/function.js';
import * as A from 'fp-ts/lib/Array.js';
import * as NEA from 'fp-ts/lib/NonEmptyArray.js';
import * as R from 'fp-ts/lib/Record.js';
import { type TimeStamp, parseTimestamp } from '../model/timestamp';

type GroupByKey = 'year' | 'month' | 'day' | 'hour' | 'minute';

const getGroupKey = (ts: TimeStamp, groupBy: GroupByKey): string => {
    const keys: GroupByKey[] = ['year', 'month', 'day', 'hour', 'minute'];
    const index = keys.indexOf(groupBy);
    return keys.slice(0, index + 1).map((k) => ts[k]).join('-');
};

export const groupCompact = (groupBy: GroupByKey) => (kBars: KBar[]): KBar[] =>
    pipe(
        kBars,
        NEA.groupBy((k) => getGroupKey(parseTimestamp(k.ts), groupBy)),
        R.toEntries,
        A.filterMap(([_, group]) => {
            const result = compact(group);
            return result ? { _tag: 'Some' as const, value: result } : { _tag: 'None' as const };
        })
    );

export const compact = (data: KBar[]): KBar | null => {
    // open would be the first data, high and low are the highest and lowest price of the list,
    // close is the last min of the list, volume and amount is the average
    if (data.length === 0) return null;

    const first = data[0];
    const last = data[data.length - 1];

    const highs = data.map((k) => parseFloat(k.high));
    const lows = data.map((k) => parseFloat(k.low));
    const volumes = data.map((k) => parseFloat(k.volume));
    const amounts = data.map((k) => parseFloat(k.amount));

    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;

    return {
        ts: first.ts,
        open: first.open,
        high: Math.max(...highs).toString(),
        low: Math.min(...lows).toString(),
        close: last.close,
        volume: avgVolume.toString(),
        amount: avgAmount.toString(),
    };
};
