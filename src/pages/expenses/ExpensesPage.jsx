import React from "react";
import { Pencil, Trash2, Eye, Search, X, Receipt, CalendarDays, DollarSign } from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllExpenses,
  useGetExpenseSummary,
  useAddExpense,
  useDeleteExpense,
} from "@/hooks/Actions/expenses/useCurdsExpenses";
import usePutData from "@/hooks/curdsHook/usePutData";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import CustomHeader from "@/customs/CustomHeader";
import Loading from "@/customs/Loading";
import CustomPagination from "@/customs/CustomPagination";
import InfoCard from "@/customs/InfoCard";
import AppModalEdite from "@/customs/AppModalEdite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expensesSchema } from "@/validation/expenses/expenses";

const EXPENSE_CATEGORIES = [
  { value: "Rent", label: "إيجار" },
  { value: "Salaries", label: "رواتب" },
  { value: "Electricity", label: "كهرباء" },
  { value: "Water", label: "مياه" },
  { value: "Internet", label: "إنترنت" },
  { value: "Maintenance", label: "صيانة" },
  { value: "Transportation", label: "مواصلات" },
  { value: "Office Supplies", label: "لوازم مكتبية" },
  { value: "Cleaning", label: "تنظيف" },
  { value: "Marketing", label: "تسويق" },
  { value: "Taxes", label: "ضرائب" },
  { value: "Miscellaneous", label: "متنوع" },
];

const PERIOD_FILTERS = [
  { value: "all", label: "الكل" },
  { value: "today", label: "اليوم" },
  { value: "week", label: "هذا الأسبوع" },
  { value: "month", label: "هذا الشهر" },
];

const FILTER_DEBOUNCE = 300;

