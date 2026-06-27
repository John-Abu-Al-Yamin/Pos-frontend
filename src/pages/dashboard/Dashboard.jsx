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
import { useGetDashboardData, useGetProductsPerformance, useGetLowStock } from "@/hooks/Actions/dashboard/useCurdsDashboard";
import { formatCurrency } from "@/lib/utils";
import DateFilter from "@/_components/dashboard/DateFilter";
import Header from "@/_components/dashboard/Header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <Card className="bg-white dark:bg-gray-900 p-5 gap-0">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </Card>
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
  const { data: lowStockData, isPending: lowStockLoading } = useGetLowStock();

  const metrics = data?.data?.data;
  const bestSellers = perfData?.data?.data?.bestSelling ?? [];
  const worstSellers = perfData?.data?.data?.worstSelling ?? [];
  const lowStockItems = lowStockData?.data?.data ?? [];

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
            <Button
              onClick={() => refetch()}
              variant="default"
              className="rounded-lg"
            >
              <RefreshCw className="h-4 w-4" />
              إعادة المحاولة
            </Button>
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
                <Card
                  key={card.key}
                  className="bg-white dark:bg-gray-900 p-5 hover:shadow-lg transition-all duration-300 gap-0"
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
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="bg-white dark:bg-gray-900 p-5 gap-0">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <ArrowUp className="h-4 w-4 text-emerald-500" />
            الأكثر مبيعاً
          </h3>
          {perfLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : bestSellers.length === 0 ? (
            <p className="text-sm text-gray-400">لا توجد مبيعات في هذه الفترة.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b dark:border-gray-700">
                  <TableHead className="text-start font-medium text-gray-400 h-auto px-0 pb-2">المنتج</TableHead>
                  <TableHead className="text-start font-medium text-gray-400 h-auto px-0 pb-2">التصنيف</TableHead>
                  <TableHead className="text-end font-medium text-gray-400 h-auto px-0 pb-2">الكمية</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bestSellers.map((p) => (
                  <TableRow key={p.id} className="hover:bg-transparent border-b dark:border-gray-800 last:border-0">
                    <TableCell className="py-2 px-0 text-gray-900 dark:text-gray-100 whitespace-normal">
                      <span className={`${p.is_serialized ? "" : "text-xs text-gray-400"}`}>
                        {p.name}
                      </span>
                      {p.is_serialized ? (
                        <span className="text-[10px] text-blue-500 mr-1">(جهاز)</span>
                      ) : (
                        <span className="text-[10px] text-orange-500 mr-1">(اكسسوار)</span>
                      )}
                    </TableCell>
                    <TableCell className="py-2 px-0 text-gray-500 whitespace-normal">{p.category_name}</TableCell>
                    <TableCell className="py-2 px-0 text-end font-medium whitespace-normal">{p.total_sold}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        <Card className="bg-white dark:bg-gray-900 p-5 gap-0">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <ArrowDown className="h-4 w-4 text-red-500" />
            الأقل مبيعاً
          </h3>
          {perfLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : worstSellers.length === 0 ? (
            <p className="text-sm text-gray-400">لا توجد منتجات.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b dark:border-gray-700">
                  <TableHead className="text-start font-medium text-gray-400 h-auto px-0 pb-2">المنتج</TableHead>
                  <TableHead className="text-start font-medium text-gray-400 h-auto px-0 pb-2">التصنيف</TableHead>
                  <TableHead className="text-end font-medium text-gray-400 h-auto px-0 pb-2">الكمية</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {worstSellers.map((p) => (
                  <TableRow key={p.id} className="hover:bg-transparent border-b dark:border-gray-800 last:border-0">
                    <TableCell className="py-2 px-0 text-gray-900 dark:text-gray-100 whitespace-normal">
                      <span className={`${p.is_serialized ? "" : "text-xs text-gray-400"}`}>
                        {p.name}
                      </span>
                      {p.is_serialized ? (
                        <span className="text-[10px] text-blue-500 mr-1">(جهاز)</span>
                      ) : (
                        <span className="text-[10px] text-orange-500 mr-1">(اكسسوار)</span>
                      )}
                    </TableCell>
                    <TableCell className="py-2 px-0 text-gray-500 whitespace-normal">{p.category_name}</TableCell>
                    <TableCell className="py-2 px-0 text-end font-medium whitespace-normal">{p.total_sold}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <div className="mt-8">
        <Card className="bg-white dark:bg-gray-900 p-5 gap-0">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            مخزون منخفض
          </h3>
          {lowStockLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : lowStockItems.length === 0 ? (
            <p className="text-sm text-gray-400">جميع المنتجات متوفرة بكميات كافية.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b dark:border-gray-700">
                  <TableHead className="text-start font-medium text-gray-400 h-auto px-0 pb-2">المنتج</TableHead>
                  <TableHead className="text-start font-medium text-gray-400 h-auto px-0 pb-2">التصنيف</TableHead>
                  <TableHead className="text-center font-medium text-gray-400 h-auto px-0 pb-2">المتوفر</TableHead>
                  <TableHead className="text-center font-medium text-gray-400 h-auto px-0 pb-2">الحد الأدنى</TableHead>
                  <TableHead className="text-center font-medium text-gray-400 h-auto px-0 pb-2">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((p) => (
                  <TableRow key={p.id} className="hover:bg-transparent border-b dark:border-gray-800 last:border-0">
                    <TableCell className="py-2 px-0 text-gray-900 dark:text-gray-100 whitespace-normal">
                      <span className="font-medium">{p.name}</span>
                      {p.is_serialized ? (
                        <span className="text-[10px] text-blue-500 mr-1">(جهاز)</span>
                      ) : (
                        <span className="text-[10px] text-orange-500 mr-1">(اكسسوار)</span>
                      )}
                    </TableCell>
                    <TableCell className="py-2 px-0 text-gray-500 whitespace-normal">{p.category_name}</TableCell>
                    <TableCell className="py-2 px-0 text-center font-mono font-bold text-red-600 whitespace-normal">
                      {p.available_count}
                    </TableCell>
                    <TableCell className="py-2 px-0 text-center text-gray-500 whitespace-normal">
                      {p.min_stock}
                    </TableCell>
                    <TableCell className="py-2 px-0 text-center whitespace-normal">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 rounded-full">
                        <AlertCircle className="h-3 w-3" />
                        منخفض
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </>
  );
}
