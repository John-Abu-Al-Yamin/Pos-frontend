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

const PurchaseByPeriodTable = ({ data, isPending }) => {
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
        <CardTitle className="text-base">المشتريات حسب الفترة</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border bg-white mx-6 mb-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">عدد المشتريات</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">إجمالي المبلغ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.period}</TableCell>
                  <TableCell>{item.transaction_count ?? 0}</TableCell>
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

export default PurchaseByPeriodTable;