const ExpensesPage = () => {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [periodFilter, setPeriodFilter] = React.useState("all");
  const [customFrom, setCustomFrom] = React.useState("");
  const [customTo, setCustomTo] = React.useState("");
  const [editingExpense, setEditingExpense] = React.useState(null);
  const [viewingExpense, setViewingExpense] = React.useState(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), FILTER_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [search]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryFilter, periodFilter, customFrom, customTo]);

  const getDateFilterParams = () => {
    if (periodFilter === "all") return {};
    const now = new Date();

    switch (periodFilter) {
      case "today": {
        const today = now.toISOString().split("T")[0];
        return { from: today, to: today };
      }
      case "week": {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return {
          from: startOfWeek.toISOString().split("T")[0],
          to: endOfWeek.toISOString().split("T")[0],
        };
      }
      case "month": {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
          from: startOfMonth.toISOString().split("T")[0],
          to: endOfMonth.toISOString().split("T")[0],
        };
      }
      default:
        return {};
    }
  };

  const queryParams = {
    page,
    per_page: 10,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(categoryFilter && { category: categoryFilter }),
    ...(periodFilter === "custom" && customFrom && { from: customFrom }),
    ...(periodFilter === "custom" && customTo && { to: customTo }),
    ...(periodFilter !== "all" && periodFilter !== "custom"
      ? getDateFilterParams()
      : {}),
  };

  const { data, isPending } = useGetAllExpenses(queryParams);
  const { data: summaryData } = useGetExpenseSummary();

  const { mutate: addMutate, isPending: addIsPending, error: addError } = useAddExpense();
  const { mutate: deleteMutate } = useDeleteExpense();
  const { mutate: updateMutate, isPending: updateIsPending, error: updateError } = usePutData(
    endPoints.expenses,
    [queryKeys.updateExpenses],
    [queryKeys.expenses, queryKeys.updateExpenses, queryKeys.expenseSummary, queryKeys.dashboard],
  );

  const expenses = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const summary = summaryData?.data?.data ?? {};

  const form = useForm({
    resolver: zodResolver(expensesSchema),
    defaultValues: { title: "", category: "", amount: "", expense_date: "", notes: "" },
  });

  const editForm = useForm({
    resolver: zodResolver(expensesSchema),
    defaultValues: { title: "", category: "", amount: "", expense_date: "", notes: "" },
  });

  const onSubmit = (formData) => {
    addMutate(
      { data: { ...formData, amount: parseFloat(formData.amount) } },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  const onEditSubmit = (formData) => {
    updateMutate(
      {
        data: { ...formData, amount: parseFloat(formData.amount) },
        url: `${endPoints.expenses}/${editingExpense.id}`,
      },
      {
        onSuccess: () => {
          editForm.reset();
          setEditingExpense(null);
        },
      },
    );
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    editForm.reset({
      title: expense.title,
      category: expense.category,
      amount: String(expense.amount),
      expense_date: expense.expense_date,
      notes: expense.notes ?? "",
    });
  };

  const openViewModal = (expense) => {
    setViewingExpense(expense);
  };

  const confirmDelete = (expenseId) => {
    toast("هل أنت متأكد من الحذف؟", {
      action: {
        label: "نعم",
        onClick: () => deleteMutate({ id: expenseId }),
      },
      duration: Infinity,
    });
  };

  const hasActiveFilters = debouncedSearch || categoryFilter || periodFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategoryFilter("");
    setPeriodFilter("all");
    setCustomFrom("");
    setCustomTo("");
    setPage(1);
  };

  if (isPending) return <Loading />;

  return (
    <div>
      <CustomHeader
        title="المصروفات"
        description="قائمة المصروفات التشغيلية"
        buttonText="مصروف"
        addModal={{
          title: "إضافة مصروف جديد",
          description: "أدخل تفاصيل المصروف",
          onSubmit: form.handleSubmit(onSubmit),
          isLoading: addIsPending,
          error: addError?.response?.data?.errors?.map((e) => e.message),
          submitText: "حفظ",
          children: (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان المصروف</Label>
                <Input id="title" {...form.register("title")} />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">التصنيف</Label>
                <Select
                  value={form.watch("category") || undefined}
                  onValueChange={(v) => form.setValue("category", v, { shouldValidate: true })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">المبلغ</Label>
                <Input id="amount" type="number" step="0.01" min="0.01" {...form.register("amount")} />
                {form.formState.errors.amount && (
                  <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense_date">تاريخ المصروف</Label>
                <Input id="expense_date" type="date" {...form.register("expense_date")} />
                {form.formState.errors.expense_date && (
                  <p className="text-sm text-destructive">{form.formState.errors.expense_date.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea id="notes" {...form.register("notes")} />
              </div>
            </div>
          ),
        }}
      />

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <InfoCard
          icon={DollarSign}
          label="مصروفات اليوم"
          value={summary.today !== undefined ? formatCurrency(summary.today) : "—"}
        />
        <InfoCard
          icon={CalendarDays}
          label="مصروفات هذا الشهر"
          value={summary.thisMonth !== undefined ? formatCurrency(summary.thisMonth) : "—"}
        />
        <InfoCard
          icon={Receipt}
          label="إجمالي المصروفات"
          value={summary.total !== undefined ? formatCurrency(summary.total) : "—"}
        />
      </div>

      {/* Search and Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            dir="rtl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بعنوان المصروف أو التصنيف..."
            className="w-full pr-9 pl-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Select value={categoryFilter || undefined} onValueChange={(v) => setCategoryFilter(v ?? "")}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="جميع التصنيفات" />
          </SelectTrigger>
          <SelectContent>
            {EXPENSE_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="الفترة" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_FILTERS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
            <SelectItem value="custom">مخصص</SelectItem>
          </SelectContent>
        </Select>
        {periodFilter === "custom" && (
          <>
            <Input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="w-[140px]"
            />
            <Input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="w-[140px]"
            />
          </>
        )}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
            مسح الكل
          </button>
        )}
      </div>

      {/* Expenses Table */}
      <div className="rounded-md border bg-white shadow-sm mt-4" dir="rtl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">عنوان المصروف</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">المبلغ</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">أضيف بواسطة</TableHead>
              <TableHead className="text-right">ملاحظات</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.id}</TableCell>
                <TableCell className="font-medium">{expense.title}</TableCell>
                <TableCell>
                  {EXPENSE_CATEGORIES.find((c) => c.value === expense.category)?.label ?? expense.category}
                </TableCell>
                <TableCell className="font-semibold text-sm">
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell className="text-xs">{expense.expense_date}</TableCell>
                <TableCell className="text-xs">{expense.created_by?.name ?? "—"}</TableCell>
                <TableCell className="text-xs max-w-[150px] truncate">
                  {expense.notes || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openViewModal(expense)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(expense)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {expenses.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            لا توجد مصروفات تطابق البحث.
          </div>
        )}

        <CustomPagination
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Edit Modal */}
      <AppModalEdite
        open={!!editingExpense}
        onOpenChange={(open) => {
          if (!open) {
            setEditingExpense(null);
            editForm.reset();
          }
        }}
        title="تعديل المصروف"
        description="تعديل تفاصيل المصروف"
        onSubmit={editForm.handleSubmit(onEditSubmit)}
        isLoading={updateIsPending}
        error={updateError?.response?.data?.errors?.map((e) => e.message)}
        submitText="تحديث"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">عنوان المصروف</Label>
            <Input id="edit-title" {...editForm.register("title")} />
            {editForm.formState.errors.title && (
              <p className="text-sm text-destructive">{editForm.formState.errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">التصنيف</Label>
            <Select
              value={editForm.watch("category") || undefined}
              onValueChange={(v) => editForm.setValue("category", v, { shouldValidate: true })}
            >
              <SelectTrigger id="edit-category">
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {editForm.formState.errors.category && (
              <p className="text-sm text-destructive">{editForm.formState.errors.category.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-amount">المبلغ</Label>
            <Input id="edit-amount" type="number" step="0.01" min="0.01" {...editForm.register("amount")} />
            {editForm.formState.errors.amount && (
              <p className="text-sm text-destructive">{editForm.formState.errors.amount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-expense_date">تاريخ المصروف</Label>
            <Input id="edit-expense_date" type="date" {...editForm.register("expense_date")} />
            {editForm.formState.errors.expense_date && (
              <p className="text-sm text-destructive">{editForm.formState.errors.expense_date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-notes">ملاحظات</Label>
            <Textarea id="edit-notes" {...editForm.register("notes")} />
          </div>
        </div>
      </AppModalEdite>

      {/* View Modal */}
      <AppModalEdite
        open={!!viewingExpense}
        onOpenChange={(open) => {
          if (!open) setViewingExpense(null);
        }}
        title="تفاصيل المصروف"
        description="عرض تفاصيل المصروف"
        submitText="إغلاق"
        onSubmit={() => setViewingExpense(null)}
      >
        {viewingExpense && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">عنوان المصروف</Label>
                <p className="text-sm font-medium">{viewingExpense.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">التصنيف</Label>
                <p className="text-sm font-medium">
                  {EXPENSE_CATEGORIES.find((c) => c.value === viewingExpense.category)?.label ?? viewingExpense.category}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">المبلغ</Label>
                <p className="text-sm font-medium">{formatCurrency(viewingExpense.amount)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">التاريخ</Label>
                <p className="text-sm font-medium">{viewingExpense.expense_date}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">أضيف بواسطة</Label>
                <p className="text-sm font-medium">{viewingExpense.created_by?.name ?? "—"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">تاريخ الإضافة</Label>
                <p className="text-sm font-medium">{formatDate(viewingExpense.created_at)}</p>
              </div>
            </div>
            {viewingExpense.notes && (
              <div>
                <Label className="text-muted-foreground text-xs">ملاحظات</Label>
                <p className="text-sm font-medium">{viewingExpense.notes}</p>
              </div>
            )}
          </div>
        )}
      </AppModalEdite>
    </div>
  );
};

export default ExpensesPage;
