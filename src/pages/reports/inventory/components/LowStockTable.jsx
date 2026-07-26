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
import { AlertTriangle, MinusCircle } from "lucide-react";

const SkeletonRows = () =>
  Array.from({ length: 4 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 5 }).map((__, j) => (
        <TableCell key={j}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));

const LowStockSection = ({ title, icon: IconComponent, iconColor, products }) => (
  <div>
    <div className="flex items-center gap-2 px-6 py-3 border-b">
      <IconComponent className={`h-4 w-4 ${iconColor}`} />
      <span className="text-sm font-medium">{title} ({products?.length || 0})</span>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>المنتج</TableHead>
          <TableHead>النوع</TableHead>
          <TableHead>المخزون الحالي</TableHead>
          <TableHead>الحد الأدنى</TableHead>
          <TableHead>متوسط السعر</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-16 text-center text-muted-foreground">
              لا توجد نتائج
            </TableCell>
          </TableRow>
        ) : (
          products?.map((product) => (
            <TableRow key={product.product_id}>
              <TableCell className="font-medium truncate max-w-[200px]">
                {product.product_name || "—"}
              </TableCell>
              <TableCell>{product.product_type === "mobile" ? "جوال" : product.product_type === "accessory" ? "إكسسوار" : "قطعة غيار"}</TableCell>
              <TableCell>
                <span className="font-semibold text-destructive">
                  {product.current_stock ?? 0}
                </span>
              </TableCell>
              <TableCell>{product.min_stock ?? "—"}</TableCell>
              <TableCell>{formatCurrency(product.avg_cost_price || 0)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

const LowStockTable = ({ lowStock, isPending }) => {
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

  const hasLowStock = lowStock?.low_stock_products?.length > 0;
  const hasOutOfStock = lowStock?.out_of_stock_products?.length > 0;

  if (!hasLowStock && !hasOutOfStock) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          تنبيهات المخزون
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {hasOutOfStock && (
          <LowStockSection
            title="منتهي من المخزون"
            icon={MinusCircle}
            iconColor="text-destructive"
            products={lowStock.out_of_stock_products}
          />
        )}
        {hasLowStock && (
          <LowStockSection
            title="منخفض المخزون"
            icon={AlertTriangle}
            iconColor="text-amber-500"
            products={lowStock.low_stock_products}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockTable;
