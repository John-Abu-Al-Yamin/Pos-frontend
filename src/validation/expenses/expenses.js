import { z } from "zod";

const EXPENSE_CATEGORIES = [
  "Rent",
  "Salaries",
  "Electricity",
  "Water",
  "Internet",
  "Maintenance",
  "Transportation",
  "Office Supplies",
  "Cleaning",
  "Marketing",
  "Taxes",
  "Miscellaneous",
] ;

export const expensesSchema = z.object({
  title: z
    .string()
    .min(1, { message: "عنوان المصروف مطلوب" }),
  category: z
    .string()
    .refine((val) => EXPENSE_CATEGORIES.includes(val), {
      message: "التصنيف غير صالح",
    }),
  amount: z
    .string()
    .or(z.number())
    .refine((val) => {
      const num = typeof val === "string" ? parseFloat(val) : val;
      return !isNaN(num) && num > 0;
    }, { message: "المبلغ يجب أن يكون أكبر من صفر" }),
  expense_date: z
    .string()
    .min(1, { message: "تاريخ المصروف مطلوب" }),
  notes: z
    .string()
    .optional()
    .or(z.literal("")),
});
