import { z } from "zod";

export const maintenanceSparePartsSchema = z.object({
  product_id: z
    .string()
    .min(1, { message: "يرجى اختيار قطعة الغيار" }),
  quantity: z
    .string()
    .min(1, { message: "يرجى إدخال الكمية" }),
});
