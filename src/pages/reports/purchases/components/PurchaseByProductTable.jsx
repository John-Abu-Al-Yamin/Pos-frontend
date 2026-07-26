import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

const PurchaseByProductTable = ({ data, isPending }) => {
  if (isPending) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">المشتريات حسب المنتج</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border bg-white mx-6 mb-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الكمية المشتراة</TableHead>
                <TableHead className="text-right">إجمالي التكلفة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.product_id}>
                  <TableCell className="font-medium">{item.product_name}</TableCell>
                  <TableCell>{item.product_type || "—"}</TableCell>
                  <TableCell>{item.total_quantity ?? 0}</TableCell>
                  <TableCell>{formatCurrency(item.total_amount || 0)}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
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

export default PurchaseByProductTable;
