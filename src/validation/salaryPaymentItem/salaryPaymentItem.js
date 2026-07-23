import { z } from "zod";

export const salaryPaymentItemSchema = z.object({
  type: z.string().min(1, { message: "النوع مطلوب" }),
  label: z.string().min(1, { message: "الوصف مطلوب" }),
  amount: z.string().min(1, { message: "المبلغ مطلوب" }),
});
