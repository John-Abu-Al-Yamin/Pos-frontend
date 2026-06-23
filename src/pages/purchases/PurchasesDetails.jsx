import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  ArrowRight,
  Plus,
  Trash2,
  Package,
  User,
  Phone,
  Hash,
  CalendarDays,
  FileText,
  ShoppingBag,
  Boxes,
  Loader2,
  PackageOpen,
  Receipt,
} from "lucide-react";

import { useGetPurchaseHeadersById } from "@/hooks/Actions/PurchaseHeaders/useCurdsPurchaseHeaders";
import {
  useGetAllPurchaseItems,
  useAddPurchaseItem,
  useDeletePurchaseItem,
} from "@/hooks/Actions/PurchaseItems/useCurdsPurchaseItems";
import { useGetAllProducts } from "@/hooks/Actions/Product/useCurdsProduct";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Loading from "@/customs/Loading";
import { formatDate } from "@/lib/utils";

/* ─────────────────────────── helpers ─────────────────────────── */
const InfoCard = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
    <div
      className={`shrink-0 rounded-lg p-2 ${
        accent
          ? "bg-primary/10 text-primary"
          : "bg-neutral-100 text-neutral-500"
      }`}
    >
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0 flex-1" dir="rtl">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
        {value || "—"}
      </p>
    </div>
  </div>
);

