import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

const SkeletonRows = () =>
  Array.from({ length: 4 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 2 }).map((__, j) => (
        <TableCell key={j}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));

const RevenueBreakdown = ({ revenue, isPending }) => {
  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              <SkeletonRows />
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (!revenue) return null;

  const salesItems = [
    { label: "إجمالي المبيعات", value: revenue.sales_gross_revenue, key: "sales_gross" },
    { label: "الخصومات", value: 0, key: "discounts" },
    { label: "المرتجعات", value: revenue.sales_returns, key: "returns" },
  ];

  if (revenue.sales_gross_revenue != null) {
    const discountsAndReturns = (revenue.sales_gross_revenue || 0) - (revenue.sales_net_revenue || 0);
    salesItems[1] = { label: "الخصومات والمرتجعات", value: discountsAndReturns > 0 ? discountsAndReturns : 0, key: "discounts_returns" };
  }

  const maintenanceItems = [
    { label: "إيرادات العمالة", value: revenue.maintenance_labor_revenue, key: "labor" },
    { label: "إيرادات قطع الغيار", value: revenue.maintenance_parts_revenue, key: "parts" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">إيرادات المبيعات</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>البيان</TableHead>
                <TableHead className="text-left">القيمة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">إجمالي المبيعات</TableCell>
                <TableCell className="text-left font-semibold text-green-600">
                  {formatCurrency(revenue.sales_gross_revenue || 0)}
                </TableCell>
              </TableRow>
              {revenue.sales_returns > 0 && (
                <TableRow>
                  <TableCell className="text-muted-foreground">مرتجعات المبيعات</TableCell>
                  <TableCell className="text-left text-destructive">
                    -{formatCurrency(revenue.sales_returns || 0)}
                  </TableCell>
                </TableRow>
              )}
              <TableRow className="bg-muted/30">
                <TableCell className="font-bold">صافي إيرادات المبيعات</TableCell>
                <TableCell className="text-left font-bold text-primary">
                  {formatCurrency(revenue.sales_net_revenue || 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">إيرادات الصيانة</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>البيان</TableHead>
                <TableHead className="text-left">القيمة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">إجمالي إيرادات الصيانة</TableCell>
                <TableCell className="text-left font-semibold text-green-600">
                  {formatCurrency(revenue.maintenance_revenue || 0)}
                </TableCell>
              </TableRow>
              <TableRow className="bg-muted/30">
                <TableCell className="font-bold">إجمالي الإيرادات</TableCell>
                <TableCell className="text-left font-bold text-primary">
                  {formatCurrency(revenue.formula_revenue || revenue.sales_net_revenue || 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueBreakdown;
