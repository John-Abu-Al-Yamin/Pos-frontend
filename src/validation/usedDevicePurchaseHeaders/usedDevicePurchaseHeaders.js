import { z } from "zod";

export const usedDevicePurchaseHeadersSchema = z.object({
  purchase_number: z
    .string()
    .min(1, { message: "يرجى إدخال رقم الفاتورة" }),
  customer_id: z
    .string()
    .min(1, { message: "يرجى اختيار العميل" }),
  notes: z
    .string()
    .optional(),
});
