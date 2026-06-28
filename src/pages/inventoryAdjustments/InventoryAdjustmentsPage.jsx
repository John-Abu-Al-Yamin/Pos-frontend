import React from "react";
import { Search, X, Eye, Trash2, ClipboardList, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllInventoryAdjustments,
  useGetInventoryAdjustmentsSummary,
  useAddInventoryAdjustment,
  useDeleteInventoryAdjustment,
} from "@/hooks/Actions/inventoryAdjustments/useCurdsInventoryAdjustments";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import CustomHeader from "@/customs/CustomHeader";
import Loading from "@/customs/Loading";
import CustomPagination from "@/customs/CustomPagination";
import InfoCard from "@/customs/InfoCard";
import AppModalEdite from "@/customs/AppModalEdite";
import ProductSearchCombobox from "@/customs/ProductSearchCombobox";
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
import { formatDate } from "@/lib/utils";
import getRequest from "@/hooks/handleRequest/GetRequest";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventoryAdjustmentSchema } from "@/validation/inventoryAdjustments/inventoryAdjustments";

const ADJUSTMENT_REASONS = [
  { value: "Damaged", label: "تالف" },
  { value: "Broken", label: "مكسور" },
  { value: "Lost", label: "مفقود" },
  { value: "Stolen", label: "مسروق" },
  { value: "Stock count correction", label: "تصحيح الجرد" },
  { value: "Internal use", label: "استخدام داخلي" },
  { value: "Supplier gift", label: "هدية مورد" },
  { value: "Manual adjustment", label: "تسوية يدوية" },
  { value: "Other", label: "أخرى" },
];

const PERIOD_FILTERS = [
  { value: "all", label: "الكل" },
  { value: "today", label: "اليوم" },
  { value: "week", label: "هذا الأسبوع" },
  { value: "month", label: "هذا الشهر" },
];

const FILTER_DEBOUNCE = 300;

