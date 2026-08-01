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
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import SectionTitle from "./SectionTitle";

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

const RADIAN = Math.PI / 180;

const CenteredPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  percent,
}) => {
  const radius = (innerRadius + outerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight={600}
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ChartSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader>
      <Skeleton className="h-5 w-40" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[320px] w-full rounded-lg" />
    </CardContent>
  </Card>
);

const DailyTrendChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">
          اتجاه المبيعات والأرباح اليومي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
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
  const chartData = [
    { name: "المبيعات", value: data?.sales || 0 },
    ...(data?.maintenance
      ? [{ name: "الصيانة", value: data.maintenance }]
      : []),
  ];

  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const isEmpty = total === 0;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">توزيع الإيرادات</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex h-[320px] flex-col items-center justify-center gap-3 text-center">
            <PieChartIcon className="h-10 w-10 text-muted-foreground/50" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                لا توجد بيانات متاحة لهذه الفترة
              </p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                سيظهر توزيع الإيرادات هنا بمجرد توفر بيانات
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={CenteredPieLabel}
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
        )}
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
        <ResponsiveContainer width="100%" height={320}>
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
              width={90}
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

const DashboardCharts = ({
  dailySummary,
  revenueBreakdown,
  expenseBreakdown,
  isPending,
}) => {
  if (isPending) {
    return (
      <section className="mb-8">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ChartSkeleton />
          </div>
          <ChartSkeleton />
        </div>
      </section>
    );
  }

  const showDaily = dailySummary?.length > 0;
  const showExpense = expenseBreakdown?.length > 0;

  const secondaryCharts = [
    <RevenueBreakdownChart key="revenue" data={revenueBreakdown} />,
  ];
  if (showExpense) {
    secondaryCharts.push(
      <ExpenseBreakdownChart key="expense" data={expenseBreakdown} />
    );
  }

  return (
    <section className="mb-8">
      <SectionTitle title="التحليلات والاتجاهات" icon={BarChart3} />
      {!showDaily ? (
        <div
          className={
            secondaryCharts.length === 1
              ? "max-w-2xl"
              : "grid grid-cols-1 gap-6 lg:grid-cols-2"
          }
        >
          {secondaryCharts}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <DailyTrendChart data={dailySummary} />
          </div>
          {secondaryCharts.length > 0 && (
            <div className="space-y-6">{secondaryCharts}</div>
          )}
        </div>
      )}
    </section>
  );
};

export default DashboardCharts;
