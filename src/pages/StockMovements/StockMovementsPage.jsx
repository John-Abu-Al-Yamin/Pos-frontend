import React from "react";
import { Eye, Search, X, ArrowUpFromLine, TrendingUp } from "lucide-react";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  useGetAllStockMovements,
  useGetStockMovementById,
} from "@/hooks/Actions/StockMovements/useCurdsStockMovements";
import { useGetAllCategories } from "@/hooks/Actions/Categories/useCurdsCategories";
import useSearch from "@/hooks/useSearch/useSearch";
import { formatDateTime, formatCurrency } from "@/lib/utils";

const movementTypeLabels = {
  opening_stock: "مخزون افتتاحي",
  purchase: "مشتريات",
  sale: "مبيعات",
  sales_return: "مرتجع بيع",
  purchase_return: "مرتجع شراء",
  used_purchase: "مشتريات مستعملة",
  used_sale: "مبيعات مستعملة",
  used_return: "مرتجع مستعمل",
  repair_usage: "استخدام صيانة",
  damaged: "تالف",
  lost: "مفقود",
  stock_adjustment: "تسوية مخزون",
};

const movementLabels = {
  in: { label: "وارد", className: "bg-green-100 text-green-800" },
  out: { label: "منصرف", className: "bg-red-100 text-red-800" },
};

const typeLabels = {
  mobile: "موبايل",
  accessory: "إكسسوار",
  spare_part: "قطعة غيار",
};

const referenceTypeLabels = {
  PurchaseHeader: "مشتريات",
  SalesHeader: "مبيعات",
  SalesReturnHeader: "مرتجع بيع",
  PurchaseReturnHeader: "مرتجع شراء",
  UsedDevicePurchaseHeader: "مشتريات مستعملة",
  MaintenanceUsedPart: "صيانة (قطع)",
  MaintenanceHeader: "صيانة",
};

const movementTypeOptions = Object.entries(movementTypeLabels).map(([value, label]) => ({
  value,
  label,
}));

const movementOptions = [
  { value: "in", label: "وارد" },
  { value: "out", label: "منصرف" },
];

const referenceTypeOptions = [
  { value: "PurchaseHeader", label: "مشتريات" },
  { value: "SalesHeader", label: "مبيعات" },
  { value: "SalesReturnHeader", label: "مرتجع بيع" },
  { value: "PurchaseReturnHeader", label: "مرتجع شراء" },
  { value: "UsedDevicePurchaseHeader", label: "مشتريات مستعملة" },
  { value: "MaintenanceUsedPart", label: "صيانة (قطع)" },
  { value: "MaintenanceHeader", label: "صيانة" },
];

const getReferenceTypeLabel = (referenceType) => {
  if (!referenceType) return "—";
  const parts = referenceType.split("\\");
  const shortName = parts[parts.length - 1];
  return referenceTypeLabels[shortName] || shortName || "—";
};

