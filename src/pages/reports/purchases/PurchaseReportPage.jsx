import React from "react";
import { BarChart3, Home, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import { useGetPurchaseReport } from "@/hooks/Actions/reports/useCurdsPurchaseReport";

import PurchaseReportFilters from "./components/PurchaseReportFilters";
import PurchaseSummaryCards from "./components/PurchaseSummaryCards";
import PurchaseCharts from "./components/PurchaseCharts";
import PurchaseByProductTable from "./components/PurchaseByProductTable";
import PurchaseBySupplierTable from "./components/PurchaseBySupplierTable";
import PurchaseByPeriodTable from "./components/PurchaseByPeriodTable";
import PurchaseReturnsSummary from "./components/PurchaseReturnsSummary";
import ReportErrorState from "../components/ReportErrorState";

const PurchaseReportPage = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [filters, setFilters] = React.useState({
    period: "this_month",
    date_from: "",
    date_to: "",
    supplier_id: "",
    product_id: "",
    created_by: "",
  });

  const [appliedFilters, setAppliedFilters] = React.useState({
    period: "this_month",
  });

  const { data, isPending, isError, error, refetch } = useGetPurchaseReport(appliedFilters);

  const { data: suppliersData } = useGetData({
    url: endPoints.suppliers,
    params: { per_page: 1000 },
    queryKeys: [queryKeys.suppliers],
  });

  const { data: usersData } = useGetData({
    url: endPoints.users,
    params: { per_page: 1000 },
    queryKeys: [queryKeys.users],
  });

  const { data: productsData } = useGetData({
    url: endPoints.products,
    params: { per_page: 1000 },
    queryKeys: [queryKeys.products],
  });

  const suppliers = suppliersData?.data?.data ?? [];
  const users = usersData?.data?.data ?? [];
  const products = productsData?.data?.data ?? [];

  const reportData = data?.data?.data || {};
  const summary = reportData?.summary;
  const byProduct = reportData?.by_product;
  const bySupplier = reportData?.by_supplier;
  const byPeriod = reportData?.by_period;
  const returnsSummary = reportData?.returns_summary;

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
      supplier_id: "",
      product_id: "",
      created_by: "",
    });
    setAppliedFilters({ period: "this_month" });
  };

  const hasActiveFilters = Object.values(appliedFilters).some(
    (v) => v !== undefined && v !== "" && v !== null,
  );

  const hasData =
    summary ||
    byProduct?.length ||
    bySupplier?.length ||
    byPeriod?.length ||
    returnsSummary;

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
        <span className="text-foreground font-medium">تقرير المشتريات</span>
      </div>

      <header className="flex items-center justify-between text-neutral-950 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">تقرير المشتريات</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            تحليل نشاط المشتريات والموردين والمنتجات وتكاليف الشراء والمرتجعات
          </p>
        </div>
      </header>

      <PurchaseReportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        suppliers={suppliers}
        products={products}
        users={users}
        hasActiveFilters={hasActiveFilters}
      />

      {isPending ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 7 }).map((_, i) => (
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
              لا توجد بيانات مشتريات للفترة المحددة
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              حاول تغيير نطاق التاريخ أو إزالة الفلاتر
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <PurchaseSummaryCards summary={summary} isPending={false} />
          <PurchaseCharts
            byPeriod={byPeriod}
            bySupplier={bySupplier}
            byProduct={byProduct}
            returnsSummary={returnsSummary}
            isPending={false}
          />
          <PurchaseReturnsSummary data={returnsSummary} isPending={false} />
          <PurchaseByProductTable data={byProduct} isPending={false} />
          <PurchaseBySupplierTable data={bySupplier} isPending={false} />
          <PurchaseByPeriodTable data={byPeriod} isPending={false} />
        </>
      )}
    </div>
  );
};

export default PurchaseReportPage;
