import { z } from "zod";

export const maintenanceOperationsSchema = z.object({
  name: z
    .string()
    .min(1, { message: "يرجى إدخال اسم العملية" }),
  cost: z
    .string()
    .min(1, { message: "يرجى إدخال التكلفة" }),
  notes: z
    .string()
    .optional(),
});
