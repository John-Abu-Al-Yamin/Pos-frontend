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
import { formatCurrency, formatDate } from "@/lib/utils";

const SkeletonRows = () =>
  Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 5 }).map((__, j) => (
        <TableCell key={j}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));

const EmployeeSalaryTable = ({ data, isPending }) => {
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
        <CardTitle className="text-base">تحليل الرواتب حسب الموظف</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الموظف</TableHead>
                <TableHead className="text-left">عدد الدفعات</TableHead>
                <TableHead className="text-left">إجمالي المبلغ</TableHead>
                <TableHead className="text-left">بداية الفترة</TableHead>
                <TableHead className="text-left">نهاية الفترة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((emp) => (
                <TableRow key={emp.employee_id}>
                  <TableCell className="font-medium">{emp.employee_name || "—"}</TableCell>
                  <TableCell className="text-left tabular-nums">{emp.payment_count ?? 0}</TableCell>
                  <TableCell className="text-left font-semibold tabular-nums">
                    {formatCurrency(emp.total_amount || 0)}
                  </TableCell>
                  <TableCell className="text-left text-xs">
                    {emp.first_period_start ? formatDate(emp.first_period_start) : "—"}
                  </TableCell>
                  <TableCell className="text-left text-xs">
                    {emp.last_period_end ? formatDate(emp.last_period_end) : "—"}
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    لا توجد بيانات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeSalaryTable;
