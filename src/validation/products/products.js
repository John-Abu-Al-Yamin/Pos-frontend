import { z } from "zod";

export const productsSchema = z.object({
  name: z
    .string()
    .min(1, "اسم المنتج مطلوب")
    .max(100, "اسم المنتج طويل جدًا"),

  category_id: z
    .string()
    .min(1, "يجب اختيار التصنيف"),

  is_serialized: z.boolean({
    required_error: "يجب تحديد هل المنتج مُسلسل أم لا",
  }),
});