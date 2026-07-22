import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Smartphone,
  Wrench,
  DollarSign,
} from "lucide-react";

import AddEditHeader from "@/customs/AddEditHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllCustomers } from "@/hooks/Actions/customers/useCurdsCustomers";
import { useAddMaintenanceTickets } from "@/hooks/Actions/MaintenanceTickets/useCurdsMaintenanceTickets";
import { z } from "zod";

const addMaintenanceTicketSchema = z.object({
  customer_id: z.string().min(1, { message: "يرجى اختيار العميل" }),
  device_type: z.string().min(1, { message: "يرجى إدخال نوع الجهاز" }),
  brand: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  color: z.string().optional(),
  condition_notes: z.string().optional(),
  problem_description: z.string().min(1, { message: "يرجى إدخال وصف المشكلة" }),
  received_date: z.string().min(1, { message: "يرجى إدخال تاريخ الاستلام" }),
  advance_payment: z.string().optional(),
  notes: z.string().optional(),
});

const AddMaintenanceTicket = () => {
  const navigate = useNavigate();

  const { data: customersData } = useGetAllCustomers(1, 100);
  const { mutate: addMutate, isPending } = useAddMaintenanceTickets();

  const customers = customersData?.data?.data ?? [];

  const form = useForm({
    resolver: zodResolver(addMaintenanceTicketSchema),
    defaultValues: {
      customer_id: "",
      device_type: "",
      brand: "",
      model: "",
      serial_number: "",
      color: "",
      condition_notes: "",
      problem_description: "",
      received_date: new Date().toISOString().split("T")[0],
      advance_payment: "",
      notes: "",
    },
  });

  const onSubmit = (formData) => {
    addMutate(
      {
        data: {
          customer_id: Number(formData.customer_id),
          device_type: formData.device_type,
          brand: formData.brand || undefined,
          model: formData.model || undefined,
          serial_number: formData.serial_number || undefined,
          color: formData.color || undefined,
          condition_notes: formData.condition_notes || undefined,
          problem_description: formData.problem_description,
          received_date: formData.received_date,
          advance_payment: formData.advance_payment
            ? Number(formData.advance_payment)
            : undefined,
          notes: formData.notes || undefined,
        },
      },
      {
        onSuccess: (response) => {
          const ticketId = response?.data?.data?.id;
          if (ticketId) {
            navigate(`/maintenance-tickets/details/${ticketId}`);
          } else {
            navigate("/maintenance-tickets");
          }
        },
      },
    );
  };

  return (
    <div>
      <AddEditHeader
        title="إضافة تذكرة صيانة"
        description="أدخل بيانات العميل والجهاز ووصف المشكلة لإنشاء تذكرة صيانة جديدة"
        backPath="/maintenance-tickets"
        backText="رجوع"
      />

      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">معلومات العميل</h2>
          </div>
          <p className="text-sm text-muted-foreground mr-7">اختر العميل الذي تطلب الصيانة</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_id">العميل</Label>
              <Controller
                name="customer_id"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem
                          key={customer.id}
                          value={String(customer.id)}
                        >
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.customer_id && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.customer_id.message}
                </p>
              )}
            </div>
          </div>

          <hr className="my-6" />

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">معلومات الجهاز</h2>
            </div>
            <p className="text-sm text-muted-foreground mr-7">أدخل بيانات الجهاز المراد صيانته</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="device_type">نوع الجهاز</Label>
              <Input
                id="device_type"
                placeholder="مثال: Mobile, Laptop, Tablet"
                {...form.register("device_type")}
              />
              {form.formState.errors.device_type && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.device_type.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">العلامة التجارية (اختياري)</Label>
              <Input
                id="brand"
                placeholder="مثال: Samsung, Apple"
                {...form.register("brand")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">الموديل (اختياري)</Label>
              <Input
                id="model"
                placeholder="مثال: iPhone 13, Galaxy A54"
                {...form.register("model")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serial_number">الرقم التسلسلي (اختياري)</Label>
              <Input
                id="serial_number"
                placeholder="IMEI أو الرقم التسلسلي"
                {...form.register("serial_number")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">اللون (اختياري)</Label>
              <Input
                id="color"
                placeholder="مثال: أسود، أزرق"
                {...form.register("color")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="received_date">تاريخ الاستلام</Label>
              <Input
                id="received_date"
                type="date"
                {...form.register("received_date")}
              />
              {form.formState.errors.received_date && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.received_date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="advance_payment">المدفوع مقدمًا (اختياري)</Label>
              <Input
                id="advance_payment"
                type="number"
                min="0"
                step="any"
                {...form.register("advance_payment")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition_notes">
              ملاحظات حالة الجهاز (اختياري)
            </Label>
            <Textarea
              id="condition_notes"
              rows={2}
              placeholder="ملاحظات حول حالة الجهاز الخارجية..."
              {...form.register("condition_notes")}
            />
          </div>

          <hr className="my-6" />

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">وصف المشكلة</h2>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem_description">وصف المشكلة</Label>
            <Textarea
              id="problem_description"
              rows={3}
              placeholder="قم بوصف المشكلة بالتفصيل"
              {...form.register("problem_description")}
            />
            {form.formState.errors.problem_description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.problem_description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات (اختياري)</Label>
            <Textarea id="notes" rows={2} {...form.register("notes")} />
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">ملاحظة حول الدفعة المقدمة</p>
            </div>
            <p className="text-xs text-muted-foreground">
              يمكن إضافة دفعة مقدمة الآن أو لاحقاً من شاشة تفاصيل التذكرة. يمكن
              إضافة عمليات الصيانة وقطع الغيار بعد إنشاء التذكرة.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري الإنشاء..." : "إنشاء تذكرة الصيانة"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/maintenance-tickets")}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenanceTicket;
