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
import { Package } from "lucide-react";

const StatBox = ({ label, value }) => (
  <div className="rounded-lg bg-muted p-3 border border-border text-center transition-all duration-200 hover:bg-accent hover:border-accent">
    <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
    <p className="text-lg font-bold text-foreground">{value ?? "—"}</p>
  </div>
);

const InventorySection = ({ inventory, isPending }) => {
  if (isPending) {
    return (
      <Card className="mb-6">
        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-48 w-full rounded-lg mt-4" />
        </CardContent>
      </Card>
    );
  }

  if (!inventory) return null;

  const lowStockProducts = inventory.low_stock_products?.length > 0;

  return (
    <Card className="mb-6 transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">المخزون</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {inventory.total_stock_value !== undefined && (
            <StatBox label="قيمة المخزون" value={formatCurrency(inventory.total_stock_value ?? 0)} />
          )}
          <StatBox label="الموبايلات المتاحة" value={inventory.mobile_devices_available ?? 0} />
          <StatBox label="الكمية بالجملة" value={inventory.bulk_quantity_available ?? 0} />
          <StatBox label="منتجات منخفضة" value={inventory.low_stock_count ?? 0} />
        </div>

        {lowStockProducts && (
          <>
            <p className="text-sm font-medium text-muted-foreground mb-2">منتجات المخزون المنخفض</p>
            <div className="rounded-md border bg-white overflow-x-auto transition-shadow duration-200 hover:shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المنتج</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">التصنيف</TableHead>
                    <TableHead className="text-right">المخزون الحالي</TableHead>
                    <TableHead className="text-right">الحد الأدنى</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.low_stock_products.map((item) => (
                    <TableRow key={item.product_id}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>{item.product_type}</TableCell>
                      <TableCell>{item.category_name}</TableCell>
                      <TableCell className="font-medium text-destructive">{item.current_stock}</TableCell>
                      <TableCell>{item.min_stock}</TableCell>
                    </TableRow>
                  ))}
                  {inventory.low_stock_products.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        لا توجد بيانات
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InventorySection;
