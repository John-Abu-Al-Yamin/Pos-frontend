import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Package,
  Hash,
  DollarSign,
  Layers,
  CheckCircle2,
  CalendarDays,
  Clock,
  ShoppingBag,
  FileText,
  Ruler,
  Boxes,
} from "lucide-react";

import { useGetStockById } from "@/hooks/Actions/stock/useCurdsStock";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddEditHeader from "@/customs/AddEditHeader";
import Loading from "@/customs/Loading";
import InfoCard from "@/customs/InfoCard";
import { formatDate } from "@/lib/utils";

const conditionMeta = {
  excellent: {
    label: "ممتاز",
    bg: "bg-green-50 text-green-700 border-green-200",
  },
  good: {
    label: "جيد",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  fair: {
    label: "متوسط",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  poor: {
    label: "سيء",
    bg: "bg-red-50 text-red-700 border-red-200",
  },
};

const statusMeta = {
  available: {
    label: "متوفر",
    bg: "bg-green-50 text-green-700 border-green-200",
  },
  sold: {
    label: "تم البيع",
    bg: "bg-gray-50 text-gray-700 border-gray-200",
  },
  damaged: {
    label: "تالف",
    bg: "bg-red-50 text-red-700 border-red-200",
  },
  returned: {
    label: "مرتجع",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

const serializedMeta = {
  1: {
    label: "هاتف",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  0: {
    label: "اكسسوار",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

const StockDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: res, isPending } = useGetStockById(id);
  const item = res?.data?.data ?? res?.data;

  if (isPending) return <Loading />;

  if (!item) {
    return (
      <div className="mx-auto p-4">
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <p className="text-lg font-medium text-muted-foreground">
            لم يتم العثور على العنصر
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            العودة للمخزون
          </Button>
        </div>
      </div>
    );
  }

  const conditionInfo = conditionMeta[item.condition];
  const statusInfo = statusMeta[item.status];
  const product = item.product;
  const purchaseItem = item.purchase_item;

  return (
    <div className="mx-auto p-4 space-y-6">
      <AddEditHeader
        title="تفاصيل عنصر المخزون"
        description="عرض كامل لبيانات عنصر المخزون"
        backPath="/"
        backText="العودة للمخزون"
      />

      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Package className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-foreground">
            معلومات عنصر المخزون
          </h2>
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
          <InfoCard icon={Hash} label="رقم العنصر" value={`#${item.id}`} />
          <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="shrink-0 rounded-lg p-2 bg-neutral-100 text-neutral-500">
              <Layers className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1" dir="rtl">
              <p className="text-xs font-medium text-muted-foreground">
                الرقم التسلسلي
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold text-foreground" dir="ltr">
                {item.serial_number || "—"}
              </p>
            </div>
          </div>
          <InfoCard
            icon={DollarSign}
            label="سعر التكلفة"
            value={`${Number(item.cost_price).toLocaleString("ar-EG")} ج.م`}
          />
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
          <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="shrink-0 rounded-lg p-2 bg-neutral-100 text-neutral-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1" dir="rtl">
              <p className="text-xs font-medium text-muted-foreground">
                الوضع
              </p>
              <div className="mt-1">
                {statusInfo ? (
                  <Badge variant="outline" className={statusInfo.bg}>
                    {statusInfo.label}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            </div>
          </div>
          <InfoCard
            icon={Ruler}
            label="النوع"
            value={
              <Badge
                variant="outline"
                className={serializedMeta[product?.is_serialized]?.bg}
              >
                {serializedMeta[product?.is_serialized]?.label || "—"}
              </Badge>
            }
          />
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

      {purchaseItem && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">
              معلومات صنف المشتريات
            </h2>
          </div>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            dir="rtl"
          >
            <InfoCard
              icon={Hash}
              label="رقم الصنف"
              value={`#${purchaseItem.id}`}
              accent
            />
            <InfoCard
              icon={Boxes}
              label="الكمية"
              value={Number(purchaseItem.quantity).toLocaleString("ar-EG")}
            />
            <InfoCard
              icon={DollarSign}
              label="سعر الوحدة"
              value={`${Number(purchaseItem.unit_cost).toLocaleString("ar-EG")} ج.م`}
            />
            <InfoCard
              icon={DollarSign}
              label="الإجمالي"
              value={`${Number(purchaseItem.line_total).toLocaleString("ar-EG")} ج.م`}
              accent
            />
            <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
              <div className="shrink-0 rounded-lg p-2 bg-neutral-100 text-neutral-500">
                <Layers className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1" dir="rtl">
                <p className="text-xs font-medium text-muted-foreground">
                  حالة الصنف
                </p>
                <div className="mt-1">
                  {conditionMeta[purchaseItem.condition] ? (
                    <Badge
                      variant="outline"
                      className={conditionMeta[purchaseItem.condition].bg}
                    >
                      {conditionMeta[purchaseItem.condition].label}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </div>
            <InfoCard
              icon={FileText}
              label="رقم فاتورة المشتريات"
              value={
                purchaseItem.purchase_header_id
                  ? `#${purchaseItem.purchase_header_id}`
                  : "—"
              }
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default StockDetails;
