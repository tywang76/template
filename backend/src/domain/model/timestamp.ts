import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);

export const TimeStampSchema = z.object({
    year: z.number(),
    month: z.number(),
    day: z.number(),
    hour: z.number(),
    minute: z.number(),
    second: z.number(),
});
export type TimeStamp = z.infer<typeof TimeStampSchema>;

const UTC_OFFSET_HOURS = 8; // UTC+8 (Taiwan)

// Date (UTC) -> TimeStamp (UTC+8)
export const parseTimestamp = (ts: Date): TimeStamp => {
    // Add UTC+8 offset
    const utc8 = new Date(ts.getTime() + UTC_OFFSET_HOURS * 60 * 60 * 1000);
    return {
        year: utc8.getUTCFullYear(),
        month: utc8.getUTCMonth() + 1,
        day: utc8.getUTCDate(),
        hour: utc8.getUTCHours(),
        minute: utc8.getUTCMinutes(),
        second: utc8.getUTCSeconds(),
    };
};

// TimeStamp (UTC+8) -> Date (UTC)
export const toDate = (ts: TimeStamp): Date => {
    const utc8 = Date.UTC(ts.year, ts.month - 1, ts.day, ts.hour, ts.minute, ts.second);
    return new Date(utc8 - UTC_OFFSET_HOURS * 60 * 60 * 1000);
};

// TimeStamp -> "2025-07-01 09:00:00"
export const formatTimestamp = (ts: TimeStamp): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${ts.year}-${pad(ts.month)}-${pad(ts.day)} ${pad(ts.hour)}:${pad(ts.minute)}:${pad(ts.second)}`;
};

// "2025-07-01 09:00:00" -> TimeStamp
export const parseTimestampString = (str: string): TimeStamp => {
    const [date, time] = str.split(' ');
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute, second] = time.split(':').map(Number);
    return { year, month, day, hour, minute, second };
};

// TimeStamp -> "2025-07-01"
export const formatDate = (ts: TimeStamp): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${ts.year}-${pad(ts.month)}-${pad(ts.day)}`;
};

// TimeStamp -> "2025-07"
export const formatMonth = (ts: TimeStamp): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${ts.year}-${pad(ts.month)}`;
};

// Compare two timestamps: -1 (a < b), 0 (a == b), 1 (a > b)
export const compareTimestamp = (a: TimeStamp, b: TimeStamp): number => {
    const keys: (keyof TimeStamp)[] = ['year', 'month', 'day', 'hour', 'minute', 'second'];
    for (const key of keys) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
    }
    return 0;
};