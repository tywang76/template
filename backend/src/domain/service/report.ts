import { pipe } from 'fp-ts/lib/function.js';
import * as A from 'fp-ts/lib/Array.js';
import type { MARelation, MAReport, MAStatus } from '../model/report.schema';

type StatusItem = { status: MAStatus; a1: number; a2: number; ts: Date };

const getStatus = (prevDiff: number | null, val1: number, val2: number): MAStatus => {
    const diff = val1 - val2;
    const crossed = prevDiff !== null &&
        ((prevDiff >= 0 && diff < 0) || (prevDiff < 0 && diff >= 0));
    const gap = Math.abs((val2 - val1) / val2);
    const approaching = gap <= 0.02;
    return crossed ? "Crossed" : approaching ? "Approaching" : "None";
};

const toStatusItems = (relations: MARelation[]): StatusItem[] => {
    let prevDiff: number | null = null;
    return relations.map((r) => {
        const status = getStatus(prevDiff, r.a1, r.a2);
        prevDiff = r.a1 - r.a2;
        return { status, a1: r.a1, a2: r.a2, ts: r.ts };
    });
};

export const ma_report = (stock: string, MARelations: MARelation[]): MAReport =>
    pipe(
        MARelations,
        toStatusItems,
        A.filter((item) => item.status !== "None"),
        (maStatus) => ({ stock, maStatus })
    );
