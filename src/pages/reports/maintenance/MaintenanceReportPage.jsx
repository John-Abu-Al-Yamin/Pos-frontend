import React from "react";
import { BarChart3, Home, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import { useGetMaintenanceReport } from "@/hooks/Actions/reports/useCurdsMaintenanceReport";

import MaintenanceReportFilters from "./components/MaintenanceReportFilters";
import MaintenanceSummaryCards from "./components/MaintenanceSummaryCards";
import MaintenanceCharts from "./components/MaintenanceCharts";
import MaintenanceDeviceTypeTable from "./components/MaintenanceDeviceTypeTable";
import MaintenancePeriodTable from "./components/MaintenancePeriodTable";
import MaintenancePartsTable from "./components/MaintenancePartsTable";
import ReportErrorState from "../components/ReportErrorState";

const MaintenanceReportPage = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [filters, setFilters] = React.useState({
    period: "this_month",
    date_from: "",
    date_to: "",
    status: "",
    customer_id: "",
  });

  const [appliedFilters, setAppliedFilters] = React.useState({
    period: "this_month",
  });

  const { data, isPending, isError, error, refetch } = useGetMaintenanceReport(appliedFilters);

  const { data: customersData } = useGetData({
    url: endPoints.customers,
    params: { per_page: 1000 },
    queryKeys: [queryKeys.customers],
  });

  const customers = customersData?.data?.data ?? [];

  const reportData = data?.data?.data || {};
  const summary = reportData?.summary;
  const byDeviceType = reportData?.by_device_type;
  const byPeriod = reportData?.by_period;
  const usedPartsDetails = reportData?.used_parts_details;

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
      status: "",
      customer_id: "",
    });
    setAppliedFilters({ period: "this_month" });
  };

  const hasActiveFilters = Object.values(appliedFilters).some(
    (v) => v !== undefined && v !== "" && v !== null,
  );

  const hasData =
    summary ||
    byDeviceType?.length ||
    byPeriod?.length ||
    usedPartsDetails?.length;

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
        <span className="text-foreground font-medium">تقرير الصيانة</span>
      </div>

      <header className="flex items-center justify-between text-neutral-950 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">تقرير الصيانة</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            تحليل تذاكر الإصلاح وإيرادات الخدمات وقطع الغيار وأداء الصيانة
          </p>
        </div>
      </header>

      <MaintenanceReportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        customers={customers}
        hasActiveFilters={hasActiveFilters}
      />

      {isPending ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 9 }).map((_, i) => (
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
              لا توجد بيانات صيانة للفترة المحددة
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              حاول تغيير نطاق التاريخ أو إزالة الفلاتر
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <MaintenanceSummaryCards summary={summary} isPending={false} />
          <MaintenanceCharts
            byPeriod={byPeriod}
            byDeviceType={byDeviceType}
            usedPartsDetails={usedPartsDetails}
            isPending={false}
          />
          <MaintenanceDeviceTypeTable data={byDeviceType} isPending={false} />
          <MaintenancePartsTable data={usedPartsDetails} isPending={false} />
          <MaintenancePeriodTable data={byPeriod} isPending={false} />
        </>
      )}
    </div>
  );
};

export default MaintenanceReportPage;
