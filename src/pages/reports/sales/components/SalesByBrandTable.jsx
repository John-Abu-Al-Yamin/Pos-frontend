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

const SalesByBrandTable = ({ data, isPending }) => {
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
        <CardTitle className="text-base">المبيعات حسب العلامة التجارية</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border bg-white mx-6 mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العلامة التجارية</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">الإيرادات</TableHead>
                <TableHead className="text-right">التكلفة</TableHead>
                <TableHead className="text-right">الربح</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.brand_id}>
                  <TableCell className="font-medium">{item.brand_name}</TableCell>
                  <TableCell>{item.total_quantity ?? 0}</TableCell>
                  <TableCell>{formatCurrency(item.total_revenue || 0)}</TableCell>
                  <TableCell>{formatCurrency(item.total_cogs || 0)}</TableCell>
                  <TableCell>{formatCurrency(item.gross_profit || 0)}</TableCell>
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

export default SalesByBrandTable;
