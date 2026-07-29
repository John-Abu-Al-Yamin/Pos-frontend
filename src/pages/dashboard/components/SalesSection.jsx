import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Undo2, Package } from "lucide-react";

const SalesSection = ({ sales, isPending }) => {
  if (isPending) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
          <CardContent><Skeleton className="h-24 w-full rounded-lg" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
          <CardContent><Skeleton className="h-64 w-full rounded-lg" /></CardContent>
        </Card>
      </div>
    );
  }

  if (!sales) return null;

  const returnsSummary = sales.total_returns !== undefined && (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Undo2 className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">ملخص المرتجعات</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-muted p-4 border border-border transition-all duration-200 hover:bg-accent hover:border-accent">
            <p className="text-xs font-medium text-muted-foreground mb-1">إجمالي المرتجعات</p>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(sales.total_returns || 0)}
            </p>
          </div>
          <div className="rounded-lg bg-muted p-4 border border-border transition-all duration-200 hover:bg-accent hover:border-accent">
            <p className="text-xs font-medium text-muted-foreground mb-1">عدد المرتجعات</p>
            <p className="text-xl font-bold text-foreground">
              {sales.returns_count ?? 0}
            </p>
          </div>
          <div className="rounded-lg bg-muted p-4 border border-border transition-all duration-200 hover:bg-accent hover:border-accent">
            <p className="text-xs font-medium text-muted-foreground mb-1">الكمية المباعة</p>
            <p className="text-xl font-bold text-foreground">
              {sales.total_quantity_sold ?? 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const bestSelling = sales.best_selling?.length > 0 && (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">أفضل المنتجات مبيعاً</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border bg-white mx-6 mb-6 overflow-x-auto transition-shadow duration-200 hover:shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">#</TableHead>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">الإيرادات</TableHead>
                {sales.best_selling[0]?.gross_profit !== undefined && (
                  <TableHead className="text-right">الربح</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.best_selling.map((item, idx) => (
                <TableRow key={item.product_id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{item.total_quantity ?? 0}</TableCell>
                  <TableCell>{formatCurrency(item.total_revenue || 0)}</TableCell>
                  {item.gross_profit !== undefined && (
                    <TableCell>{formatCurrency(item.gross_profit || 0)}</TableCell>
                  )}
                </TableRow>
              ))}
              {sales.best_selling.length === 0 && (
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

  if (!returnsSummary && !bestSelling) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {returnsSummary}
      {bestSelling}
    </div>
  );
};

export default SalesSection;
