import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "اسم القسم يجب ان يكون على الاقل 2 حروف" })
    .regex(/^[A-Za-z\u0600-\u06FF\s]+$/, {
      message: "الاسم يجب أن يحتوي على حروف فقط بدون أرقام",
    }),
});