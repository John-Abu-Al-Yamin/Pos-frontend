import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  ShoppingBag,
  Undo2,
  BarChart3,
  AlertCircle,
  RefreshCw,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useGetDashboardData, useGetProductsPerformance } from "@/hooks/Actions/dashboard/useCurdsDashboard";
import { formatCurrency } from "@/lib/utils";
import DateFilter from "@/_components/dashboard/DateFilter";
import Header from "@/_components/dashboard/Header";

const cardConfig = [
  {
    key: "totalSales",
    label: "إجمالي المبيعات",
    icon: ShoppingBag,
    color:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    key: "totalPurchases",
    label: "إجمالي المشتريات",
    icon: ShoppingCart,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    key: "totalRefunds",
    label: "إجمالي المرتجعات",
    icon: Undo2,
    color:
      "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
  },
  {
    key: "cashFlow",
    label: "التدفق النقدي",
    icon: DollarSign,
    color:
      "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  },
  {
    key: "grossProfit",
    label: "إجمالي الربح",
    icon: BarChart3,
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
];

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
      <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}

export default function Dashboard() {
  const [period, setPeriod] = useState("month");
  const [customDate, setCustomDate] = useState({ from: "", to: "" });
  const [queryParams, setQueryParams] = useState({ period: "month" });

  useEffect(() => {
    if (period === "custom" && customDate.from && customDate.to) {
      setQueryParams({
        period: "custom",
        from: customDate.from,
        to: customDate.to,
      });
    } else if (period !== "custom") {
      setQueryParams({ period });
    }
  }, [period, customDate]);

  const { data, isPending, isError, refetch } =
    useGetDashboardData(queryParams);
  const { data: perfData, isPending: perfLoading } =
    useGetProductsPerformance(queryParams);

  const metrics = data?.data?.data;
  const bestSellers = perfData?.data?.data?.bestSelling ?? [];
  const worstSellers = perfData?.data?.data?.worstSelling ?? [];

  function cashFlowIcon(value) {
    if (value >= 0) return <TrendingUp className="h-3 w-3 text-emerald-500" />;
    return <TrendingDown className="h-3 w-3 text-red-500" />;
  }

  return (
    <>
      <Header />
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">نظرة عامة مالية</h2>
        <DateFilter
          period={period}
          onPeriodChange={setPeriod}
          customDate={customDate}
          onCustomDateChange={setCustomDate}
        />
      </div>

      <div className="mt-6">
        {isPending ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mb-3" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              فشل تحميل البيانات المالية
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              حدث خطأ ما. يرجى المحاولة مرة أخرى.
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
            >
              <RefreshCw className="h-4 w-4" />
              إعادة المحاولة
            </button>
          </div>
        ) : !metrics ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BarChart3 className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
              لا توجد بيانات
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              لم يتم العثور على سجلات مالية للفترة المحددة.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {cardConfig.map((card) => {
              const Icon = card.icon;
              const value = metrics[card.key];
              const isCashFlow = card.key === "cashFlow";

              return (
                <div
                  key={card.key}
                  className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm p-5 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {card.label}
                    </span>
                    <div className={`p-2 rounded-lg ${card.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(value)}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {isCashFlow && cashFlowIcon(value)}
                    <span
                      className={`text-xs ${
                        isCashFlow
                          ? value >= 0
                            ? "text-emerald-500"
                            : "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {isCashFlow
                        ? value >= 0
                          ? "إيجابي"
                          : "سلبي"
                        : "الفترة الحالية"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <ArrowUp className="h-4 w-4 text-emerald-500" />
            الأكثر مبيعاً
          </h3>
          {perfLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : bestSellers.length === 0 ? (
            <p className="text-sm text-gray-400">لا توجد مبيعات في هذه الفترة.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b dark:border-gray-700">
                  <th className="text-start pb-2 font-medium">المنتج</th>
                  <th className="text-start pb-2 font-medium">التصنيف</th>
                  <th className="text-end pb-2 font-medium">الكمية</th>
                </tr>
              </thead>
              <tbody>
                {bestSellers.map((p) => (
                  <tr key={p.id} className="border-b dark:border-gray-800 last:border-0">
                    <td className="py-2 text-gray-900 dark:text-gray-100">
                      <span className={`${p.is_serialized ? "" : "text-xs text-gray-400"}`}>
                        {p.name}
                      </span>
                      {p.is_serialized ? (
                        <span className="text-[10px] text-blue-500 mr-1">(جهاز)</span>
                      ) : (
                        <span className="text-[10px] text-orange-500 mr-1">(اكسسوار)</span>
                      )}
                    </td>
                    <td className="py-2 text-gray-500">{p.category_name}</td>
                    <td className="py-2 text-end font-medium">{p.total_sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <ArrowDown className="h-4 w-4 text-red-500" />
            الأقل مبيعاً
          </h3>
          {perfLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : worstSellers.length === 0 ? (
            <p className="text-sm text-gray-400">لا توجد منتجات.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b dark:border-gray-700">
                  <th className="text-start pb-2 font-medium">المنتج</th>
                  <th className="text-start pb-2 font-medium">التصنيف</th>
                  <th className="text-end pb-2 font-medium">الكمية</th>
                </tr>
              </thead>
              <tbody>
                {worstSellers.map((p) => (
                  <tr key={p.id} className="border-b dark:border-gray-800 last:border-0">
                    <td className="py-2 text-gray-900 dark:text-gray-100">
                      <span className={`${p.is_serialized ? "" : "text-xs text-gray-400"}`}>
                        {p.name}
                      </span>
                      {p.is_serialized ? (
                        <span className="text-[10px] text-blue-500 mr-1">(جهاز)</span>
                      ) : (
                        <span className="text-[10px] text-orange-500 mr-1">(اكسسوار)</span>
                      )}
                    </td>
                    <td className="py-2 text-gray-500">{p.category_name}</td>
                    <td className="py-2 text-end font-medium">{p.total_sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
