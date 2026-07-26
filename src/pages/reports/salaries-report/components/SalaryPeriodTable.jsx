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
      {Array.from({ length: 3 }).map((__, j) => (
        <TableCell key={j}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));

const SalaryPeriodTable = ({ data, isPending }) => {
  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">الرواتب حسب الفترة</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الفترة</TableHead>
              <TableHead className="text-left">عدد الدفعات</TableHead>
              <TableHead className="text-left">المبلغ الإجمالي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.period}>
                <TableCell className="font-medium">{row.period}</TableCell>
                <TableCell className="text-left tabular-nums">{row.payment_count ?? 0}</TableCell>
                <TableCell className="text-left font-semibold tabular-nums">
                  {formatCurrency(row.total_amount || 0)}
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  لا توجد بيانات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SalaryPeriodTable;
