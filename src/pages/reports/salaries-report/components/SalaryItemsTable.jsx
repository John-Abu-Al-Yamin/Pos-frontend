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

const ITEM_TYPE_LABELS = {
  salary: "الراتب الأساسي",
  bonus: "مكافأة",
  deduction: "خصم",
  overtime: "عمل إضافي",
  adjustment: "تسوية",
};

const ITEM_TYPE_VARIANTS = {
  salary: "default",
  bonus: "secondary",
  deduction: "destructive",
  overtime: "outline",
  adjustment: "secondary",
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

const SalaryItemsTable = ({ data, isPending }) => {
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
        <CardTitle className="text-base">تفصيل بنود الراتب</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>النوع</TableHead>
              <TableHead className="text-left">عدد البنود</TableHead>
              <TableHead className="text-left">المبلغ الإجمالي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.type}>
                <TableCell>
                  <Badge variant={ITEM_TYPE_VARIANTS[item.type] || "outline"}>
                    {ITEM_TYPE_LABELS[item.type] || item.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-left tabular-nums">{item.item_count ?? 0}</TableCell>
                <TableCell className="text-left font-semibold tabular-nums">
                  {formatCurrency(item.total_amount || 0)}
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

export default SalaryItemsTable;
