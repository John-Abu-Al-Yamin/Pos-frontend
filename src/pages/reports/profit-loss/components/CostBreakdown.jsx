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

const SkeletonRows = () =>
  Array.from({ length: 3 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 2 }).map((__, j) => (
        <TableCell key={j}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));

const CostBreakdown = ({ cogs, operatingExpenses, purchases, isPending }) => {
  if (isPending) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
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
        ))}
      </div>
    );
  }

  if (!cogs && !operatingExpenses) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">تكلفة البضاعة المباعة (COGS)</CardTitle>
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
                <TableCell className="font-medium">تكلفة المبيعات</TableCell>
                <TableCell className="text-left">{formatCurrency(cogs?.sales_cogs || 0)}</TableCell>
              </TableRow>
              {purchases && (
                <>
                  <TableRow>
                    <TableCell className="text-muted-foreground">إجمالي المشتريات</TableCell>
                    <TableCell className="text-left">{formatCurrency(purchases.total_purchases || 0)}</TableCell>
                  </TableRow>
                  {purchases.purchase_returns > 0 && (
                    <TableRow>
                      <TableCell className="text-muted-foreground">مرتجعات المشتريات</TableCell>
                      <TableCell className="text-left text-destructive">
                        -{formatCurrency(purchases.purchase_returns || 0)}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow className="bg-muted/30">
                    <TableCell className="font-bold">صافي المشتريات</TableCell>
                    <TableCell className="text-left font-semibold">{formatCurrency(purchases.net_purchases || 0)}</TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">المصروفات التشغيلية</CardTitle>
          {operatingExpenses?.basis && (
            <p className="text-xs text-muted-foreground mt-1">
              الأساس المحاسبي:{" "}
              <Badge variant="outline" className="text-xs">
                {operatingExpenses.basis === "cash" ? "نقدي" : "استحقاق"}
              </Badge>
            </p>
          )}
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
                <TableCell className="font-medium">المصروفات</TableCell>
                <TableCell className="text-left">{formatCurrency(operatingExpenses?.expenses || 0)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">الرواتب (مؤكدة)</TableCell>
                <TableCell className="text-left">{formatCurrency(operatingExpenses?.salaries || 0)}</TableCell>
              </TableRow>
              <TableRow className="bg-muted/30">
                <TableCell className="font-bold">إجمالي المصروفات التشغيلية</TableCell>
                <TableCell className="text-left font-bold text-destructive">
                  {formatCurrency(operatingExpenses?.total_operating_expenses || 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostBreakdown;
