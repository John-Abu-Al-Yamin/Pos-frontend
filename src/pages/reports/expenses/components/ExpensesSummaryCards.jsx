import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Receipt,
  ListChecks,
} from "lucide-react";

const SummaryCard = ({ icon: Icon, label, value, description, accent }) => {
  const accentColors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-red-50 text-red-600 border-red-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    default: "bg-neutral-100 text-neutral-500",
  };

  const accentClass = accentColors[accent] || accentColors.default;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className={`shrink-0 rounded-lg p-2 border ${accentClass}`}>
        <Icon className="h-4 w-4" />
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

const ExpensesSummaryCards = ({ summary, isPending }) => {
  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      icon: DollarSign,
      label: "إجمالي المصروفات",
      value: formatCurrency(summary.total_amount || 0),
      description: "Total Expenses",
      accent: "blue",
    },
    {
      icon: CheckCircle2,
      label: "المصروفات المدفوعة",
      value: formatCurrency(summary.paid_amount || 0),
      description: "Paid Expenses",
      accent: "green",
    },
    {
      icon: Clock,
      label: "المصروفات المعلقة",
      value: formatCurrency(summary.pending_amount || 0),
      description: "Pending Expenses",
      accent: "amber",
    },
    {
      icon: Receipt,
      label: "عدد المصروفات",
      value: summary.total_count ?? 0,
      description: "Total Count",
      accent: "purple",
    },
    {
      icon: CheckCircle2,
      label: "عدد المدفوع",
      value: summary.paid_count ?? 0,
      description: "Paid Count",
      accent: "green",
    },
    {
      icon: ListChecks,
      label: "عدد المعلق",
      value: summary.pending_count ?? 0,
      description: "Pending Count",
      accent: "amber",
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

export default ExpensesSummaryCards;
