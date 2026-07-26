import React from "react";
import { Eye, Search, X, Package } from "lucide-react";

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
  useGetAllInventoryQuantities,
  useGetInventoryQuantityById,
} from "@/hooks/Actions/InventoryQuantities/useCurdsInventoryQuantities";
import { useGetAllCategories } from "@/hooks/Actions/Categories/useCurdsCategories";
import useSearch from "@/hooks/useSearch/useSearch";
import { formatDateTime, formatCurrency } from "@/lib/utils";

const typeLabels = {
  mobile: "موبايل",
  accessory: "إكسسوار",
  spare_part: "قطعة غيار",
};

const stockStatusOptions = [
  { value: "in", label: "متوفر" },
  { value: "low", label: "منخفض" },
  { value: "out", label: "نفذ" },
];

const getStockStatus = (quantity, minStock) => {
  if (quantity === 0) return { label: "نفذ", className: "bg-red-100 text-red-800" };
  if (quantity <= minStock) return { label: "منخفض", className: "bg-yellow-100 text-yellow-800" };
  return { label: "متوفر", className: "bg-green-100 text-green-800" };
};

const InventoryQuantitiesPage = () => {
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const [filterType, setFilterType] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState("");
  const [filterStockStatus, setFilterStockStatus] = React.useState("");
  const [detailsId, setDetailsId] = React.useState(null);
  const { debouncedSearch, search, handelSearch, setSearch } = useSearch("", 400);

  const filters = {
    search: debouncedSearch || undefined,
    type: filterType || undefined,
    category_id: filterCategory || undefined,
    stock_status: filterStockStatus || undefined,
  };

  const { data, isPending } = useGetAllInventoryQuantities(page, per_page, filters);
  const { data: categoriesData } = useGetAllCategories(1, 100);
  const { data: detailsData, isPending: detailsPending } = useGetInventoryQuantityById(detailsId);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterType, filterCategory, filterStockStatus]);

  const clearFilters = () => {
    setSearch("");
    setFilterType("");
    setFilterCategory("");
    setFilterStockStatus("");
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || filterType || filterCategory || filterStockStatus;

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
        title="كميات المخزون"
        description="قائمة كميات المخزون للمنتجات"
      />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="relative w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث باسم المنتج..."
            value={search}
            onChange={handelSearch}
            className="pr-9"
          />
        </div>

        <div className="w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="النوع" />
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

        <div className="w-48">
          <Select value={filterStockStatus} onValueChange={setFilterStockStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="حالة المخزون" />
            </SelectTrigger>
            <SelectContent>
              {stockStatusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
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
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">الكمية</TableHead>
              <TableHead className="text-right">سعر التكلفة</TableHead>
              <TableHead className="text-right">حالة المخزون</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => {
              const status = getStockStatus(item.quantity, item.product?.min_stock ?? 0);
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {item.product?.name || "—"}
                  </TableCell>
                  <TableCell>
                    {typeLabels[item.product?.type] || item.product?.type || "—"}
                  </TableCell>
                  <TableCell>
                    {categoryMap[String(item.product?.category_id)] || "—"}
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${item.quantity === 0 ? "text-red-600" : ""}`}>
                      {item.quantity}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(item.cost_price)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
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
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  لا توجد بيانات مخزون
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
            <DialogTitle className="text-xl font-bold">تفاصيل المخزون</DialogTitle>
            <DialogDescription>عرض تفاصيل كمية المخزون للمنتج</DialogDescription>
          </DialogHeader>

          {detailsPending ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground animate-pulse">جاري التحميل...</div>
            </div>
          ) : selectedItem ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedItem.product?.name || "—"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {typeLabels[selectedItem.product?.type] || selectedItem.product?.type || "—"}
                    {selectedItem.product?.category_id && ` • ${categoryMap[String(selectedItem.product?.category_id)] || "—"}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الكمية المتاحة</p>
                  <p className={`text-sm font-semibold ${selectedItem.quantity === 0 ? "text-red-600" : ""}`}>
                    {selectedItem.quantity}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">سعر التكلفة</p>
                  <p className="text-sm font-medium">{formatCurrency(selectedItem.cost_price)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الحد الأدنى للمخزون</p>
                  <p className="text-sm font-medium">{selectedItem.product?.min_stock ?? "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">حالة المخزون</p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStockStatus(selectedItem.quantity, selectedItem.product?.min_stock ?? 0).className}`}>
                    {getStockStatus(selectedItem.quantity, selectedItem.product?.min_stock ?? 0).label}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">معرف المنتج</p>
                  <p className="text-sm font-medium">{selectedItem.product_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">آخر تحديث</p>
                  <p className="text-sm font-medium">{formatDateTime(selectedItem.updated_at)}</p>
                </div>
              </div>

              {selectedItem.created_at && (
                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
                      <p className="text-sm font-medium">{formatDateTime(selectedItem.created_at)}</p>
                    </div>
                  </div>
                </div>
              )}
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

export default InventoryQuantitiesPage;