/* ─────────────────────── main component ─────────────────────── */
const PurchasesDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ── data fetching ── */
  const { data: headerRes, isPending: headerPending } =
    useGetPurchaseHeadersById(id);
  const purchase = headerRes?.data?.data ?? headerRes?.data;

  const { data: itemsRes, isPending: itemsPending } =
    useGetAllPurchaseItems(id);
  const items = itemsRes?.data?.data ?? itemsRes?.data ?? [];

  const { data: productsRes, isPending: productsPending } = useGetAllProducts(
    1,
    1000,
  );
  const products = productsRes?.data?.data ?? [];

  /* ── mutations ── */
  const { mutate: addItem, isPending: addPending } = useAddPurchaseItem();
  const { mutate: deleteItem, isPending: deletePending } =
    useDeletePurchaseItem();

  /* ── add-item modal state ── */
  const [modalOpen, setModalOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      product_id: "",
      quantity: "",
      unit_cost: "",
      condition: "",
    },
  });

  const selectedProductId = watch("product_id");
  const selectedProduct = products.find(
    (p) => String(p.id) === String(selectedProductId),
  );

  const isSerialized = selectedProduct?.is_serialized;

  React.useEffect(() => {
    if (selectedProductId && !isSerialized) {
      setValue("condition", "new");
    }
  }, [selectedProductId, isSerialized, setValue]);

  const handleOpenModal = () => {
    reset({ product_id: "", quantity: "", unit_cost: "", condition: "" });
    setModalOpen(true);
  };

  const onAddItem = (formData) => {
    if (!formData.product_id) {
      toast.error("الرجاء اختيار منتج");
      return;
    }
    const payload = {
      purchase_header_id: Number(id),
      product_id: Number(formData.product_id),
      quantity: Number(formData.quantity),
      unit_cost: Number(formData.unit_cost),
      condition: formData.condition,
    };

    addItem(
      { data: payload },
      {
        onSuccess: () => {
        //   toast.success("تم إضافة الصنف بنجاح");
          setModalOpen(false);
          reset();
        },
        onError: () => {
          toast.error("فشل في إضافة الصنف");
        },
      },
    );
  };

  const handleDeleteItem = (itemId) => {
    deleteItem(
      { id: itemId },
      {
        onError: () => toast.error("فشل في حذف الصنف"),
      },
    );
  };

  /* ── loading ── */
  if (headerPending) return <Loading />;

  /* ── computed values ── */
  const typeLabel =
    purchase?.type === "purchase"
      ? "مشتريات"
      : purchase?.type === "opening_stock"
        ? "بضاعة بالمحل"
        : purchase?.type;

  const typeVariant = purchase?.type === "purchase" ? "default" : "outline";
  const typeBadgeClass =
    purchase?.type === "purchase"
      ? "bg-amber-50 text-black border-amber-100 hover:bg-amber-100"
      : "bg-primary/5 text-primary border-primary/20 hover:bg-primary/15";

  const totalItems = items.length;
  const grandTotal = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.quantity) || 0) *
        (Number(item.unit_cost ?? item.unit_price) || 0),
    0,
  );

  return (
    <div className="mx-auto p-4 space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            تفاصيل فاتورة المشتريات
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            عرض كامل لبيانات الفاتورة وأصنافها
          </p>
        </div>
        <Button
          onClick={() => navigate("/purchases")}
          variant="outline"
          className="sm:self-center gap-2 self-start"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للمشتريات
        </Button>
      </div>

      {/* ── Invoice Info Cards ── */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        dir="rtl"
      >
        <InfoCard
          icon={Hash}
          label="رقم الفاتورة"
          value={`#${purchase?.id}`}
          accent
        />
        <InfoCard
          icon={User}
          label="اسم المورد"
          value={purchase?.supplier?.name}
        />
        <InfoCard
          icon={Phone}
          label="رقم الهاتف"
          value={purchase?.supplier?.phone}
        />
        <InfoCard
          icon={FileText}
          label="كود المرجع"
          value={purchase?.reference_code}
        />
        <InfoCard
          icon={Receipt}
          label="وصف الفاتورة"
          value={purchase?.reference}
        />
        <InfoCard
          icon={CalendarDays}
          label="تاريخ الفاتورة"
          value={purchase?.date}
        />
        <InfoCard
          icon={CalendarDays}
          label="تاريخ الإنشاء"
          value={formatDate(purchase?.created_at)}
        />
        <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="shrink-0 rounded-lg p-2 bg-neutral-100 text-neutral-500">
            {purchase?.type === "purchase" ? (
              <ShoppingBag className="h-4 w-4" />
            ) : (
              <Boxes className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0 flex-1" dir="rtl">
            <p className="text-xs font-medium text-muted-foreground">النوع</p>
            <div className="mt-1">
              <Badge variant={typeVariant} className={typeBadgeClass}>
                {typeLabel}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* ── Invoice Items Section ── */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        {/* Section header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-border"
          dir="rtl"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                أصناف الفاتورة
              </h2>
              <p className="text-xs text-muted-foreground">
                {totalItems} صنف · الإجمالي:{" "}
                <span className="font-semibold text-foreground">
                  {grandTotal.toLocaleString("ar-EG")}
                </span>
              </p>
            </div>
          </div>

          <Button
            onClick={handleOpenModal}
            className="gap-2 self-start sm:self-center"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Add Invoice Items
          </Button>
        </div>

        {/* Items table */}
        {itemsPending ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-3 py-16 text-center"
            dir="rtl"
          >
            <div className="rounded-full bg-neutral-100 p-4">
              <PackageOpen className="h-8 w-8 text-neutral-400" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              لا توجد أصناف في هذه الفاتورة بعد
            </p>
            <Button
              onClick={handleOpenModal}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Invoice Items
            </Button>
          </div>
        ) : (
          <div dir="rtl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">#</TableHead>
                  <TableHead className="text-right">المنتج</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                  <TableHead className="text-right">سعر الوحدة</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-muted-foreground text-sm">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <Package className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="font-medium text-sm">
                          {item.product?.name ?? `منتج #${item.product_id}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.condition && (
                        <Badge
                          variant="outline"
                          className={
                            {
                              new: "bg-blue-50 text-blue-700 border-blue-200",
                              excellent:
                                "bg-green-50 text-green-700 border-green-200",
                              good: "bg-emerald-50 text-emerald-700 border-emerald-200",
                              fair: "bg-amber-50 text-amber-700 border-amber-200",
                            }[item.condition] ?? ""
                          }
                        >
                          {{
                            new: "جديد",
                            excellent: "ممتاز",
                            good: "جيد",
                            fair: "مقبول",
                          }[item.condition] ?? item.condition}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {Number(item.quantity).toLocaleString("ar-EG")}
                    </TableCell>
                    <TableCell>
                      {Number(item.unit_cost ?? item.unit_price).toLocaleString(
                        "ar-EG",
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {(
                        Number(item.quantity) *
                        Number(item.unit_cost ?? item.unit_price)
                      ).toLocaleString("ar-EG")}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={deletePending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف الصنف</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف هذا الصنف؟ لا يمكن التراجع عن
                              هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-row-reverse gap-2">
                            <AlertDialogAction
                              onClick={() => handleDeleteItem(item.id)}
                              className="bg-destructive text-white hover:bg-destructive/90"
                            >
                              حذف
                            </AlertDialogAction>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Grand Total Row */}
            <div
              className="flex items-center justify-between px-5 py-3 border-t border-border bg-neutral-50"
              dir="rtl"
            >
              <span className="text-sm font-semibold text-muted-foreground">
                الإجمالي الكلي
              </span>
              <span className="text-base font-bold text-foreground">
                {grandTotal.toLocaleString("ar-EG")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Invoice Items Modal ── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg" >
          <DialogHeader className="border-b border-border pb-4" >
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="p-1 rounded-lg bg-primary/10 text-primary">
                <Plus className="h-4 w-4" />
              </div>
              Add Invoice Itemssss
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onAddItem)}
            className="space-y-5 py-2"
            id="add-item-form"
          >
            {/* Product select */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">المنتج</Label>
              <Select
                onValueChange={(val) => setValue("product_id", val)}
                value={selectedProductId}
                disabled={productsPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      productsPending ? "جاري تحميل المنتجات..." : "اختر المنتج"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.product_id && (
                <p className="text-sm text-destructive font-medium">
                  {errors.product_id.message}
                </p>
              )}
            </div>

            {/* Quantity & Unit Cost side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-semibold">
                  الكمية
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="0"
                  className="text-right"
                  {...register("quantity", {
                    required: "الكمية مطلوبة",
                    min: { value: 1, message: "الكمية يجب أن تكون أكبر من 0" },
                  })}
                />
                {errors.quantity && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit_cost" className="text-sm font-semibold">
                  سعر الوحدة
                </Label>
                <Input
                  id="unit_cost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="text-right"
                  {...register("unit_cost", {
                    required: "السعر مطلوب",
                    min: { value: 0, message: "السعر لا يمكن أن يكون سالبًا" },
                  })}
                />
                {errors.unit_cost && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.unit_cost.message}
                  </p>
                )}
              </div>
            </div>

            {/* Condition - only for serialized products (mobiles) */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">حالة المنتج</Label>
              {!selectedProductId || isSerialized ? (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      {
                        value: "new",
                        label: "جديد",
                        labelEn: "New",
                        color: "text-blue-600",
                        ring: "ring-blue-300",
                        bg: "bg-blue-50",
                        border: "border-blue-200",
                      },
                      {
                        value: "excellent",
                        label: "ممتاز",
                        labelEn: "Excellent",
                        color: "text-green-600",
                        ring: "ring-green-300",
                        bg: "bg-green-50",
                        border: "border-green-200",
                      },
                      {
                        value: "good",
                        label: "جيد",
                        labelEn: "Good",
                        color: "text-emerald-600",
                        ring: "ring-emerald-300",
                        bg: "bg-emerald-50",
                        border: "border-emerald-200",
                      },
                      {
                        value: "fair",
                        label: "مقبول",
                        labelEn: "Fair",
                        color: "text-amber-600",
                        ring: "ring-amber-300",
                        bg: "bg-amber-50",
                        border: "border-amber-200",
                      },
                    ].map((opt) => {
                      const selected = watch("condition") === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setValue("condition", opt.value, {
                              shouldValidate: true,
                            })
                          }
                          className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 cursor-pointer select-none transition-all duration-200 ${
                            selected
                              ? `${opt.bg} ${opt.border} ring-2 ${opt.ring} shadow-sm`
                              : "bg-white border-border hover:border-neutral-300 hover:bg-neutral-50"
                          }`}
                        >
                          <span
                            className={`text-xs font-bold leading-none ${selected ? opt.color : "text-neutral-700"}`}
                          >
                            {opt.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground leading-none">
                            {opt.labelEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="hidden"
                    {...register("condition", {
                      required: "يرجى اختيار حالة المنتج",
                    })}
                  />
                </>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    جديد
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    (ملحق - الحالة جديدة تلقائياً)
                  </span>
                  <input type="hidden" {...register("condition")} />
                </div>
              )}
              {errors.condition && (
                <p className="text-xs text-destructive font-medium">
                  {errors.condition.message}
                </p>
              )}
            </div>

            {/* Live total preview */}
            {watch("quantity") && watch("unit_cost") && (
              <div className="rounded-lg border border-border bg-neutral-50 px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  الإجمالي المتوقع
                </span>
                <span className="text-sm font-bold text-foreground">
                  {(
                    Number(watch("quantity")) * Number(watch("unit_cost"))
                  ).toLocaleString("ar-EG")}
                </span>
              </div>
            )}
          </form>

          <DialogFooter className="border-t border-border pt-4 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
              >
                إلغاء
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form="add-item-form"
              disabled={addPending}
              className="w-full sm:w-auto gap-2"
            >
              {addPending && <Loader2 className="h-4 w-4 animate-spin" />}
              حفظ الصنف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
};

export default PurchasesDetails;
