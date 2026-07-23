import { z } from "zod";

export const salaryAssignmentSchema = z.object({
  user_id: z.string().min(1, { message: "الموظف مطلوب" }),
  base_salary: z.string().min(1, { message: "الراتب الأساسي مطلوب" }),
  reason: z.string().optional().or(z.literal("")),
});
