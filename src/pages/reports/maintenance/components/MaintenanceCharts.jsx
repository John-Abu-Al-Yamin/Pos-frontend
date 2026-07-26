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

const RevenueTrendChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">اتجاه إيرادات الصيانة</CardTitle>
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
              stroke="#7c3aed"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const TicketsByPeriodChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">التذاكر حسب الفترة</CardTitle>
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
              className="text-muted-foreground"
            />
            <Tooltip />
            <Bar dataKey="ticket_count" name="عدد التذاكر" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const DeviceTypePieChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">تحليل نوع الجهاز</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="ticket_count"
              nameKey="device_type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ device_type, percent }) =>
                `${device_type} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={CHART_COLORS[idx % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const DeviceTypeRevenueChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">الإيرادات حسب نوع الجهاز</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="device_type"
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={formatCurrencyValue}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip formatter={formatCurrencyValue} />} />
            <Bar dataKey="total_revenue" name="الإيرادات" fill="#0891b2" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const SparePartsChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const topData = data.slice(0, 10);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">أكثر قطع الغيار استخداماً</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
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
            <Bar dataKey="total_quantity" name="الكمية" fill="#d97706" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const MaintenanceCharts = ({
  byPeriod,
  byDeviceType,
  usedPartsDetails,
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

  const hasCharts = byPeriod?.length || byDeviceType?.length || usedPartsDetails?.length;

  if (!hasCharts) return null;

  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {byPeriod?.length > 0 && <RevenueTrendChart data={byPeriod} />}
        {byPeriod?.length > 0 && <TicketsByPeriodChart data={byPeriod} />}
        {byDeviceType?.length > 0 && <DeviceTypePieChart data={byDeviceType} />}
        {byDeviceType?.length > 0 && <DeviceTypeRevenueChart data={byDeviceType} />}
        {usedPartsDetails?.length > 0 && <SparePartsChart data={usedPartsDetails} />}
      </div>
    </div>
  );
};

export default MaintenanceCharts;
