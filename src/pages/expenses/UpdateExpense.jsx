import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";

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
import { useGetExpenseById } from "@/hooks/Actions/expenses/useCurdsExpenses";
import usePutData from "@/hooks/curdsHook/usePutData";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import { expensesSchema } from "@/validation/expenses/expenses";
import { expenseCategoryNames, expenseCategories } from "@/constants/expenseCategories";

const UpdateExpense = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: expenseData, isPending: isFetching } = useGetExpenseById(id);
  const { mutate: updateMutate, isPending: isUpdating } = usePutData(
    endPoints.expenses,
    [queryKeys.updateExpenses],
    [queryKeys.expenses, queryKeys.updateExpenses],
  );

  const expense = expenseData?.data?.data;

  const isLocked = expense && expense.status !== "pending";

  const form = useForm({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      expense_category: "",
      amount: "",
      expense_date: "",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (expense) {
      form.reset({
        expense_category: expense.expense_category || "",
        amount: String(expense.amount),
        expense_date: expense.expense_date,
        notes: expense.notes || "",
      });
    }
  }, [expense, form]);

  const onSubmit = (formData) => {
    updateMutate(
      { data: formData, url: `${endPoints.expenses}/${id}` },
      {
        onSuccess: () => {
          navigate("/expenses");
        },
      },
    );
  };

  if (isFetching) return <Loading />;

  return (
    <div>
      <AddEditHeader
        title="تعديل المصروف"
        description="تحديث بيانات المصروف"
        backPath="/expenses"
        backText="رجوع"
      />

      <div className="p-6">
        {isLocked && (
          <div className="flex items-center gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 mb-6 text-sm text-yellow-800">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p>لا يمكن تعديل مصروف تم دفعه أو إلغاؤه</p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense_category">التصنيف</Label>
              <Controller
                name="expense_category"
                control={form.control}
                render={({ field }) => (
                  <Select
                    disabled={isLocked}
                    onValueChange={field.onChange}
                    value={field.value}
                    key={field.value}
                  >
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
                disabled={isLocked}
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
                disabled={isLocked}
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
            <Textarea
              id="notes"
              rows={4}
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

export default UpdateExpense;
