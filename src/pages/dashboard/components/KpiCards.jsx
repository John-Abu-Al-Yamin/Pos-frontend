import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  ShoppingCart,
  Package,
  BarChart3,
} from "lucide-react";
import SectionTitle from "./SectionTitle";

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
    <span
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[11px] font-medium ${bgClass}`}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(changePercent).toFixed(1)}%
    </span>
  );
};

const SummaryCard = ({
  icon,
  label,
  value,
  changePercent,
  previous,
  isCurrency,
}) => {
  const Icon = icon;
  const numericValue = Number(value);
  const isNegative = Number.isFinite(numericValue) && numericValue < 0;

  const containerClass = isNegative
    ? "rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    : "rounded-xl border border-border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md";

  const iconClass = isNegative
    ? "shrink-0 rounded-lg bg-red-100 p-2 text-red-600 ring-1 ring-red-200"
    : "shrink-0 rounded-lg bg-primary/5 p-2 text-primary ring-1 ring-primary/5";

  const displayValue = isNegative
    ? `-${formatCurrency(Math.abs(numericValue))}`
    : isCurrency
      ? formatCurrency(value)
      : value;

  return (
    <div className={containerClass}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className={iconClass}>
            <Icon className="h-4 w-4" />
          </div>
          <p className="truncate text-xs font-medium text-muted-foreground">
            {label}
          </p>
          {isNegative && (
            <span className="shrink-0 rounded-full border border-red-200 bg-red-100 px-1.5 py-0.5 text-[11px] font-medium text-red-600">
              خسارة
            </span>
          )}
        </div>
        <ChangeIndicator changePercent={changePercent} />
      </div>
      <p
        className={`mt-3 truncate text-xl font-bold ${isNegative ? "text-red-600" : "text-foreground"}`}
      >
        {displayValue ?? "—"}
      </p>
      {previous !== undefined && previous !== null && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          السابق: {isCurrency ? formatCurrency(previous) : previous}
        </p>
      )}
    </div>
  );
};

const SummaryCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between gap-2">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <div className="mt-3">
      <Skeleton className="h-6 w-28" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  </div>
);

const KpiCards = ({ kpis, comparison, isPending }) => {
  if (isPending) {
    return (
      <section className="mb-8">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SummaryCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (!kpis) return null;

  const cards = [
    {
      icon: DollarSign,
      label: "إيرادات المبيعات",
      value: kpis.sales_net_revenue ?? 0,
      changePercent: comparison?.sales_net_revenue?.change_percent,
      previous: comparison?.sales_net_revenue?.previous,
      isCurrency: true,
    },
    {
      icon: TrendingUp,
      label: "صافي الربح",
      value: kpis.net_profit ?? 0,
      changePercent: comparison?.net_profit?.change_percent,
      previous: comparison?.net_profit?.previous,
      isCurrency: true,
    },
    {
      icon: ShoppingCart,
      label: "متوسط قيمة المعاملة",
      value: kpis.average_transaction_value ?? 0,
      isCurrency: true,
    },
    {
      icon: Package,
      label: "قيمة المخزون",
      value: kpis.inventory_stock_value ?? 0,
      isCurrency: true,
    },
  ];

  return (
    <section className="mb-8">
      <SectionTitle title="ملخص الأداء" icon={BarChart3} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>
    </section>
  );
};

export default KpiCards;
