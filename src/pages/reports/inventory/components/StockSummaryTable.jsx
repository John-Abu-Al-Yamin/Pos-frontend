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

const TYPE_LABELS = {
  mobile: "جوال",
  accessory: "إكسسوار",
  spare_part: "قطعة غيار",
};

const TYPE_BADGE_VARIANTS = {
  mobile: "default",
  accessory: "secondary",
  spare_part: "outline",
};

const SkeletonRows = () =>
  Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 6 }).map((__, j) => (
        <TableCell key={j}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));

const StockSummaryTable = ({ products, isPending }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">ملخص المخزون — المنتجات</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">المنتج</TableHead>
              <TableHead className="text-center">النوع</TableHead>
              <TableHead className="text-center">الكمية المتاحة</TableHead>
              <TableHead className="text-center">الحد الأدنى</TableHead>
              <TableHead className="text-center">متوسط السعر</TableHead>
              <TableHead className="text-center">قيمة المخزون</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <SkeletonRows />
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  لا توجد منتجات
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell className="font-medium truncate max-w-[180px] text-center align-middle">
                    {product.product_name || "—"}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <Badge variant={TYPE_BADGE_VARIANTS[product.product_type] || "outline"}>
                      {TYPE_LABELS[product.product_type] || product.product_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center align-middle tabular-nums">
                    {product.available_quantity ?? 0}
                  </TableCell>
                  <TableCell className="text-center align-middle tabular-nums">
                    {product.min_stock ?? "—"}
                  </TableCell>
                  <TableCell className="text-center align-middle tabular-nums">
                    {formatCurrency(product.avg_cost_price || 0)}
                  </TableCell>
                  <TableCell className="text-center align-middle font-semibold tabular-nums">
                    {formatCurrency(product.stock_value || 0)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StockSummaryTable;
