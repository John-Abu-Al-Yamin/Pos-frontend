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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CHART_COLORS = [
  "hsl(0, 0%, 20%)",
  "hsl(0, 0%, 50%)",
  "hsl(0, 0%, 70%)",
  "hsl(0, 0%, 35%)",
  "hsl(0, 0%, 60%)",
];

const formatCurrencyValue = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value?.toLocaleString() || "0";
};

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card p-3 shadow-md text-xs">
      <p className="font-medium mb-1 text-foreground">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} style={{ color: entry.color }}>
          {entry.name}: {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
};

const ChartSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader>
      <Skeleton className="h-5 w-40" />
    </CardHeader>
    <CardContent>
        <Skeleton className="h-[350px] w-full rounded-lg" />
    </CardContent>
  </Card>
);

const DailyTrendChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">اتجاه المبيعات والأرباح اليومي</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
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
              dataKey="sales_net_revenue"
              name="إيرادات المبيعات"
              stroke="#222"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5, strokeWidth: 1 }}
            />
            {data[0]?.sales_profit !== undefined && (
              <Line
                type="monotone"
                dataKey="sales_profit"
                name="أرباح المبيعات"
                stroke="#666"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5, strokeWidth: 1 }}
              />
            )}
            {data[0]?.net_profit !== undefined && (
              <Line
                type="monotone"
                dataKey="net_profit"
                name="صافي الربح"
                stroke="#999"
                strokeWidth={2}
                strokeDasharray="4 2"
                dot={{ r: 3 }}
                activeDot={{ r: 5, strokeWidth: 1 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const RevenueBreakdownChart = ({ data }) => {
  if (!data) return null;
  const chartData = [
    { name: "المبيعات", value: data.sales || 0 },
    ...(data.maintenance ? [{ name: "الصيانة", value: data.maintenance }] : []),
  ];

  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">توزيع الإيرادات</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((_, idx) => (
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

const ExpenseBreakdownChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">توزيع المصروفات</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              tickFormatter={formatCurrencyValue}
              className="text-muted-foreground"
            />
            <YAxis
              type="category"
              dataKey="expense_category"
              tick={{ fontSize: 10 }}
              width={100}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip formatter={formatCurrencyValue} />} />
            <Bar dataKey="paid_amount" name="المدفوع" fill="#333" radius={[0, 4, 4, 0]} />
            <Bar dataKey="pending_amount" name="المعلق" fill="#999" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const DashboardCharts = ({ dailySummary, revenueBreakdown, expenseBreakdown, isPending }) => {
  if (isPending) {
    return (
      <div className="space-y-6 mb-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  const hasDailyData = dailySummary?.length > 0;
  const hasRevenueData = revenueBreakdown && (revenueBreakdown.sales > 0 || revenueBreakdown.maintenance > 0);
  const hasExpenseData = expenseBreakdown?.length > 0;

  if (!hasDailyData && !hasRevenueData && !hasExpenseData) return null;

  return (
    <div className="space-y-6 mb-6">
      {hasDailyData && <DailyTrendChart data={dailySummary} />}
      {hasRevenueData && <RevenueBreakdownChart data={revenueBreakdown} />}
      {hasExpenseData && <ExpenseBreakdownChart data={expenseBreakdown} />}
    </div>
  );
};

export default DashboardCharts;
