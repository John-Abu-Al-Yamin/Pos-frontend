import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AddEditHeader from "@/customs/AddEditHeader";
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
import { useGetAllUsers } from "@/hooks/Actions/users/useCurdsUsers";
import { useAddSalaryPayment } from "@/hooks/Actions/Salary/useCurdsSalaryPayments";
import { salaryPaymentSchema } from "@/validation/salaryPayment/salaryPayment";

const today = new Date();
const currentDay = today.getDate();
const isPayrollWindow = currentDay >= 1 && currentDay <= 5;

const currentMonth = today.toLocaleDateString("ar-EG", { year: "numeric", month: "long" });
const periodStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
const periodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  .toISOString()
  .split("T")[0];

const AddSalaryPayment = () => {
  const navigate = useNavigate();

  const { mutate: addMutate, isPending } = useAddSalaryPayment();
  const { data: usersData } = useGetAllUsers(1, 500, { role: "employee" });

  const users = usersData?.data?.data ?? [];

  const form = useForm({
    resolver: zodResolver(salaryPaymentSchema),
    defaultValues: {
      user_id: "",
      notes: "",
    },
  });

  const onSubmit = (formData) => {
    const payload = {
      user_id: Number(formData.user_id),
      notes: formData.notes || undefined,
    };

    addMutate(
      { data: payload },
      {
        onSuccess: (response) => {
          const paymentId = response?.data?.data?.id;
          if (paymentId) {
            navigate(`/salary-payments/details/${paymentId}`);
          } else {
            navigate("/salary-payments");
          }
        },
      },
    );
  };

  return (
    <div>
      <AddEditHeader
        title="إضافة دفعة راتب"
        description="أدخل بيانات دفعة الراتب الشهرية"
        backPath="/salary-payments"
        backText="رجوع"
      />

      <div className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-md border bg-muted/30 p-4 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">فترة الدفع (شهرية)</p>
            <p className="text-base font-semibold">{currentMonth}</p>
            <p className="text-sm text-muted-foreground">
              من {periodStart} إلى {periodEnd}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user_id">الموظف</Label>
              <Controller
                name="user_id"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر الموظف" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.user_id && (
                <p className="text-sm text-destructive">{form.formState.errors.user_id.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea id="notes" rows={4} {...form.register("notes")} />
          </div>

          {!isPayrollWindow && (
            <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3">
              <p className="text-sm text-destructive font-medium">
                لا يمكن إنشاء المرتب بعد يوم 5 من الشهر
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isPending || !isPayrollWindow}>
              {isPending ? "جاري الإنشاء..." : "إنشاء الدفعة"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/salary-payments")}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalaryPayment;
