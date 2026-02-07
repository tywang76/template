import { number, z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);

export const MARelationSchema = z.object({
    a1: z.number(),
    a2: z.number(),
    ts: z.date(),
});

export type MARelation = z.infer<typeof MARelationSchema>;

export const MAStatusSchema = z.enum(["None", "Crossed", "Approaching"]);
export type MAStatus = z.infer<typeof MAStatusSchema>;

export const MAReportSchema = z.object({
    stock: z.string(),
    maStatus: z.array(z.object({
        status: MAStatusSchema,
        a1: z.number(),
        a2: z.number(),
        ts: z.date()
    }))
});
export type MAReport = z.infer<typeof MAReportSchema>;