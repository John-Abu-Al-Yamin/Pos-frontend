import { z } from "zod";

export const markupSettingSchema = z.object({
  product_type: z.enum(["new_mobile", "used_mobile", "accessory", "spare_part"], {
    required_error: "نوع المنتج مطلوب",
    message: "نوع المنتج يجب ان يكون موبايل او اكسسوار او قطعة غيار",
  }),
  profit_percentage: z.coerce
    .number({ required_error: "نسبة الربح مطلوبة" })
    .min(0, { message: "نسبة الربح يجب ان تكون اكبر من 0" })
    .max(999.99, { message: "نسبة الربح يجب ان تكون اقل من 1000" }),
});
