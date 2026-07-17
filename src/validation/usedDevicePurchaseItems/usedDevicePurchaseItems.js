import { z } from "zod";

export const usedDevicePurchaseItemsSchema = z.object({
  product_id: z
    .string()
    .min(1, { message: "يرجى اختيار المنتج" }),
  quantity: z
    .string()
    .min(1, { message: "يرجى إدخال الكمية" }),
  unit_price: z
    .string()
    .min(1, { message: "يرجى إدخال سعر الوحدة" }),
  screen_condition: z
    .string()
    .optional(),
  body_condition: z
    .string()
    .optional(),
  fingerprint_working: z
    .string()
    .optional(),
  face_id_working: z
    .string()
    .optional(),
  notes: z
    .string()
    .optional(),
});
