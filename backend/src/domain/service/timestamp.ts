import { type TimeStamp, parseTimestamp, compareTimestamp } from '../model/timestamp';

// It should have the ts attribute (Date type)
type TsObject = {
    ts: Date;
    [key: string]: unknown;
};

export type TimeStampFilter = {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
};

const matchesFilter = (ts: TimeStamp, filter: TimeStampFilter): boolean =>
    Object.entries(filter).every(
        ([key, value]) => value === undefined || ts[key as keyof TimeStamp] === value
    );
type tsSnapType = (filter: TimeStampFilter) =>
    <T extends TsObject>(data: T[]) => T[]

export const tsSnapFilter: tsSnapType =
    (filter) => (data) =>
        data.filter((item) => matchesFilter(parseTimestamp(item.ts), filter));

type tsFromToFilterType = (start: TimeStamp, end: TimeStamp) =>
    <T extends TsObject>(data: T[]) => T[]

export const tsFromToFilter: tsFromToFilterType =
    (start, end) => (data) =>
        data.filter((item) => {
            const ts = parseTimestamp(item.ts);
            return compareTimestamp(ts, start) >= 0 && compareTimestamp(ts, end) <= 0;
        });

export type tsFilter = tsSnapType | tsFromToFilterType