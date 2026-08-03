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
  Array.from({ length: 3 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 4 }).map((__, j) => (
        <TableCell key={j}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));

const ProductTypeTable = ({ data, isPending }) => {
  if (!isPending && (!data || data.length === 0)) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">المخزون حسب نوع المنتج</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">النوع</TableHead>
              <TableHead className="text-center">عدد المنتجات</TableHead>
              <TableHead className="text-center">الكمية الإجمالية</TableHead>
              <TableHead className="text-center">قيمة المخزون</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <SkeletonRows />
            ) : (
              data?.map((row) => (
                <TableRow key={row.product_type}>
                  <TableCell className="text-center align-middle">
                    <Badge variant={TYPE_BADGE_VARIANTS[row.product_type] || "outline"}>
                      {TYPE_LABELS[row.product_type] || row.product_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center align-middle tabular-nums">
                    {row.product_count}
                  </TableCell>
                  <TableCell className="text-center align-middle tabular-nums">
                    {row.total_quantity}
                  </TableCell>
                  <TableCell className="text-center align-middle font-semibold tabular-nums">
                    {formatCurrency(row.stock_value || 0)}
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

export default ProductTypeTable;
