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

const STATUS_COLORS = {
  paid: "#16a34a",
  pending: "#d97706",
  cancelled: "#dc2626",
};

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

const ExpenseTrendChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">اتجاه المصروفات</CardTitle>
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
              dataKey="total_amount"
              name="المبلغ"
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ExpensesByPeriodChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">المصروفات حسب الفترة</CardTitle>
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
            <Bar dataKey="total_amount" name="المبلغ" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ExpensesByCategoryChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">المصروفات حسب التصنيف</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total_amount"
              nameKey="expense_category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ expense_category, percent }) =>
                `${expense_category} ${(percent * 100).toFixed(0)}%`
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

const ExpensesByStatusChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">المصروفات حسب الحالة</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="status"
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={formatCurrencyValue}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip formatter={formatCurrencyValue} />} />
            <Bar dataKey="total_amount" name="المبلغ" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status] || "#6b7280"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ExpensesCharts = ({
  byCategory,
  byPeriod,
  byStatus,
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

  const hasCharts = byPeriod?.length || byCategory?.length || byStatus?.length;

  if (!hasCharts) return null;

  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {byPeriod?.length > 0 && <ExpenseTrendChart data={byPeriod} />}
        {byPeriod?.length > 0 && <ExpensesByPeriodChart data={byPeriod} />}
        {byCategory?.length > 0 && <ExpensesByCategoryChart data={byCategory} />}
        {byStatus?.length > 0 && <ExpensesByStatusChart data={byStatus} />}
      </div>
    </div>
  );
};

export default ExpensesCharts;
