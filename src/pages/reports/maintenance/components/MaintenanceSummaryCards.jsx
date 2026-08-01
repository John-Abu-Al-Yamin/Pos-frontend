import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import {
  Wrench,
  CheckCircle2,
  DollarSign,
  Package,
  TrendingUp,
  Wallet,
  Clock,
} from "lucide-react";

const SummaryCard = ({ icon, label, value, description, accent }) => {
  const accentColors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-red-50 text-red-600 border-red-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
    default: "bg-neutral-100 text-neutral-500",
  };

  const accentClass = accentColors[accent] || accentColors.default;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className={`shrink-0 rounded-lg p-2 border ${accentClass}`}>
        {React.createElement(icon, { className: "h-4 w-4" })}
      </div>
      <div className="min-w-0 flex-1" dir="rtl">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-lg font-bold text-foreground">
          {value}
        </p>
        {description && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

const SummaryCardSkeleton = () => (
  <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
    <Skeleton className="h-8 w-8 rounded-lg" />
    <div className="flex-1 space-y-1.5">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-2.5 w-16" />
    </div>
  </div>
);

const MaintenanceSummaryCards = ({ summary, isPending }) => {
  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      icon: Wrench,
      label: "إجمالي التذاكر",
      value: summary.total_tickets ?? 0,
      description: "عدد تذاكر الصيانة",
      accent: "blue",
    },
    {
      icon: CheckCircle2,
      label: "التذاكر المُسلّمة",
      value: summary.delivered_tickets ?? 0,
      description: "تم تسليمها للعملاء",
      accent: "green",
    },
    {
      icon: Clock,
      label: "التذاكر المستلمة",
      value: summary.received_tickets ?? 0,
      description: "تم استلامها خلال الفترة",
      accent: "indigo",
    },
    {
      icon: DollarSign,
      label: "إجمالي الإيرادات",
      value: formatCurrency(summary.total_revenue || 0),
      description: "إيرادات الصيانة",
      accent: "teal",
    },
    {
      icon: Wrench,
      label: "إيرادات العمالة",
      value: formatCurrency(summary.total_labor_revenue || 0),
      description: "تكلفة الإصلاح والخدمة",
      accent: "cyan",
    },
    {
      icon: Package,
      label: "إيرادات قطع الغيار",
      value: formatCurrency(summary.total_parts_revenue || 0),
      description: "مبيعات قطع الغيار",
      accent: "purple",
    },
    {
      icon: TrendingUp,
      label: "تكلفة قطع الغيار",
      value: formatCurrency(summary.total_parts_cost || 0),
      description: "تكلفة القطع المستخدمة",
      accent: "amber",
    },
    {
      icon: Wallet,
      label: "إجمالي الربح",
      value: formatCurrency(summary.gross_profit || 0),
      description: "صافي ربح الصيانة",
      accent: "green",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default MaintenanceSummaryCards;
