import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { z } from "zod";

import AddEditHeader from "@/customs/AddEditHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Loading from "@/customs/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllCustomers } from "@/hooks/Actions/customers/useCurdsCustomers";
import {
  useGetMaintenanceTicketById,
  useUpdateMaintenanceTickets,
} from "@/hooks/Actions/MaintenanceTickets/useCurdsMaintenanceTickets";

const updateMaintenanceTicketSchema = z.object({
  customer_id: z
    .string()
    .min(1, { message: "يرجى اختيار العميل" }),
  problem_description: z
    .string()
    .min(1, { message: "يرجى إدخال وصف المشكلة" }),
  received_date: z
    .string()
    .min(1, { message: "يرجى إدخال تاريخ الاستلام" }),
  advance_payment: z
    .string()
    .optional(),
  notes: z
    .string()
    .optional(),
});

const lockedStatuses = ["repaired", "delivered", "cancelled"];

const UpdateMaintenanceTicket = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: ticketData, isPending: isFetching } =
    useGetMaintenanceTicketById(id);
  const { data: customersData } = useGetAllCustomers(1, 100);
  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdateMaintenanceTickets(id);

  const ticket = ticketData?.data?.data;
  const customers = customersData?.data?.data ?? [];

  const isLocked = ticket && lockedStatuses.includes(ticket.status);

  const form = useForm({
    resolver: zodResolver(updateMaintenanceTicketSchema),
    defaultValues: {
      customer_id: "",
      problem_description: "",
      received_date: "",
      advance_payment: "",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (ticket) {
      form.reset({
        customer_id: String(ticket.customer_id),
        problem_description: ticket.problem_description || "",
        received_date: ticket.received_date || "",
        advance_payment: ticket.advance_payment ?? "",
        notes: ticket.notes || "",
      });
    }
  }, [ticket, form]);

  const onSubmit = (formData) => {
    updateMutate(
      {
        data: {
          customer_id: Number(formData.customer_id),
          problem_description: formData.problem_description,
          received_date: formData.received_date,
          advance_payment: formData.advance_payment ? Number(formData.advance_payment) : undefined,
          notes: formData.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          navigate("/maintenance-tickets");
        },
      },
    );
  };

  if (isFetching) return <Loading />;

  return (
    <div>
      <AddEditHeader
        title="تعديل تذكرة صيانة"
        description="تحديث بيانات تذكرة الصيانة"
        backPath="/maintenance-tickets"
        backText="رجوع"
      />

      <div className="p-6">
        {isLocked && (
          <div className="flex items-center gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 mb-6 text-sm text-yellow-800">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p>لا يمكن تعديل تذكرة بعد اكتمال الصيانة أو التسليم أو الإلغاء</p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_id">العميل</Label>
              <Controller
                name="customer_id"
                control={form.control}
                render={({ field }) => (
                  <Select
                    disabled={isLocked}
                    onValueChange={field.onChange}
                    value={field.value}
                    key={field.value}
                  >
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

            <div className="space-y-2">
              <Label htmlFor="received_date">تاريخ الاستلام</Label>
              <Input
                id="received_date"
                type="date"
                disabled={isLocked}
                {...form.register("received_date")}
              />
              {form.formState.errors.received_date && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.received_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="advance_payment">المدفوع مقدمًا (اختياري)</Label>
              <Input
                id="advance_payment"
                type="number"
                min="0"
                step="any"
                disabled={isLocked}
                {...form.register("advance_payment")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem_description">وصف المشكلة</Label>
            <Textarea
              id="problem_description"
              rows={3}
              disabled={isLocked}
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
            <Textarea
              id="notes"
              rows={2}
              disabled={isLocked}
              {...form.register("notes")}
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isUpdating || isLocked}>
              {isUpdating ? "جاري التحديث..." : "تحديث"}
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

export default UpdateMaintenanceTicket;
