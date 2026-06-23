import {
  Hash,
  User,
  Phone,
  FileText,
  CalendarDays,
  ShoppingBag,
  Boxes,
  Receipt,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import InfoCard from "@/customs/InfoCard";
import { formatDate } from "@/lib/utils";

const InvoiceInfoCards = ({
  purchase,
  typeLabel,
  typeVariant,
  typeBadgeClass,
}) => (
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
);

export default InvoiceInfoCards;
