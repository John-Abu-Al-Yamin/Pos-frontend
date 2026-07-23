import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, CheckCheck, XCircle } from "lucide-react";
import { toast } from "sonner";

import AddEditHeader from "@/customs/AddEditHeader";
import Loading from "@/customs/Loading";
import { Button } from "@/components/ui/button";
import {
  useGetExpenseById,
  usePayExpense,
  useCancelExpense,
} from "@/hooks/Actions/expenses/useCurdsExpenses";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import { expenseCategoryNames } from "@/constants/expenseCategories";

const statusConfig = {
  pending: { label: "معلق", className: "bg-yellow-100 text-yellow-800" },
  paid: { label: "مدفوع", className: "bg-green-100 text-green-800" },
  cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
};

const DetlaisExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending } = useGetExpenseById(id);
  const { mutate: payMutate } = usePayExpense();
  const { mutate: cancelMutate } = useCancelExpense();

  const handlePay = () => {
    toast("هل أنت متأكد من دفع المصروف؟", {
      action: { label: "نعم", onClick: () => payMutate(id) },
      duration: Infinity,
    });
  };

  const handleCancel = () => {
    toast("هل أنت متأكد من إلغاء المصروف؟", {
      action: { label: "نعم", onClick: () => cancelMutate(id) },
      duration: Infinity,
    });
  };

  if (isPending) return <Loading />;

  const expense = data?.data?.data;
  if (!expense) return null;

  const status = statusConfig[expense.status] || statusConfig.pending;

  return (
    <div>
      <AddEditHeader
        title={`تفاصيل المصروف`}
        description={`مصروف ${expenseCategoryNames[expense.expense_category] || expense.expense_category || ""}`}
        backPath="/expenses"
        backText="رجوع"
      />

      <div className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">التصنيف</p>
            <p className="text-sm font-medium">
              {expenseCategoryNames[expense.expense_category] || expense.expense_category || "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">المبلغ</p>
            <p className="text-sm font-medium">
              {formatCurrency(expense.amount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">تاريخ المصروف</p>
            <p className="text-sm font-medium">
              {formatDateTime(expense.expense_date)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">تاريخ الدفع</p>
            <p className="text-sm font-medium">
              {expense.payment_date ? formatDateTime(expense.payment_date) : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">الحالة</p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
            <p className="text-sm font-medium">
              {formatDateTime(expense.created_at)}
            </p>
          </div>
          {expense.notes && (
            <div className="space-y-1 md:col-span-2">
              <p className="text-xs text-muted-foreground">ملاحظات</p>
              <p className="text-sm font-medium">{expense.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 px-6">
        {expense.status === "pending" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/expenses/update/${expense.id}`)}
            >
              <Pencil className="h-4 w-4" />
              تعديل
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handlePay}
            >
              <CheckCheck className="h-4 w-4" />
              دفع
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancel}
            >
              <XCircle className="h-4 w-4" />
              إلغاء
            </Button>
          </>
        )}
        {expense.status === "paid" && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCancel}
          >
            <XCircle className="h-4 w-4" />
            إلغاء
          </Button>
        )}
      </div>
    </div>
  );
};

export default DetlaisExpense;
