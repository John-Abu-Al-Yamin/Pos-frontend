import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, CheckCheck, XCircle, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

import CustomHeader from "@/customs/CustomHeader";
import CustomPagination from "@/customs/CustomPagination";
import Loading from "@/customs/Loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  useGetAllExpenses,
  usePayExpense,
  useCancelExpense,
} from "@/hooks/Actions/expenses/useCurdsExpenses";
import { useDeleteExpenses } from "@/hooks/Actions/expenses/useCurdsExpenses";
import useSearch from "@/hooks/useSearch/useSearch";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import { expenseCategoryNames, expenseCategories } from "@/constants/expenseCategories";

const statusConfig = {
  pending: { label: "معلق", className: "bg-yellow-100 text-yellow-800" },
  paid: { label: "مدفوع", className: "bg-green-100 text-green-800" },
  cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
};

const statusOptions = [
  { value: "pending", label: "معلق" },
  { value: "paid", label: "مدفوع" },
  { value: "cancelled", label: "ملغي" },
];

const ExpensesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const [filterStatus, setFilterStatus] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState("");
  const { debouncedSearch, search, handelSearch, setSearch } = useSearch("", 400);

  const filters = {
    search: debouncedSearch || undefined,
    status: filterStatus || undefined,
    expense_category: filterCategory || undefined,
  };

  const { data, isPending } = useGetAllExpenses(page, per_page, filters);
  const { mutate: payMutate } = usePayExpense();
  const { mutate: cancelMutate } = useCancelExpense();
  const { mutate: deleteMutate } = useDeleteExpenses();

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus, filterCategory]);

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterCategory("");
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || filterStatus || filterCategory;

  const handlePay = (id) => {
    toast("هل أنت متأكد من دفع المصروف؟", {
      action: { label: "نعم", onClick: () => payMutate(id) },
      duration: Infinity,
    });
  };

  const handleCancel = (id) => {
    toast("هل أنت متأكد من إلغاء المصروف؟", {
      action: { label: "نعم", onClick: () => cancelMutate(id) },
      duration: Infinity,
    });
  };

  const confirmDelete = (id) => {
    toast("هل أنت متأكد من الحذف؟", {
      action: { label: "نعم", onClick: () => deleteMutate({ id }) },
      duration: Infinity,
    });
  };

  if (isPending) return <Loading />;

  const expenses = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div>
      <CustomHeader
        title="المصروفات"
        description="قائمة المصروفات"
        buttonText="مصروف"
        onButtonClick={() => navigate("/expenses/add")}
      />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="relative w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث في الملاحظات..."
            value={search}
            onChange={handelSearch}
            className="pr-9"
          />
        </div>

        <div className="w-44">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-44">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="التصنيف" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button variant="outline" size="icon" onClick={clearFilters} title="مسح الفلترة">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">المبلغ</TableHead>
              <TableHead className="text-right">تاريخ المصروف</TableHead>
              <TableHead className="text-right">تاريخ الدفع</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">ملاحظات</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense, index) => {
              const status = statusConfig[expense.status] || statusConfig.pending;
              return (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {expenseCategoryNames[expense.expense_category] || expense.expense_category || "—"}
                  </TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>{formatDateTime(expense.expense_date)}</TableCell>
                  <TableCell>
                    {expense.payment_date ? formatDateTime(expense.payment_date) : "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {expense.notes || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/expenses/details/${expense.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        عرض
                      </Button>
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
                            onClick={() => handlePay(expense.id)}
                          >
                            <CheckCheck className="h-4 w-4" />
                            دفع
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancel(expense.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            إلغاء
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDelete(expense.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            حذف
                          </Button>
                        </>
                      )}
                      {expense.status === "paid" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(expense.id)}
                        >
                          <XCircle className="h-4 w-4" />
                          إلغاء
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {expenses.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  لا توجد مصروفات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CustomPagination
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default ExpensesPage;
