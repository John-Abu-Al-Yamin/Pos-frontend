import { z } from "zod";

export const productsSchema = z.object({
  name: z
    .string()
    .min(2, { message: "اسم المنتج يجب ان يكون على الاقل 2 حروف" }),
  category_id: z
    .string()
    .min(1, { message: "يرجى اختيار التصنيف" }),
  brand_id: z
    .string()
    .min(1, { message: "يرجى اختيار العلامة التجارية" }),
  type: z
    .string()
    .min(1, { message: "يرجى اختيار النوع" }),
  min_stock: z
    .string()
    .optional(),
});
