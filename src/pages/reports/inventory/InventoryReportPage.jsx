import React from "react";
import { useGetInventoryReport } from "@/hooks/Actions/reports/useCurdsInventoryReport";
import InventoryFilters from "./components/InventoryFilters";
import InventorySummaryCards from "./components/InventorySummaryCards";
import InventoryCharts from "./components/InventoryCharts";
import StockSummaryTable from "./components/StockSummaryTable";
import LowStockTable from "./components/LowStockTable";
import ProductTypeTable from "./components/ProductTypeTable";
import StockMovementTable from "./components/StockMovementTable";
import ReportErrorState from "../components/ReportErrorState";
const DEFAULT_FILTERS = {
  period: "this_month",
  date_from: "",
  date_to: "",
  category_id: "",
  brand_id: "",
  movement_type: "",
  movement_date_from: "",
  movement_date_to: "",
};

const InventoryReportPage = () => {
  const [filters, setFilters] = React.useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = React.useState(DEFAULT_FILTERS);

  const { data, isPending, isError, error, refetch } = useGetInventoryReport(appliedFilters);

  const hasActiveFilters = Object.entries(appliedFilters).some(
    ([key, value]) => value !== "" && key !== "period",
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    setAppliedFilters({ ...filters });
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const reportData = data?.data?.data || data?.data || {};
  const {
    stock_value,
    stock_summary,
    low_stock,
    by_product_type,
    stock_movement_summary,
  } = reportData;

  return (
    <>
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">تقرير المخزون</h1>
            <p className="text-sm text-muted-foreground mt-1">
              تحليل شامل لحالة المخزون والقيم والحركات
            </p>
          </div>
        </div>

        <InventoryFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onApply={handleApply}
          onReset={handleReset}
          hasActiveFilters={hasActiveFilters}
        />

        {isError ? (
          <ReportErrorState error={error} onRetry={() => refetch()} />
        ) : (
          <>
            <InventorySummaryCards
              stockValue={stock_value}
              stockSummary={stock_summary}
              lowStock={low_stock}
              isPending={isPending}
            />

            <InventoryCharts
              stockValue={stock_value}
              byProductType={by_product_type}
              stockMovements={stock_movement_summary}
              isPending={isPending}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StockSummaryTable
                products={stock_summary?.products}
                isPending={isPending}
              />
              <ProductTypeTable
                data={by_product_type}
                isPending={isPending}
              />
            </div>

            <LowStockTable
              lowStock={low_stock}
              isPending={isPending}
            />

            <StockMovementTable
              movements={stock_movement_summary?.movements}
              dateFrom={stock_movement_summary?.date_from}
              dateTo={stock_movement_summary?.date_to}
              isPending={isPending}
            />
          </>
        )}
      </div>
    </>
  );
};

export default InventoryReportPage;
