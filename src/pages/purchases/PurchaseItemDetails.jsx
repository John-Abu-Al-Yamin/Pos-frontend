import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Package,
  Hash,
  ShoppingBag,
  Boxes,
  FileText,
  CalendarDays,
  Clock,
  Ruler,
  DollarSign,
  Layers,
  Receipt,
  Battery,
  Monitor,
  Smartphone,
  PackageOpen,
  StickyNote,
} from "lucide-react";

import { useGetPurchaseItemById } from "@/hooks/Actions/PurchaseItems/useCurdsPurchaseItems";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddEditHeader from "@/customs/AddEditHeader";
import Loading from "@/customs/Loading";
import InfoCard from "@/customs/InfoCard";
import { formatDate } from "@/lib/utils";

const conditionMeta = {
  new: {
    label: "جديد",
    labelEn: "New",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  excellent: {
    label: "ممتاز",
    labelEn: "Excellent",
    bg: "bg-green-50 text-green-700 border-green-200",
  },
  good: {
    label: "جيد",
    labelEn: "Good",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  fair: {
    label: "مقبول",
    labelEn: "Fair",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

const PurchaseItemDetails = () => {
  const navigate = useNavigate();
  const { purchaseId, itemId } = useParams();

  const { data: res, isPending } = useGetPurchaseItemById(itemId);
  const item = res?.data?.data ?? res?.data;
  const purchaseHeader = item?.purchase_header;
  const product = item?.product;

  if (isPending) return <Loading />;

  if (!item) {
    return (
      <div className="mx-auto p-4">
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <p className="text-lg font-medium text-muted-foreground">
            لم يتم العثور على الصنف
          </p>
          <Button
            onClick={() => navigate(`/purchases/${purchaseId}`)}
            variant="outline"
          >
            العودة للفاتورة
          </Button>
        </div>
      </div>
    );
  }

  const conditionInfo = conditionMeta[item.condition];

  const lineTotal = (
    Number(item.quantity) * Number(item.unit_cost ?? item.unit_price)
  ).toLocaleString("ar-EG");

  return (
    <div className="mx-auto p-4 space-y-6">
      <AddEditHeader
        title="تفاصيل الصنف"
        description="عرض كامل لبيانات صنف في فاتورة المشتريات"
        backPath={`/purchases/${purchaseId}`}
        backText="العودة للفاتورة"
      />

      {/* ── Item Information Cards ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Package className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-foreground">معلومات الصنف</h2>
        </div>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          dir="rtl"
        >
          <InfoCard
            icon={Package}
            label="اسم المنتج"
            value={product?.name ?? `منتج #${item.product_id}`}
            accent
          />
          <InfoCard icon={Hash} label="رقم الصنف" value={`#${item.id}`} />
          <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="shrink-0 rounded-lg p-2 bg-neutral-100 text-neutral-500">
              <Layers className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1" dir="rtl">
              <p className="text-xs font-medium text-muted-foreground">
                حالة المنتج
              </p>
              <div className="mt-1">
                {conditionInfo ? (
                  <Badge variant="outline" className={conditionInfo.bg}>
                    {conditionInfo.label}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            </div>
          </div>
          <InfoCard
            icon={Ruler}
            label="serialized"
            value={
              product?.is_serialized ? (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200"
                >
                  هاتف
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  اكسسوار
                </Badge>
              )
            }
          />
          <InfoCard
            icon={DollarSign}
            label="سعر الوحدة"
            value={`${Number(item.unit_cost ?? item.unit_price).toLocaleString("ar-EG")} ج.م`}
          />
          <InfoCard
            icon={Ruler}
            label="الكمية"
            value={Number(item.quantity).toLocaleString("ar-EG")}
          />
          <InfoCard
            icon={DollarSign}
            label="الإجمالي"
            value={`${lineTotal} ج.م`}
            accent
          />
        </div>
      </div>

      {/* ── Device Details (from stock items) ── */}
      {item.stock_items && item.stock_items.some(si => si.battery_health != null || si.screen_condition || si.body_condition || si.accessories || si.notes) && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Smartphone className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">تفاصيل الأجهزة</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {item.stock_items.map((si) => (
              <div key={si.id} className="rounded-xl border border-amber-200 bg-amber-50/30 p-4">
                <p className="text-xs font-bold text-amber-700 mb-2" dir="ltr">
                  {si.serial_number || `#${si.id}`}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {si.battery_health != null && (
                    <InfoCard icon={Battery} label="صحة البطارية" value={`${si.battery_health}%`} />
                  )}
                  {si.screen_condition && (
                    <InfoCard icon={Monitor} label="الشاشة" value={si.screen_condition} />
                  )}
                  {si.body_condition && (
                    <InfoCard icon={Smartphone} label="الهيكل" value={si.body_condition} />
                  )}
                  {si.accessories && (
                    <InfoCard icon={PackageOpen} label="الملحقات" value={si.accessories} />
                  )}
                  {si.notes && (
                    <div className="col-span-full">
                      <InfoCard icon={StickyNote} label="ملاحظات" value={si.notes} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Purchase Header Info ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-foreground">
            معلومات الفاتورة
          </h2>
        </div>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          dir="rtl"
        >
          <InfoCard
            icon={Hash}
            label="رقم الفاتورة"
            value={`#${purchaseHeader?.id ?? item.purchase_header_id}`}
            accent
          />
          <InfoCard
            icon={FileText}
            label="كود المرجع"
            value={purchaseHeader?.reference_code}
          />
          <InfoCard
            icon={Receipt}
            label="وصف الفاتورة"
            value={purchaseHeader?.reference}
          />
          <InfoCard
            icon={CalendarDays}
            label="تاريخ الفاتورة"
            value={purchaseHeader?.date}
          />
          <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="shrink-0 rounded-lg p-2 bg-neutral-100 text-neutral-500">
              {purchaseHeader?.type === "purchase" ? (
                <ShoppingBag className="h-4 w-4" />
              ) : (
                <Boxes className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0 flex-1" dir="rtl">
              <p className="text-xs font-medium text-muted-foreground">النوع</p>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className={
                    purchaseHeader?.type === "purchase"
                      ? "bg-amber-50 text-black border-amber-100"
                      : "bg-primary/5 text-primary border-primary/20"
                  }
                >
                  {purchaseHeader?.type === "purchase"
                    ? "مشتريات"
                    : purchaseHeader?.type === "opening_stock"
                      ? "بضاعة بالمحل"
                      : purchaseHeader?.type}
                </Badge>
              </div>
            </div>
          </div>
          <InfoCard
            icon={CalendarDays}
            label="تاريخ الإنشاء"
            value={formatDate(item.created_at)}
          />
          <InfoCard
            icon={Clock}
            label="آخر تحديث"
            value={formatDate(item.updated_at)}
          />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          onClick={() =>
            navigate(`/purchases/${purchaseId}/items/${itemId}/edit`, {
              state: { item, purchaseId },
            })
          }
          variant="default"
          className="gap-2"
        >
          تعديل الصنف
        </Button>
        <Button
          onClick={() => navigate(`/purchases/${purchaseId}`)}
          variant="outline"
          className="gap-2"
        >
          العودة للفاتورة
        </Button>
      </div>
    </div>
  );
};

export default PurchaseItemDetails;
