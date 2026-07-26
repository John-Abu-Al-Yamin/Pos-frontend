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
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const MOVEMENT_LABELS = {
  purchase: "شراء",
  sale: "بيع",
  sale_return: "مرتجع بيع",
  purchase_return: "مرتجع شراء",
  adjustment: "تسوية",
  maintenance_usage: "استخدام صيانة",
};

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

const StockMovementTable = ({ movements, dateFrom, dateTo, isPending }) => {
  if (!isPending && (!movements || movements.length === 0)) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">حركات المخزون</CardTitle>
        {(dateFrom || dateTo) && (
          <p className="text-xs text-muted-foreground">
            {dateFrom && `من ${dateFrom}`} {dateTo && `إلى ${dateTo}`}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الحركة</TableHead>
              <TableHead>الكمية</TableHead>
              <TableHead>القيمة</TableHead>
              <TableHead>عدد المعاملات</TableHead>
              <TableHead>الاتجاه</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <SkeletonRows />
            ) : (
              movements?.map((movement) => (
                <TableRow key={movement.movement_type}>
                  <TableCell className="font-medium">
                    {MOVEMENT_LABELS[movement.movement_type] || movement.movement_type}
                  </TableCell>
                  <TableCell>{movement.total_quantity ?? 0}</TableCell>
                  <TableCell>{formatCurrency(movement.total_value || 0)}</TableCell>
                  <TableCell>{movement.transaction_count ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant={movement.direction === "in" ? "secondary" : "destructive"} className="flex items-center gap-1 w-fit">
                      {movement.direction === "in" ? (
                        <><ArrowUpRight className="h-3 w-3" /> وارد</>
                      ) : (
                        <><ArrowDownRight className="h-3 w-3" /> صادر</>
                      )}
                    </Badge>
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

export default StockMovementTable;
