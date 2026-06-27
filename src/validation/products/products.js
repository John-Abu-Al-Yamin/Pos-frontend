import { z } from "zod";

export const productsSchema = z.object({
  name: z
    .string()
    .min(1, "اسم المنتج مطلوب")
    .max(100, "اسم المنتج طويل جدًا"),

  category_id: z
    .string()
    .min(1, "يجب اختيار التصنيف"),

  product_category: z.enum(["mobile", "part", "accessory"], {
    required_error: "يجب اختيار تصنيف المنتج",
    invalid_type_error: "تصنيف المنتج غير صالح",
  }),
});