const StockMovementsPage = () => {
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const [filterMovementType, setFilterMovementType] = React.useState("");
  const [filterMovement, setFilterMovement] = React.useState("");
  const [filterReferenceType, setFilterReferenceType] = React.useState("");
  const [filterProductType, setFilterProductType] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState("");
  const [detailsId, setDetailsId] = React.useState(null);
  const { debouncedSearch, search, handelSearch, setSearch } = useSearch("", 400);

  const filters = {
    search: debouncedSearch || undefined,
    movement_type: filterMovementType || undefined,
    movement: filterMovement || undefined,
    reference_type: filterReferenceType || undefined,
    product_type: filterProductType || undefined,
    category_id: filterCategory || undefined,
  };

  const { data, isPending } = useGetAllStockMovements(page, per_page, filters);
  const { data: categoriesData } = useGetAllCategories(1, 100);
  const { data: detailsData, isPending: detailsPending } = useGetStockMovementById(detailsId);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterMovementType, filterMovement, filterReferenceType, filterProductType, filterCategory]);

  const clearFilters = () => {
    setSearch("");
    setFilterMovementType("");
    setFilterMovement("");
    setFilterReferenceType("");
    setFilterProductType("");
    setFilterCategory("");
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || filterMovementType || filterMovement || filterReferenceType || filterProductType || filterCategory;

  const categories = categoriesData?.data?.data ?? [];
  const categoryMap = React.useMemo(
    () => Object.fromEntries(categories.map((c) => [String(c.id), c.name])),
    [categories],
  );

  if (isPending) return <Loading />;

  const items = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const selectedItem = detailsData?.data?.data;

  return (
    <div>
      <CustomHeader
        title="حركات المخزون"
        description="سجل حركات المخزون (مشتريات، مبيعات، مرتجعات، صيانة)"
      />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="relative w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث باسم المنتج أو الرقم التسلسلي..."
            value={search}
            onChange={handelSearch}
            className="pr-9"
          />
        </div>

        <div className="w-48">
          <Select value={filterMovementType} onValueChange={setFilterMovementType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="نوع الحركة" />
            </SelectTrigger>
            <SelectContent>
              {movementTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-44">
          <Select value={filterMovement} onValueChange={setFilterMovement}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="الاتجاه" />
            </SelectTrigger>
            <SelectContent>
              {movementOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={filterReferenceType} onValueChange={setFilterReferenceType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="المرجع" />
            </SelectTrigger>
            <SelectContent>
              {referenceTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={filterProductType} onValueChange={setFilterProductType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="نوع المنتج" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(typeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="التصنيف" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
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
              <TableHead className="text-right">المنتج</TableHead>
              <TableHead className="text-right">الرقم التسلسلي</TableHead>
              <TableHead className="text-right">نوع الحركة</TableHead>
              <TableHead className="text-right">الاتجاه</TableHead>
              <TableHead className="text-right">الكمية</TableHead>
              <TableHead className="text-right">تكلفة الوحدة</TableHead>
              <TableHead className="text-right">المرجع</TableHead>
              <TableHead className="text-right">بواسطة</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => {
              const movement = movementLabels[item.movement] || movementLabels.in;
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {item.product?.name || "—"}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {item.inventory_item?.internal_serial || "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {movementTypeLabels[item.movement_type] || item.movement_type || "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${movement.className}`}
                    >
                      {movement.label}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">{item.quantity}</TableCell>
                  <TableCell>
                    {item.unit_cost ? formatCurrency(item.unit_cost) : "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="text-muted-foreground">
                      {getReferenceTypeLabel(item.reference_type)}
                    </span>
                    <span className="text-muted-foreground/60"> #{item.reference_id}</span>
                  </TableCell>
                  <TableCell className="text-xs">
                    {item.user?.name || "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatDateTime(item.created_at)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDetailsId(item.id)}
                    >
                      <Eye className="h-4 w-4" />
                      عرض
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="h-24 text-center text-muted-foreground"
                >
                  لا توجد حركات مخزون
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

      <Dialog open={!!detailsId} onOpenChange={(open) => { if (!open) setDetailsId(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-start border-b border-border pb-4">
            <DialogTitle className="text-xl font-bold">تفاصيل حركة المخزون</DialogTitle>
            <DialogDescription>عرض تفاصيل حركة المخزون</DialogDescription>
          </DialogHeader>

          {detailsPending ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground animate-pulse">جاري التحميل...</div>
            </div>
          ) : selectedItem ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="p-3 bg-primary/10 rounded-full">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedItem.product?.name || "—"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {movementTypeLabels[selectedItem.movement_type] || selectedItem.movement_type || "—"}
                    {selectedItem.product?.type && ` • ${typeLabels[selectedItem.product.type] || selectedItem.product.type}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">نوع الحركة</p>
                  <p className="text-sm font-medium">
                    {movementTypeLabels[selectedItem.movement_type] || selectedItem.movement_type || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الاتجاه</p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${(movementLabels[selectedItem.movement] || movementLabels.in).className}`}>
                    {(movementLabels[selectedItem.movement] || movementLabels.in).label}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">المنتج</p>
                  <p className="text-sm font-medium">{selectedItem.product?.name || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">نوع المنتج</p>
                  <p className="text-sm font-medium">
                    {typeLabels[selectedItem.product?.type] || selectedItem.product?.type || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الكمية</p>
                  <p className="text-sm font-semibold">{selectedItem.quantity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">تكلفة الوحدة</p>
                  <p className="text-sm font-medium">
                    {selectedItem.unit_cost ? formatCurrency(selectedItem.unit_cost) : "—"}
                  </p>
                </div>
                {selectedItem.inventory_item && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">الرقم التسلسلي</p>
                    <p className="text-sm font-mono font-medium">{selectedItem.inventory_item.internal_serial}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">المستعمل (ref ID)</p>
                  <p className="text-sm font-medium">
                    <span>{getReferenceTypeLabel(selectedItem.reference_type)}</span>
                    <span className="text-muted-foreground"> #{selectedItem.reference_id}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">المنشئ</p>
                  <p className="text-sm font-medium">{selectedItem.user?.name || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">التصنيف</p>
                  <p className="text-sm font-medium">
                    {categoryMap[String(selectedItem.product?.category_id)] || "—"}
                  </p>
                </div>
              </div>

              {selectedItem.notes && (
                <div className="pt-4 border-t border-border">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">ملاحظات</p>
                    <p className="text-sm font-medium whitespace-pre-wrap">{selectedItem.notes}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">تاريخ الحركة</p>
                    <p className="text-sm font-medium">{formatDateTime(selectedItem.created_at)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">آخر تحديث</p>
                    <p className="text-sm font-medium">{formatDateTime(selectedItem.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">لم يتم العثور على البيانات</div>
          )}

          <div className="flex justify-end border-t border-border pt-4 mt-2">
            <DialogClose asChild>
              <Button variant="outline">إغلاق</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockMovementsPage;
