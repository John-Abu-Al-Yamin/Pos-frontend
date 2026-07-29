import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const ChangeIndicator = ({ changePercent }) => {
  if (changePercent === null || changePercent === undefined) return null;

  const isPositive = changePercent > 0;
  const isNeutral = changePercent === 0;

  let bgClass = "bg-primary/5 text-primary border-border";
  let Icon = TrendingUp;

  if (isNeutral) {
    bgClass = "bg-muted text-muted-foreground border-border";
    Icon = Minus;
  } else if (!isPositive) {
    bgClass = "bg-destructive/10 text-destructive border-destructive/20";
    Icon = TrendingDown;
  }

  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[11px] font-medium ${bgClass}`}>
      <Icon className="h-3 w-3" />
      {Math.abs(changePercent).toFixed(1)}%
    </span>
  );
};

const ComparisonCard = ({ label, current, previous, changePercent, isCurrency }) => (
  <div className="rounded-xl border border-border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-lg font-bold text-foreground">
        {isCurrency ? formatCurrency(current ?? 0) : (current ?? 0)}
      </span>
      <ChangeIndicator changePercent={changePercent} />
    </div>
    <p className="text-[11px] text-muted-foreground mt-1">
      السابق: {isCurrency ? formatCurrency(previous ?? 0) : (previous ?? 0)}
    </p>
  </div>
);

const ComparisonCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
    <Skeleton className="h-3 w-24 mb-2" />
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-3 w-24 mt-2" />
  </div>
);

const ComparisonCards = ({ comparison, isPending }) => {
  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <ComparisonCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!comparison) return null;

  const cards = [
    comparison.sales_net_revenue && {
      label: "إيرادات المبيعات",
      ...comparison.sales_net_revenue,
      isCurrency: true,
    },
    comparison.sales_invoice_count && {
      label: "عدد الفواتير",
      ...comparison.sales_invoice_count,
      isCurrency: false,
    },
    comparison.sales_gross_profit && {
      label: "إجمالي الربح",
      ...comparison.sales_gross_profit,
      isCurrency: true,
    },
    comparison.maintenance_revenue && {
      label: "إيرادات الصيانة",
      ...comparison.maintenance_revenue,
      isCurrency: true,
    },
    comparison.expenses_paid && {
      label: "المصروفات المدفوعة",
      ...comparison.expenses_paid,
      isCurrency: true,
    },
    comparison.net_profit && {
      label: "صافي الربح",
      ...comparison.net_profit,
      isCurrency: true,
    },
  ].filter(Boolean);

  if (cards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <ComparisonCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default ComparisonCards;
