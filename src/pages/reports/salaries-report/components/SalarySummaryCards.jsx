import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  CheckCircle2,
  FileEdit,
  XCircle,
  Receipt,
} from "lucide-react";

const SummaryCard = ({ icon: IconComponent, label, value, description, accent }) => {
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
        <IconComponent className="h-4 w-4" />
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

const SalarySummaryCards = ({ summary, isPending }) => {
  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      icon: DollarSign,
      label: "إجمالي الرواتب",
      value: formatCurrency(summary.total_amount || 0),
      description: "إجمالي قيمة الرواتب",
      accent: "blue",
    },
    {
      icon: CheckCircle2,
      label: "رواتب مؤكدة",
      value: formatCurrency(summary.confirmed_amount || 0),
      description: "مؤكد (مصروف فعلي)",
      accent: "green",
    },
    {
      icon: FileEdit,
      label: "رواتب مسودة",
      value: formatCurrency(summary.draft_amount || 0),
      description: "مسودة (لم يتم تأكيدها)",
      accent: "amber",
    },
    {
      icon: XCircle,
      label: "رواتب ملغية",
      value: formatCurrency(summary.cancelled_amount || 0),
      description: "ملغاة",
      accent: "red",
    },
    {
      icon: Receipt,
      label: "عدد الدفعات",
      value: summary.payment_count ?? 0,
      description: "إجمالي الدفعات",
      accent: "purple",
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

export default SalarySummaryCards;
