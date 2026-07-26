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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

const STATUS_CONFIG = {
  draft: { label: "مسودة", variant: "secondary" },
  confirmed: { label: "مؤكد", variant: "default" },
  cancelled: { label: "ملغي", variant: "destructive" },
};

const SkeletonRows = () =>
  Array.from({ length: 3 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 3 }).map((__, j) => (
        <TableCell key={j}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));

const SalaryStatusBreakdown = ({ data, isPending }) => {
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

  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => {
    const order = { confirmed: 0, draft: 1, cancelled: 2 };
    return (order[a.status] ?? 99) - (order[b.status] ?? 99);
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">توزيع الرواتب حسب الحالة</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-left">عدد الدفعات</TableHead>
              <TableHead className="text-left">المبلغ الإجمالي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((item) => {
              const config = STATUS_CONFIG[item.status] || { label: item.status, variant: "outline" };
              return (
                <TableRow key={item.status}>
                  <TableCell>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </TableCell>
                  <TableCell className="text-left font-medium tabular-nums">
                    {item.payment_count ?? 0}
                  </TableCell>
                  <TableCell className="text-left font-semibold tabular-nums">
                    {formatCurrency(item.total_amount || 0)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SalaryStatusBreakdown;
