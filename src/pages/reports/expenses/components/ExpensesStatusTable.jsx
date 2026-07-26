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

const statusConfig = {
  paid: { label: "مدفوع", className: "bg-green-100 text-green-800" },
  pending: { label: "معلق", className: "bg-yellow-100 text-yellow-800" },
  cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
};

const ExpensesStatusTable = ({ data, isPending }) => {
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
        <CardTitle className="text-base">المصروفات حسب الحالة</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border bg-white mx-6 mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">العدد</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => {
                const status = statusConfig[item.status] || {
                  label: item.status,
                  className: "bg-gray-100 text-gray-800",
                };
                return (
                  <TableRow key={item.status}>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell>{item.count ?? 0}</TableCell>
                    <TableCell>{formatCurrency(item.total_amount || 0)}</TableCell>
                  </TableRow>
                );
              })}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
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

export default ExpensesStatusTable;
