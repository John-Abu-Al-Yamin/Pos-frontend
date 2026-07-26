import React from "react";
import { Eye, Search, X, Smartphone } from "lucide-react";

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
  useGetAllInventoryItems,
  useGetInventoryItemById,
} from "@/hooks/Actions/InventoryItems/useCurdsInventoryItems";
import { useGetAllCategories } from "@/hooks/Actions/Categories/useCurdsCategories";
import useSearch from "@/hooks/useSearch/useSearch";
import { formatDateTime, formatCurrency } from "@/lib/utils";

const typeLabels = {
  mobile: "موبايل",
  accessory: "إكسسوار",
  spare_part: "قطعة غيار",
};

const statusConfig = {
  available: { label: "متاح", className: "bg-green-100 text-green-800" },
  sold: { label: "مباع", className: "bg-blue-100 text-blue-800" },
  returned: { label: "مرتجع", className: "bg-purple-100 text-purple-800" },
  under_repair: { label: "قيد الصيانة", className: "bg-yellow-100 text-yellow-800" },
  damaged: { label: "تالف", className: "bg-red-100 text-red-800" },
};

const sourceLabels = {
  new_purchase: "مشتريات جديدة",
  used_purchase: "مشتريات مستعملة",
};

const statusOptions = [
  { value: "available", label: "متاح" },
  { value: "sold", label: "مباع" },
  { value: "returned", label: "مرتجع" },
  { value: "under_repair", label: "قيد الصيانة" },
  { value: "damaged", label: "تالف" },
];

const sourceOptions = [
  { value: "new_purchase", label: "مشتريات جديدة" },
  { value: "used_purchase", label: "مشتريات مستعملة" },
];

const InventoryItemsPage = () => {
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const [filterType, setFilterType] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [filterSource, setFilterSource] = React.useState("");
  const [detailsId, setDetailsId] = React.useState(null);
  const { debouncedSearch, search, handelSearch, setSearch } = useSearch("", 400);

  const filters = {
    search: debouncedSearch || undefined,
    type: filterType || undefined,
    category_id: filterCategory || undefined,
    status: filterStatus || undefined,
    source: filterSource || undefined,
  };

  const { data, isPending } = useGetAllInventoryItems(page, per_page, filters);
  const { data: categoriesData } = useGetAllCategories(1, 100);
  const { data: detailsData, isPending: detailsPending } = useGetInventoryItemById(detailsId);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterType, filterCategory, filterStatus, filterSource]);

  const clearFilters = () => {
    setSearch("");
    setFilterType("");
    setFilterCategory("");
    setFilterStatus("");
    setFilterSource("");
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || filterType || filterCategory || filterStatus || filterSource;

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
        title="عناصر المخزون"
        description="قائمة الأجهزة المسجلة في المخزون"
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
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="المصدر" />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((opt) => (
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
              <TableHead className="text-right">الرقم التسلسلي</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">المصدر</TableHead>
              <TableHead className="text-right">سعر التكلفة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => {
              const status = statusConfig[item.status] || statusConfig.available;
              const source = sourceLabels[item.source] || item.source || "—";
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {item.product?.name || "—"}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {item.internal_serial}
                  </TableCell>
                  <TableCell>
                    {typeLabels[item.product?.type] || item.product?.type || "—"}
                  </TableCell>
                  <TableCell>
                    {categoryMap[String(item.product?.category_id)] || "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">{source}</TableCell>
                  <TableCell>{formatCurrency(item.cost_price)}</TableCell>
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
                  colSpan={9}
                  className="h-24 text-center text-muted-foreground"
                >
                  لا توجد عناصر مخزون
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
            <DialogTitle className="text-xl font-bold">تفاصيل العنصر</DialogTitle>
            <DialogDescription>عرض تفاصيل عنصر المخزون</DialogDescription>
          </DialogHeader>

          {detailsPending ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground animate-pulse">جاري التحميل...</div>
            </div>
          ) : selectedItem ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Smartphone className="h-8 w-8 text-primary" />
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
                  <p className="text-xs text-muted-foreground">الرقم التسلسلي</p>
                  <p className="text-sm font-mono font-medium">{selectedItem.internal_serial}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">سعر التكلفة</p>
                  <p className="text-sm font-medium">{formatCurrency(selectedItem.cost_price)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الحالة</p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${(statusConfig[selectedItem.status] || statusConfig.available).className}`}>
                    {(statusConfig[selectedItem.status] || statusConfig.available).label}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">المصدر</p>
                  <p className="text-sm font-medium">{sourceLabels[selectedItem.source] || selectedItem.source || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">معرف المنتج</p>
                  <p className="text-sm font-medium">{selectedItem.product_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الحد الأدنى للمخزون</p>
                  <p className="text-sm font-medium">{selectedItem.product?.min_stock ?? "—"}</p>
                </div>
              </div>

              {(selectedItem.battery_health != null ||
                selectedItem.screen_condition != null ||
                selectedItem.body_condition != null ||
                selectedItem.fingerprint_working != null ||
                selectedItem.face_id_working != null) && (
                <>
                  <h4 className="text-sm font-semibold text-muted-foreground border-t border-border pt-4">حالة الجهاز</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedItem.battery_health != null && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">صحة البطارية</p>
                        <p className="text-sm font-medium">{selectedItem.battery_health}%</p>
                      </div>
                    )}
                    {selectedItem.screen_condition && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">حالة الشاشة</p>
                        <p className="text-sm font-medium">{selectedItem.screen_condition}</p>
                      </div>
                    )}
                    {selectedItem.body_condition && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">حالة الهيكل</p>
                        <p className="text-sm font-medium">{selectedItem.body_condition}</p>
                      </div>
                    )}
                    {selectedItem.fingerprint_working != null && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">بصمة الإصبع</p>
                        <p className="text-sm font-medium">{selectedItem.fingerprint_working ? "يعمل" : "لا يعمل"}</p>
                      </div>
                    )}
                    {selectedItem.face_id_working != null && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Face ID</p>
                        <p className="text-sm font-medium">{selectedItem.face_id_working ? "يعمل" : "لا يعمل"}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

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
                    <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
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

export default InventoryItemsPage;
