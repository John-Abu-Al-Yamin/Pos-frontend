import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Wrench, Wallet, Percent } from "lucide-react";

const MetricCard = ({ icon: IconComponent, label, value, subtext, accent }) => {
  const accentColors = {
    green: "border-green-200 bg-green-50",
    teal: "border-teal-200 bg-teal-50",
    blue: "border-blue-200 bg-blue-50",
    purple: "border-purple-200 bg-purple-50",
    amber: "border-amber-200 bg-amber-50",
    red: "border-red-200 bg-red-50",
    default: "border-border bg-white",
  };

  return (
    <div className={`rounded-xl border p-5 shadow-sm ${accentColors[accent] || accentColors.default}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="shrink-0">
          <IconComponent className={`h-5 w-5 ${accent === "red" ? "text-red-500" : accent === "green" ? "text-green-500" : "text-primary"}`} />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className={`text-2xl font-bold tabular-nums ${accent === "red" ? "text-red-600" : accent === "green" ? "text-green-600" : "text-foreground"}`}>
        {value}
      </p>
      {subtext && (
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      )}
    </div>
  );
};

const MetricSkeleton = () => (
  <div className="rounded-xl border p-5 shadow-sm">
    <div className="flex items-center gap-3 mb-3">
      <Skeleton className="h-5 w-5 rounded" />
      <Skeleton className="h-4 w-28" />
    </div>
    <Skeleton className="h-8 w-36 mb-1" />
    <Skeleton className="h-3 w-20" />
  </div>
);

const ProfitAnalysis = ({ cogs, maintenanceCosts, netProfit, profitMargin, isPending }) => {
  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <MetricSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cogs && !netProfit) return null;

  const grossProfit = cogs?.gross_profit ?? 0;
  const maintenanceProfit = maintenanceCosts?.maintenance_profit ?? 0;
  const grossMargin = cogs?.gross_margin_percentage ?? 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">تحليل الأرباح</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            icon={TrendingUp}
            label="إجمالي الربح"
            value={formatCurrency(grossProfit)}
            subtext={`هامش الربح الإجمالي: ${grossMargin.toFixed(2)}%`}
            accent="green"
          />
          <MetricCard
            icon={Wrench}
            label="ربح الصيانة"
            value={formatCurrency(maintenanceProfit)}
            subtext="Maintenance Profit"
            accent="teal"
          />
          <MetricCard
            icon={Wallet}
            label="صافي الربح"
            value={formatCurrency(netProfit ?? 0)}
            subtext={`هامش الربح الصافي: ${(profitMargin ?? 0).toFixed(2)}%`}
            accent={netProfit >= 0 ? "blue" : "red"}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitAnalysis;
