import { z } from 'zod'

export const VendorCreateSHop = z
  .object({
    name: z.preprocess((val: string) => val?.trim(), z.string().min(1))
  })
  .strict()
export type VendorCreateShopType = z.infer<typeof VendorCreateSHop>
