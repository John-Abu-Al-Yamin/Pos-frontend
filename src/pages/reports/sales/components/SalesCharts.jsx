import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CHART_COLORS = [
  "#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed",
  "#0891b2", "#db2777", "#ea580c", "#4f46e5", "#059669",
];

const formatCurrencyValue = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value?.toLocaleString() || "0";
};

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-white p-3 shadow-sm text-xs">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} style={{ color: entry.color }}>
          {entry.name}: {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
};

const ChartSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-5 w-40" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[300px] w-full rounded-lg" />
    </CardContent>
  </Card>
);

const SalesTrendChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">اتجاه المبيعات</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={formatCurrencyValue}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip formatter={formatCurrencyValue} />} />
            <Line
              type="monotone"
              dataKey="total_revenue"
              name="الإيرادات"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="gross_profit"
              name="الربح"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const SalesByPeriodChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">المبيعات حسب الفترة</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={formatCurrencyValue}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip formatter={formatCurrencyValue} />} />
            <Bar dataKey="total_revenue" name="الإيرادات" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="total_cogs" name="التكلفة" fill="#d97706" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ProductPerformanceChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const topData = data.slice(0, 10);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">أفضل المنتجات مبيعاً</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              tickFormatter={formatCurrencyValue}
              className="text-muted-foreground"
            />
            <YAxis
              type="category"
              dataKey="product_name"
              tick={{ fontSize: 10 }}
              width={120}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip formatter={formatCurrencyValue} />} />
            <Bar dataKey="total_revenue" name="الإيرادات" fill="#2563eb" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const CategoryPerformanceChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">المبيعات حسب التصنيف</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total_revenue"
              nameKey="category_name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ category_name, percent }) =>
                `${category_name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={CHART_COLORS[idx % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip formatter={formatCurrencyValue} />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const BrandPerformanceChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">المبيعات حسب العلامة التجارية</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="brand_name"
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={formatCurrencyValue}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip formatter={formatCurrencyValue} />} />
            <Bar dataKey="total_revenue" name="الإيرادات" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ReturnsTrendChart = ({ returnsSummary }) => {
  if (!returnsSummary) return null;
  const data = [
    { name: "الإيرادات", value: returnsSummary.total_refund || 0 },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">ملخص المرتجعات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-red-50 p-4 border border-red-100 text-center">
            <p className="text-xs font-medium text-red-600 mb-1">الكمية المرتجعة</p>
            <p className="text-xl font-bold text-red-700">
              {returnsSummary.total_returned_quantity ?? 0}
            </p>
          </div>
          <div className="rounded-lg bg-orange-50 p-4 border border-orange-100 text-center">
            <p className="text-xs font-medium text-orange-600 mb-1">قيمة الاسترداد</p>
            <p className="text-xl font-bold text-orange-700">
              {new Intl.NumberFormat("ar-EG", {
                style: "currency",
                currency: "EGP",
                minimumFractionDigits: 2,
              }).format(returnsSummary.total_refund || 0)}
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4 border border-amber-100 text-center">
            <p className="text-xs font-medium text-amber-600 mb-1">عدد معاملات الإرجاع</p>
            <p className="text-xl font-bold text-amber-700">
              {returnsSummary.return_transaction_count ?? 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SalesCharts = ({
  byPeriod,
  bestSelling,
  byCategory,
  byBrand,
  returnsSummary,
  isPending,
}) => {
  if (isPending) {
    return (
      <div className="space-y-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  const hasCharts = byPeriod?.length || bestSelling?.length || byCategory?.length || byBrand?.length;

  if (!hasCharts && !returnsSummary) return null;

  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {byPeriod?.length > 0 && <SalesTrendChart data={byPeriod} />}
        {byPeriod?.length > 0 && <SalesByPeriodChart data={byPeriod} />}
        {bestSelling?.length > 0 && <ProductPerformanceChart data={bestSelling} />}
        {byCategory?.length > 0 && <CategoryPerformanceChart data={byCategory} />}
        {byBrand?.length > 0 && <BrandPerformanceChart data={byBrand} />}
      </div>
      {returnsSummary && <ReturnsTrendChart returnsSummary={returnsSummary} />}
    </div>
  );
};

export default SalesCharts;
