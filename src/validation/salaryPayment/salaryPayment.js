import { z } from "zod";

export const salaryPaymentSchema = z.object({
  user_id: z.string().min(1, { message: "الموظف مطلوب" }),
  notes: z.string().optional().or(z.literal("")),
});
