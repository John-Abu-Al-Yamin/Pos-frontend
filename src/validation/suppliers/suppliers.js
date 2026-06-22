import { z } from "zod";

export const suppliersSchema = z.object({
  name: z
    .string()
    .min(2, { message: "اسم المورد يجب ان يكون على الاقل 2 حروف" })
    .refine((val) => /^[^\d]+$/.test(val), {
      message: "اسم المورد لا يجب ان يحتوي على أرقام",
    }),

  phone: z
    .string()
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, {
      message: "رقم الهاتف يجب أن يكون رقم مصري صحيح",
    }),
});