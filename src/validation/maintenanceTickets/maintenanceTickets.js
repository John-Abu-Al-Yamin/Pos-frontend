import { z } from "zod";

export const maintenanceTicketsSchema = z.object({
  customer_id: z
    .string()
    .min(1, { message: "يرجى اختيار العميل" }),
  device_type: z
    .string()
    .min(1, { message: "يرجى إدخال نوع الجهاز" }),
  device_model: z
    .string()
    .min(1, { message: "يرجى إدخال موديل الجهاز" }),
  serial_number: z
    .string()
    .optional(),
  issue_description: z
    .string()
    .min(1, { message: "يرجى إدخال وصف المشكلة" }),
  notes: z
    .string()
    .optional(),
});
