import React from "react";
import InfoCard from "@/customs/InfoCard";
import { formatDate } from "@/lib/utils";
import {
  Smartphone,
  User,
  Hash,
  CalendarClock,
} from "lucide-react";

const statusConfig = {
  pending: {
    label: "قيد الانتظار",
    className: "bg-yellow-100 text-yellow-800",
  },
  under_repair: {
    label: "قيد الإصلاح",
    className: "bg-blue-100 text-blue-800",
  },
  waiting_parts: {
    label: "بانتظار قطع الغيار",
    className: "bg-purple-100 text-purple-800",
  },
  repaired: { label: "تم الإصلاح", className: "bg-green-100 text-green-800" },
  delivered: { label: "تم التسليم", className: "bg-gray-100 text-gray-800" },
  cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
};

const MaintenanceHeaderInfo = ({ ticket, statusTransitions, canMutate, handleStatusChange }) => {
  const device = ticket.maintenance_device;
  const status = statusConfig[ticket.status] || statusConfig.pending;

  return (
    <div className="p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <InfoCard
          icon={Hash}
          label="رقم التذكرة"
          value={ticket.ticket_number}
        />
        <InfoCard
          icon={User}
          label="العميل"
          value={ticket.customer?.name || "—"}
          accent
        />
        <InfoCard
          icon={Smartphone}
          label="نوع الجهاز"
          value={device?.device_type || "—"}
          accent
        />
        <InfoCard
          icon={Hash}
          label="العلامة التجارية"
          value={device?.brand || "—"}
        />
        <InfoCard icon={Hash} label="الموديل" value={device?.model || "—"} />
        <InfoCard
          icon={Hash}
          label="الرقم التسلسلي"
          value={device?.serial_number || "—"}
        />
        <InfoCard icon={Hash} label="اللون" value={device?.color || "—"} />
        <InfoCard
          icon={CalendarClock}
          label="تاريخ الاستلام"
          value={ticket.received_date ? formatDate(ticket.received_date) : "—"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">الحالة</p>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
            {ticket.status === 'cancelled' && (
              <span className="text-xs text-red-600 font-medium">
                (تم استرجاع قطع الغيار إلى المخزون)
              </span>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">أنشئ بواسطة</p>
          <p className="text-sm font-medium">
            {ticket.created_by?.name || "—"}
          </p>
        </div>
        {ticket.delivery_date && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              تاريخ التسليم المتوقع
            </p>
            <p className="text-sm font-medium">{formatDate(ticket.delivery_date)}</p>
          </div>
        )}
      </div>

      {device?.condition_notes && (
        <div className="space-y-1 mb-6">
          <p className="text-xs text-muted-foreground">ملاحظات حالة الجهاز</p>
          <p className="text-sm font-medium">{device.condition_notes}</p>
        </div>
      )}
    </div>
  );
};

export default MaintenanceHeaderInfo;
