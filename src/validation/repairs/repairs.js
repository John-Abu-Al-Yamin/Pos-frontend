import { z } from "zod";

export const repairsSchema = z.object({
  customer_id: z.string().optional(),
  customer_name: z.string().optional(),
  customer_phone: z.string().optional(),
  device_type: z.string().min(1, { message: "نوع الجهاز مطلوب" }),
  device_serial: z.string().optional(),
  issue_description: z.string().min(1, { message: "وصف المشكلة مطلوب" }),
  work_description: z.string().optional(),
  estimated_cost: z.string().optional(),
  deposit: z.string().optional(),
  expected_delivery_date: z.date().nullable().optional(),
  status: z.string().optional(),
  parts: z.array(z.object({
    stock_item_id: z.string().min(1),
    product_name: z.string().optional(),
    serial_number: z.string().optional(),
    cost_price: z.string().optional(),
  })).optional(),
});
