import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
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
  "#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed",
  "#0891b2", "#db2777", "#ea580c",
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

const StockValuePieChart = ({ stockValue }) => {
  if (!stockValue) return null;
  const data = [
    { name: "أجهزة جوالة", value: stockValue.mobile_devices?.value || 0 },
    { name: "منتجات سائبة", value: stockValue.bulk_products?.value || 0 },
  ];
  if (data.every((d) => d.value === 0)) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">توزيع قيمة المخزون</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={CHART_COLORS[idx]} />
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

const ProductTypeChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">المخزون حسب نوع المنتج</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="product_type"
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={formatCurrencyValue}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip formatter={formatCurrencyValue} />} />
            <Bar dataKey="stock_value" name="قيمة المخزون" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const MovementChart = ({ movements }) => {
  if (!movements || movements.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">حركات المخزون</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={movements} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <YAxis
              type="category"
              dataKey="movement_type"
              tick={{ fontSize: 10 }}
              width={100}
              className="text-muted-foreground"
            />
            <Tooltip />
            <Bar dataKey="total_quantity" name="الكمية" radius={[0, 4, 4, 0]}>
              {movements.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.direction === "in" ? "#16a34a" : "#dc2626"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const InventoryCharts = ({
  stockValue,
  byProductType,
  stockMovements,
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

  const hasCharts = stockValue || byProductType?.length || stockMovements?.movements?.length;

  if (!hasCharts) return null;

  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stockValue && <StockValuePieChart stockValue={stockValue} />}
        {byProductType?.length > 0 && <ProductTypeChart data={byProductType} />}
        {stockMovements?.movements?.length > 0 && <MovementChart movements={stockMovements.movements} />}
      </div>
    </div>
  );
};

export default InventoryCharts;
