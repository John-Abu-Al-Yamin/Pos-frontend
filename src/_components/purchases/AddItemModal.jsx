import {
  Plus,
  Loader2,
  Battery,
  Monitor,
  Smartphone,
  PackageOpen,
  StickyNote,
  ScanFace,
  Fingerprint,
  Camera,
  Volume2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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

const AddItemModal = ({
  open,
  onOpenChange,
  products,
  productsPending,
  addPending,
  selectedProductId,
  conditionValue,
  isSerialized,
  register,
  watch,
  setValue,
  control,
  errors,
  onSubmit,
  deviceDetails,
  setDeviceDetails,
}) => {
  console.log(
    "[AddItemModal] selectedProductId:",
    selectedProductId,
    "isSerialized:",
    isSerialized,
    "conditionValue:",
    conditionValue,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="p-1 rounded-lg bg-primary/10 text-primary">
              <Plus className="h-4 w-4" />
            </div>
            إضافة أصناف الفاتورة
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 py-2" id="add-item-form">
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

          <input
            type="hidden"
            {...register("condition", {
              required:
                selectedProductId && isSerialized
                  ? "يرجى اختيار حالة المنتج"
                  : false,
            })}
          />

          {selectedProductId && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">حالة المنتج</Label>

              {isSerialized ? (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      {
                        value: "new",
                        label: "جديد",
                        labelEn: "New",
                        color: "text-emerald-600",
                        bg: "bg-emerald-50",
                        border: "border-emerald-200",
                      },
                      {
                        value: "excellent",
                        label: "ممتاز",
                        labelEn: "Excellent",
                        color: "text-green-600",
                        bg: "bg-green-50",
                        border: "border-green-200",
                      },
                      {
                        value: "good",
                        label: "جيد",
                        labelEn: "Good",
                        color: "text-emerald-600",
                        bg: "bg-emerald-50",
                        border: "border-emerald-200",
                      },
                      {
                        value: "fair",
                        label: "مقبول",
                        labelEn: "Fair",
                        color: "text-emerald-600",
                        bg: "bg-emerald-50",
                        border: "border-emerald-200",
                      },
                    ].map((opt) => {
                      const selected = conditionValue === opt.value;

                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setValue("condition", opt.value, {
                              shouldValidate: true,
                            })
                          }
                          className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3 cursor-pointer select-none transition-all duration-200 ${
                            selected
                              ? `${opt.bg} ${opt.border} shadow-md`
                              : "bg-white border-border hover:border-neutral-300 hover:bg-neutral-50"
                          }`}
                        >
                          <span
                            className={`text-xs font-bold leading-none ${
                              selected ? opt.color : "text-neutral-700"
                            }`}
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

                  {errors.condition && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.condition.message}
                    </p>
                  )}
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
                </div>
              )}
            </div>
          )}
          {/* Device Details Section — shown for used serialized products */}
          {selectedProductId &&
            isSerialized &&
            conditionValue &&
            conditionValue !== "new" && (
              <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-amber-600" />
                  <Label className="text-sm font-bold text-amber-800">
                    تفاصيل الجهاز
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    (سيتم تطبيقها على جميع الوحدات)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold flex items-center gap-1">
                      <Battery className="h-3 w-3" /> صحة البطارية (%)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={deviceDetails?.battery_health ?? ""}
                      onChange={(e) =>
                        setDeviceDetails((prev) => ({
                          ...prev,
                          battery_health: e.target.value
                            ? Number(e.target.value)
                            : null,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold flex items-center gap-1">
                      <Monitor className="h-3 w-3" /> حالة الشاشة
                    </Label>
                    <Select
                      value={deviceDetails?.screen_condition ?? ""}
                      onValueChange={(val) =>
                        setDeviceDetails((prev) => ({
                          ...prev,
                          screen_condition: val,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perfect">سليمة</SelectItem>
                        <SelectItem value="good">جيدة</SelectItem>
                        <SelectItem value="scratched">مخدوشة</SelectItem>
                        <SelectItem value="cracked">مشقوقة</SelectItem>
                        <SelectItem value="broken">مكسورة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold flex items-center gap-1">
                      <Smartphone className="h-3 w-3" /> حالة الهيكل
                    </Label>
                    <Select
                      value={deviceDetails?.body_condition ?? ""}
                      onValueChange={(val) =>
                        setDeviceDetails((prev) => ({
                          ...prev,
                          body_condition: val,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perfect">سليم</SelectItem>
                        <SelectItem value="good">جيد</SelectItem>
                        <SelectItem value="scratched">مخدوش</SelectItem>
                        <SelectItem value="dented">به انبعاج</SelectItem>
                        <SelectItem value="worn">متآكل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold flex items-center gap-1">
                      <PackageOpen className="h-3 w-3" /> الملحقات
                    </Label>
                    <Input
                      type="text"
                      placeholder="شاحن، سماعة، علبة..."
                      value={deviceDetails?.accessories ?? ""}
                      onChange={(e) =>
                        setDeviceDetails((prev) => ({
                          ...prev,
                          accessories: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">حالة القطع</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        key: "face_id_working",
                        icon: ScanFace,
                        label: "Face ID",
                      },
                      {
                        key: "fingerprint_working",
                        icon: Fingerprint,
                        label: "البصمة",
                      },
                      {
                        key: "camera_working",
                        icon: Camera,
                        label: "الكاميرا",
                      },
                      {
                        key: "speaker_working",
                        icon: Volume2,
                        label: "السماعة",
                      },
                    ].map(({ key, icon: Icon, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setDeviceDetails((prev) => ({
                            ...prev,
                            [key]: prev[key] === false ? true : false,
                          }))
                        }
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                          deviceDetails?.[key] === false
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="flex-1 text-right">{label}</span>
                        <span className="text-[10px]">
                          {deviceDetails?.[key] === false ? "معطل" : "يعمل"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold flex items-center gap-1">
                    <StickyNote className="h-3 w-3" /> ملاحظات
                  </Label>
                  <Textarea
                    placeholder="أي ملاحظات إضافية عن الجهاز..."
                    value={deviceDetails?.notes ?? ""}
                    onChange={(e) =>
                      setDeviceDetails((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            )}

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
  );
};

export default AddItemModal;
