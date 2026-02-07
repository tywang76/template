import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { KBarSchema } from './market.api';
extendZodWithOpenApi(z);

export const StockSchema = z.object({
    stock: z.string(),
    kbar: z.array(KBarSchema)
})
export type Stock = z.infer<typeof StockSchema>;