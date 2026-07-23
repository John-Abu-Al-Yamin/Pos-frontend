import { z } from "zod";

export const expensesSchema = z.object({
  expense_category: z
    .string()
    .min(1, { message: "التصنيف مطلوب" }),
  amount: z
    .string()
    .min(1, { message: "المبلغ مطلوب" }),
  expense_date: z
    .string()
    .min(1, { message: "تاريخ المصروف مطلوب" }),
  notes: z
    .string()
    .optional()
    .or(z.literal("")),
});
