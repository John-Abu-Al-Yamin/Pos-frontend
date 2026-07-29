import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  Receipt,
  TrendingUp,
  Wallet,
  Wrench,
  Package,
  AlertTriangle,
  XCircle,
  BarChart3,
  ShoppingCart,
} from "lucide-react";

const SummaryCard = ({ icon: Icon, label, value, description }) => (
  <div className="group flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <div className="shrink-0 rounded-lg bg-primary/5 p-2.5 text-primary ring-1 ring-primary/5 transition-colors duration-200 group-hover:bg-primary/10 group-hover:ring-primary/10">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0 flex-1" dir="rtl">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-lg font-bold text-foreground">
        {value ?? "—"}
      </p>
      {description && (
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {description}
        </p>
      )}
    </div>
  </div>
);

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

const KpiCards = ({ kpis, isPending }) => {
  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!kpis) return null;

  const cards = [
    {
      icon: DollarSign,
      label: "إيرادات المبيعات",
      value: formatCurrency(kpis.sales_net_revenue ?? 0),
      description: "Net Sales",
    },
    {
      icon: Receipt,
      label: "عدد الفواتير",
      value: kpis.sales_invoice_count ?? 0,
      description: "Invoices",
    },
    {
      icon: ShoppingCart,
      label: "متوسط المعاملة",
      value: formatCurrency(kpis.average_transaction_value ?? 0),
      description: "Avg Transaction",
    },
    ...(kpis.sales_gross_profit !== undefined
      ? [
          {
            icon: Wallet,
            label: "إجمالي الربح",
            value: formatCurrency(kpis.sales_gross_profit ?? 0),
            description: "Gross Profit",
          },
        ]
      : []),
    ...(kpis.net_profit !== undefined
      ? [
          {
            icon: TrendingUp,
            label: "صافي الربح",
            value: formatCurrency(kpis.net_profit ?? 0),
            description: "Net Profit",
          },
        ]
      : []),
    {
      icon: Wrench,
      label: "إيرادات الصيانة",
      value: formatCurrency(kpis.maintenance_revenue ?? 0),
      description: "Maintenance Revenue",
    },
    ...(kpis.maintenance_profit !== undefined
      ? [
          {
            icon: BarChart3,
            label: "أرباح الصيانة",
            value: formatCurrency(kpis.maintenance_profit ?? 0),
            description: "Maintenance Profit",
          },
        ]
      : []),
    ...(kpis.inventory_stock_value !== undefined
      ? [
          {
            icon: Package,
            label: "قيمة المخزون",
            value: formatCurrency(kpis.inventory_stock_value ?? 0),
            description: "Stock Value",
          },
        ]
      : []),
    {
      icon: AlertTriangle,
      label: "مخزون منخفض",
      value: kpis.low_stock_count ?? 0,
      description: "Low Stock",
    },
    {
      icon: XCircle,
      label: "نفذ من المخزون",
      value: kpis.out_of_stock_count ?? 0,
      description: "Out of Stock",
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

export default KpiCards;
