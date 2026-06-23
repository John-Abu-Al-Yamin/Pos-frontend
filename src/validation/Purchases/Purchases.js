import { z } from "zod";

export const purchasesSchema = z.object({
  supplier_id: z.string().min(1, { message: "يجب اختيار المورد" }),
  date: z
    .date()
    .nullable()
    .refine((val) => val !== null, {
      message: "يجب اختيار التاريخ",
    }),
  reference: z.string().min(1, { message: "المرجع مطلوب" }),
  type: z.enum(["purchase", "opening_stock"], {
    required_error: "يجب اختيار النوع",
  }),
});