const InventoryAdjustmentsPage = () => {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [reasonFilter, setReasonFilter] = React.useState("");
  const [productFilter, setProductFilter] = React.useState("");
  const [periodFilter, setPeriodFilter] = React.useState("all");
  const [customFrom, setCustomFrom] = React.useState("");
  const [customTo, setCustomTo] = React.useState("");
  const [viewingAdjustment, setViewingAdjustment] = React.useState(null);

  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [currentQuantity, setCurrentQuantity] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), FILTER_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [search]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, reasonFilter, productFilter, periodFilter, customFrom, customTo]);

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
    ...(reasonFilter && { reason: reasonFilter }),
    ...(productFilter && { product_id: productFilter }),
    ...(periodFilter === "custom" && customFrom && { from: customFrom }),
    ...(periodFilter === "custom" && customTo && { to: customTo }),
    ...(periodFilter !== "all" && periodFilter !== "custom"
      ? getDateFilterParams()
      : {}),
  };

  const { data, isPending } = useGetAllInventoryAdjustments(queryParams);
  const { data: summaryData } = useGetInventoryAdjustmentsSummary();

  const { mutate: addMutate, isPending: addIsPending, error: addError } = useAddInventoryAdjustment();
  const { mutate: deleteMutate } = useDeleteInventoryAdjustment();

  const adjustments = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const summary = summaryData?.data?.data ?? {};

  const form = useForm({
    resolver: zodResolver(inventoryAdjustmentSchema),
    defaultValues: { product_id: "", quantity_after: "", reason: "", notes: "" },
  });

  const watchQuantityAfter = form.watch("quantity_after");

  const onSubmit = (formData) => {
    addMutate(
      {
        data: {
          product_id: parseInt(formData.product_id),
          quantity_after: parseInt(formData.quantity_after),
          reason: formData.reason,
          notes: formData.notes || null,
        },
      },
      {
        onSuccess: () => {
          form.reset();
          setSelectedProduct(null);
          setCurrentQuantity(0);
        },
      },
    );
  };

  const confirmDelete = (id) => {
    toast("هل أنت متأكد من الحذف؟", {
      action: {
        label: "نعم",
        onClick: () => deleteMutate({ id }),
      },
      duration: Infinity,
    });
  };

  const hasActiveFilters = debouncedSearch || reasonFilter || productFilter || periodFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setReasonFilter("");
    setProductFilter("");
    setPeriodFilter("all");
    setCustomFrom("");
    setCustomTo("");
    setPage(1);
  };

  const handleProductSelect = async (product) => {
    setSelectedProduct(product);
    form.setValue("product_id", String(product.id), { shouldValidate: true });
    try {
      const res = await getRequest(`${endPoints.stockItems}/available`, null, {
        params: { product_id: product.id, per_page: 1 },
      });
      const count = res?.data?.pagination?.total ?? 0;
      setCurrentQuantity(count);
    } catch {
      setCurrentQuantity(0);
    }
  };

  const parsedQuantityAfter = parseInt(watchQuantityAfter);
  const calculatedDifference = !isNaN(parsedQuantityAfter)
    ? parsedQuantityAfter - currentQuantity
    : 0;

  if (isPending) return <Loading />;

  return (
    <div>
      <CustomHeader
        title="تسويات المخزون"
        description="تسجيل التعديلات اليدوية على المخزون"
        buttonText="تسوية"
        addModal={{
          title: "إضافة تسوية مخزون",
          description: "أدخل تفاصيل تسوية المخزون",
          onSubmit: form.handleSubmit(onSubmit),
          isLoading: addIsPending,
          error: addError?.response?.data?.errors?.map((e) => e.message),
          submitText: "حفظ",
          children: (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">المنتج</Label>
                <ProductSearchCombobox
                  value={form.watch("product_id")}
                  onSelect={handleProductSelect}
                  placeholder="اختر المنتج"
                />
                {form.formState.errors.product_id && (
                  <p className="text-sm text-destructive">{form.formState.errors.product_id.message}</p>
                )}
              </div>

              {selectedProduct && (
                <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                  {currentQuantity !== null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">الكمية الحالية:</span>
                      <span className="font-semibold">{currentQuantity}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="quantity_after">الكمية الجديدة</Label>
                    <Input
                      id="quantity_after"
                      type="number"
                      min="0"
                      dir="ltr"
                      placeholder="أدخل الكمية الجديدة"
                      {...form.register("quantity_after")}
                    />
                    {form.formState.errors.quantity_after && (
                      <p className="text-sm text-destructive">{form.formState.errors.quantity_after.message}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الفرق:</span>
                    <span className={`font-semibold ${calculatedDifference > 0 ? "text-green-600" : calculatedDifference < 0 ? "text-red-600" : ""}`}>
                      {calculatedDifference > 0 ? "+" : ""}{calculatedDifference}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">سبب التسوية</Label>
                <Select
                  value={form.watch("reason") || undefined}
                  onValueChange={(v) => form.setValue("reason", v, { shouldValidate: true })}
                >
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="اختر سبب التسوية" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADJUSTMENT_REASONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.reason && (
                  <p className="text-sm text-destructive">{form.formState.errors.reason.message}</p>
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
          icon={ClipboardList}
          label="تسويات اليوم"
          value={summary.today_count !== undefined ? summary.today_count : "—"}
        />
        <InfoCard
          icon={ArrowUp}
          label="إجمالي الزيادة"
          value={summary.today_increased !== undefined ? summary.today_increased : "—"}
          accent
        />
        <InfoCard
          icon={ArrowDown}
          label="إجمالي النقص"
          value={summary.today_decreased !== undefined ? summary.today_decreased : "—"}
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
            placeholder="بحث باسم المنتج أو سبب التسوية..."
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
        <Select value={reasonFilter || undefined} onValueChange={(v) => setReasonFilter(v ?? "")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="جميع الأسباب" />
          </SelectTrigger>
          <SelectContent>
            {ADJUSTMENT_REASONS.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
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

      {/* Inventory Adjustments Table */}
      <div className="rounded-md border bg-white shadow-sm mt-4" dir="rtl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">المنتج</TableHead>
              <TableHead className="text-right">الكمية قبل</TableHead>
              <TableHead className="text-right">الكمية بعد</TableHead>
              <TableHead className="text-right">الفرق</TableHead>
              <TableHead className="text-right">السبب</TableHead>
              <TableHead className="text-right">بواسطة</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adjustments.map((adj) => (
              <TableRow key={adj.id}>
                <TableCell className="font-medium">{adj.id}</TableCell>
                <TableCell className="font-medium">{adj.product?.name}</TableCell>
                <TableCell className="text-xs">{adj.quantity_before}</TableCell>
                <TableCell className="text-xs">{adj.quantity_after}</TableCell>
                <TableCell>
                  <span className={`font-semibold text-sm ${adj.difference > 0 ? "text-green-600" : adj.difference < 0 ? "text-red-600" : ""}`}>
                    {adj.difference > 0 ? "+" : ""}{adj.difference}
                  </span>
                </TableCell>
                <TableCell className="text-xs">{adj.reason}</TableCell>
                <TableCell className="text-xs">{adj.created_by?.name ?? "—"}</TableCell>
                <TableCell className="text-xs">{formatDate(adj.created_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewingAdjustment(adj)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDelete(adj.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {adjustments.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            لا توجد تسويات مخزون تطابق البحث.
          </div>
        )}

        <CustomPagination
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* View Details Modal */}
      <AppModalEdite
        open={!!viewingAdjustment}
        onOpenChange={(open) => {
          if (!open) setViewingAdjustment(null);
        }}
        title="تفاصيل تسوية المخزون"
        description="عرض تفاصيل تسوية المخزون"
        submitText="إغلاق"
        onSubmit={() => setViewingAdjustment(null)}
      >
        {viewingAdjustment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">المنتج</Label>
                <p className="text-sm font-medium">{viewingAdjustment.product?.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">رقم المنتج</Label>
                <p className="text-sm font-medium">#{viewingAdjustment.product?.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">الكمية قبل التعديل</Label>
                <p className="text-sm font-medium">{viewingAdjustment.quantity_before}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">الكمية بعد التعديل</Label>
                <p className="text-sm font-medium">{viewingAdjustment.quantity_after}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">الفرق</Label>
                <p className={`text-sm font-semibold ${viewingAdjustment.difference > 0 ? "text-green-600" : viewingAdjustment.difference < 0 ? "text-red-600" : ""}`}>
                  {viewingAdjustment.difference > 0 ? "+" : ""}{viewingAdjustment.difference}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">سبب التسوية</Label>
                <p className="text-sm font-medium">
                  {ADJUSTMENT_REASONS.find((r) => r.value === viewingAdjustment.reason)?.label ?? viewingAdjustment.reason}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">أضيف بواسطة</Label>
                <p className="text-sm font-medium">{viewingAdjustment.created_by?.name ?? "—"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">تاريخ ووقت التسوية</Label>
                <p className="text-sm font-medium">{formatDate(viewingAdjustment.created_at)}</p>
              </div>
            </div>
            {viewingAdjustment.notes && (
              <div>
                <Label className="text-muted-foreground text-xs">ملاحظات</Label>
                <p className="text-sm font-medium">{viewingAdjustment.notes}</p>
              </div>
            )}
          </div>
        )}
      </AppModalEdite>
    </div>
  );
};

export default InventoryAdjustmentsPage;
