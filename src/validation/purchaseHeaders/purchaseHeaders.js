import { z } from "zod";

export const purchaseHeadersSchema = z.object({
  supplier_id: z
    .string()
    .min(1, { message: "يرجى اختيار المورد" }),
  supplier_invoice_number: z
    .string()
    .optional(),
  notes: z
    .string()
    .optional(),
});
