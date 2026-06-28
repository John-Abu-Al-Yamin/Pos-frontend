import { z } from "zod";

const ADJUSTMENT_REASONS = [
  "Damaged",
  "Broken",
  "Lost",
  "Stolen",
  "Stock count correction",
  "Internal use",
  "Supplier gift",
  "Manual adjustment",
  "Other",
];

export const inventoryAdjustmentSchema = z.object({
  product_id: z.string().min(1, { message: "المنتج مطلوب" }),
  quantity_after: z
    .string()
    .or(z.number())
    .refine((val) => {
      const num = typeof val === "string" ? parseInt(val) : val;
      return !isNaN(num) && num >= 0;
    }, { message: "الكمية الجديدة يجب أن تكون 0 أو أكثر" }),
  reason: z
    .string()
    .refine((val) => ADJUSTMENT_REASONS.includes(val), {
      message: "سبب التسوية غير صالح",
    }),
  notes: z
    .string()
    .optional()
    .or(z.literal("")),
});
