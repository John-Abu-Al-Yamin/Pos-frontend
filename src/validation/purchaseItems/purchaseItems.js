import { z } from "zod";

export const purchaseItemsSchema = z.object({
  product_id: z
    .string()
    .min(1, { message: "يرجى اختيار المنتج" }),
  quantity: z
    .string()
    .min(1, { message: "يرجى إدخال الكمية" }),
  unit_cost: z
    .string()
    .min(1, { message: "يرجى إدخال سعر الوحدة" }),
});
