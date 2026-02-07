import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);

export const KBarSchema = z.object({
    ts: z.date(),
    open: z.string(),
    high: z.string(),
    low: z.string(),
    close: z.string(),
    volume: z.string(),
    amount: z.string(),
});

export const MASchema = z.object({
    ts: z.date(),
    value: z.string(), // can be open, close, high, low, etc.
});
export type KBar = z.infer<typeof KBarSchema>;
export type MASchema = z.infer<typeof MASchema>;