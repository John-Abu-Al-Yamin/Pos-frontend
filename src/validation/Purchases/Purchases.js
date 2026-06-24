import { z } from "zod";

export const purchasesSchema = z
  .object({
    supplier_id: z.string().optional(),
    date: z
      .date()
      .nullable()
      .refine((val) => val !== null, {
        message: "يجب اختيار التاريخ",
      }),
    reference: z.string().min(1, {
      message: "المرجع مطلوب",
    }),
    type: z.enum(["purchase", "opening_stock"]),
  })
  .superRefine((data, ctx) => {
    if (data.type === "purchase" && !data.supplier_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["supplier_id"],
        message: "يجب اختيار المورد",
      });
    }
  });
