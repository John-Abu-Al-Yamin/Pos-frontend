import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useAddExpenses } from "@/hooks/Actions/expenses/useCurdsExpenses";
import { expensesSchema } from "@/validation/expenses/expenses";
import { expenseCategories } from "@/constants/expenseCategories";

const AddExpense = () => {
  const navigate = useNavigate();

  const { mutate: addMutate, isPending } = useAddExpenses();

  const form = useForm({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      expense_category: "",
      amount: "",
      expense_date: "",
      notes: "",
    },
  });

  const onSubmit = (data) => {
    addMutate(
      { data },
      {
        onSuccess: () => {
          navigate("/expenses");
        },
      },
    );
  };

  return (
    <div>
      <AddEditHeader
        title="إضافة مصروف"
        description="أدخل بيانات المصروف"
        backPath="/expenses"
        backText="رجوع"
      />

      <div className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense_category">التصنيف</Label>
              <Controller
                name="expense_category"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.expense_category && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.expense_category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">المبلغ</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                {...form.register("amount")}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense_date">تاريخ المصروف</Label>
              <Input
                id="expense_date"
                type="date"
                {...form.register("expense_date")}
              />
              {form.formState.errors.expense_date && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.expense_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea id="notes" rows={4} {...form.register("notes")} />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/expenses")}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
