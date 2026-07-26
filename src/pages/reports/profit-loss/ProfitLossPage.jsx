import React from "react";
import { BarChart3, Home, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { useGetProfitLossReport } from "@/hooks/Actions/reports/useCurdsProfitLossReport";
import ProfitLossFilters from "./components/ProfitLossFilters";
import ProfitLossSummaryCards from "./components/ProfitLossSummaryCards";
import ProfitFormulaSection from "./components/ProfitFormulaSection";
import RevenueBreakdown from "./components/RevenueBreakdown";
import CostBreakdown from "./components/CostBreakdown";
import ProfitAnalysis from "./components/ProfitAnalysis";
import ReportErrorState from "../components/ReportErrorState";

const ProfitLossPage = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [filters, setFilters] = React.useState({
    period: "this_month",
    date_from: "",
    date_to: "",
  });

  const [appliedFilters, setAppliedFilters] = React.useState({
    period: "this_month",
  });

  const { data, isPending, isError, error, refetch } = useGetProfitLossReport(appliedFilters);

  const reportData = data?.data?.data || data?.data || {};
  const {
    revenue,
    cost_of_goods_sold,
    maintenance_costs,
    operating_expenses,
    profit_formula,
    purchases,
    net_profit,
    profit_margin_percentage,
  } = reportData;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const cleaned = Object.fromEntries(
      Object.entries(filters).filter(
        ([, v]) => v !== undefined && v !== "" && v !== null,
      ),
    );
    setAppliedFilters(cleaned);
  };

  const handleResetFilters = () => {
    setFilters({
      period: "this_month",
      date_from: "",
      date_to: "",
    });
    setAppliedFilters({ period: "this_month" });
  };

  const hasActiveFilters = Object.entries(appliedFilters).some(
    ([, v]) => v !== undefined && v !== "" && v !== null,
  );

  const hasData = revenue || cost_of_goods_sold || operating_expenses || profit_formula;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">الرئيسية</span>
        </Link>
        <ChevronLeft className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
        <span className="hover:text-foreground transition-colors">التقارير</span>
        <ChevronLeft className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
        <span className="text-foreground font-medium">تقرير الأرباح والخسائر</span>
      </div>

      <header className="flex items-center justify-between text-neutral-950 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">تقرير الأرباح والخسائر</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            تحليل شامل لأداء الربحية مع تفصيل الإيرادات والتكاليف والمصروفات
          </p>
        </div>
      </header>

      <ProfitLossFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {isPending ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
                <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-5 w-28 bg-muted animate-pulse rounded" />
                  <div className="h-2.5 w-16 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="h-5 w-40 bg-muted animate-pulse rounded mb-4" />
                <div className="h-[300px] bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <ReportErrorState error={error} onRetry={() => refetch()} />
      ) : !hasData ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-muted-foreground">
              لا توجد بيانات للفترة المحددة
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              حاول تغيير نطاق التاريخ أو إزالة الفلاتر
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <ProfitLossSummaryCards
            revenue={revenue}
            cogs={cost_of_goods_sold}
            expenses={operating_expenses}
            netProfit={net_profit}
            profitMargin={profit_margin_percentage}
            isPending={false}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ProfitFormulaSection
                profitFormula={profit_formula}
                netProfit={net_profit}
                isPending={false}
              />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <RevenueBreakdown revenue={revenue} isPending={false} />
              <CostBreakdown
                cogs={cost_of_goods_sold}
                operatingExpenses={operating_expenses}
                purchases={purchases}
                isPending={false}
              />
            </div>
          </div>

          <ProfitAnalysis
            cogs={cost_of_goods_sold}
            maintenanceCosts={maintenance_costs}
            netProfit={net_profit}
            profitMargin={profit_margin_percentage}
            isPending={false}
          />
        </div>
      )}
    </div>
  );
};

export default ProfitLossPage;
