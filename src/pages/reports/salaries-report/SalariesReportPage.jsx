import React from "react";
import { BarChart3, Home, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { useGetSalaryReport } from "@/hooks/Actions/reports/useCurdsSalaryReport";
import SalaryFilters from "./components/SalaryFilters";
import SalarySummaryCards from "./components/SalarySummaryCards";
import SalaryStatusBreakdown from "./components/SalaryStatusBreakdown";
import EmployeeSalaryTable from "./components/EmployeeSalaryTable";
import SalaryItemsTable from "./components/SalaryItemsTable";
import SalaryPeriodTable from "./components/SalaryPeriodTable";
import ReportErrorState from "../components/ReportErrorState";

const SalariesReportPage = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [filters, setFilters] = React.useState({
    period: "this_month",
    date_from: "",
    date_to: "",
    status: "all",
    created_by: "",
    group_by: "default",
  });

  const [appliedFilters, setAppliedFilters] = React.useState({
    period: "this_month",
  });

  const { data, isPending, isError, error, refetch } = useGetSalaryReport(appliedFilters);

  const reportData = data?.data?.data || data?.data || {};
  const {
    basis,
    summary,
    by_employee,
    by_period,
    by_status,
    by_item_type,
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
      status: "all",
      created_by: "",
      group_by: "default",
    });
    setAppliedFilters({ period: "this_month" });
  };

  const hasActiveFilters = Object.entries(appliedFilters).some(
    ([k, v]) =>
      k !== "period" &&
      v !== undefined &&
      v !== "" &&
      v !== null &&
      v !== "all" &&
      v !== "default",
  );

  const hasData = summary || by_employee?.length || by_status?.length || by_item_type?.length;

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
        <span className="text-foreground font-medium">تقرير الرواتب</span>
      </div>

      <header className="flex items-center justify-between text-neutral-950 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">تقرير الرواتب</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            تحليل الرواتب والمدفوعات حسب الموظف والحالة والفترة
          </p>
        </div>
      </header>

      <SalaryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {isPending ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
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
              لا توجد بيانات رواتب للفترة المحددة
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              حاول تغيير نطاق التاريخ أو إزالة الفلاتر
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {basis && (
            <Card className="border-blue-100 bg-blue-50/50">
              <CardContent className="py-3 px-6">
                <p className="text-xs text-blue-700 leading-relaxed">
                  <span className="font-semibold">أساس التقرير:</span> {basis.description}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  الحالات المدعومة: {basis.supported_statuses?.join("، ")}
                </p>
              </CardContent>
            </Card>
          )}

          <SalarySummaryCards summary={summary} isPending={false} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalaryStatusBreakdown data={by_status} isPending={false} />
            <EmployeeSalaryTable data={by_employee} isPending={false} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalaryPeriodTable data={by_period} isPending={false} />
            <SalaryItemsTable data={by_item_type} isPending={false} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalariesReportPage;
