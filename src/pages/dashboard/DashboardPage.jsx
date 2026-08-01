import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Home,
  ChevronLeft,
  LayoutDashboard,
  Filter,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

import { useGetDashboard } from "@/hooks/Actions/dashboard/useCurdsDashboard";
import ReportErrorState from "@/pages/reports/components/ReportErrorState";

import KpiCards from "./components/KpiCards";
import DashboardCharts from "./components/DashboardCharts";
import SalesSection from "./components/SalesSection";
import OperationsSection from "./components/OperationsSection";
import InventorySection from "./components/InventorySection";
import AlertsSection from "./components/AlertsSection";
import RecentActivity from "./components/RecentActivity";

const periodOptions = [
  { value: "today", label: "اليوم" },
  { value: "this_week", label: "هذا الأسبوع" },
  { value: "this_month", label: "هذا الشهر" },
];

const DashboardPage = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [filters, setFilters] = useState({
    period: "today",
  });

  const { data, isPending, isError, error, refetch } =
    useGetDashboard(filters);

  const dashboardData = data?.data?.data || {};
  const {
    kpis,
    comparison,
    charts,
    sales,
    operations,
    alerts,
    inventory,
    recent_activity,
  } = dashboardData;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ period: "today" });
  };

  const hasActiveFilters = filters.period !== "today";

  const hasData =
    kpis ||
    comparison ||
    charts ||
    sales ||
    operations ||
    alerts ||
    inventory ||
    recent_activity;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link
          to="/"
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <Home className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">الرئيسية</span>
        </Link>
        <ChevronLeft className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
        <span className="text-foreground font-medium">لوحة المعلومات</span>
      </div>

      <header className="flex items-center justify-between text-neutral-950 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              لوحة المعلومات
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            نظرة عامة على أداء النظام والمبيعات والعمليات
          </p>
        </div>
      </header>

      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          تصفية البيانات
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1.5">
          <Label className="text-xs">الفترة</Label>
          <Select
            value={filters.period}
            onValueChange={(v) => handleFilterChange("period", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر الفترة" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              <X className="h-4 w-4 ml-1" />
              إعادة تعيين
            </Button>
          </div>
        )}
      </div>

      {isPending ? (
        <>
          <KpiCards isPending />
          <DashboardCharts isPending />
          <SalesSection isPending />
          <OperationsSection isPending />
          <InventorySection isPending />
          <AlertsSection isPending />
          <RecentActivity isPending />
        </>
      ) : isError ? (
        <ReportErrorState error={error} onRetry={() => refetch()} />
      ) : !hasData ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <LayoutDashboard className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-muted-foreground">
              لا توجد بيانات للفترة المحددة
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              حاول تغيير نطاق التاريخ
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <KpiCards kpis={kpis} comparison={comparison} />
          <DashboardCharts
            dailySummary={charts?.daily_summary}
            revenueBreakdown={charts?.revenue_breakdown}
            expenseBreakdown={charts?.expense_breakdown}
          />
          <SalesSection sales={sales} kpis={kpis} />
          <OperationsSection operations={operations} />
          <InventorySection inventory={inventory} />
          <AlertsSection alerts={alerts} />
          <RecentActivity recentActivity={recent_activity} />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
