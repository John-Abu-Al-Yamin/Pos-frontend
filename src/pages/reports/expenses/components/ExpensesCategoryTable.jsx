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
import { expenseCategoryNames } from "@/constants/expenseCategories";

const ExpensesCategoryTable = ({ data, isPending }) => {
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
        <CardTitle className="text-base">المصروفات حسب التصنيف</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border bg-white mx-6 mb-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">التصنيف</TableHead>
                <TableHead className="text-right">العدد</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">معلق</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => {
                const categoryLabel = expenseCategoryNames[item.expense_category] || item.expense_category;
                return (
                  <TableRow key={item.expense_category}>
                    <TableCell className="font-medium">{categoryLabel}</TableCell>
                    <TableCell>{item.count ?? 0}</TableCell>
                    <TableCell>{formatCurrency(item.total_amount || 0)}</TableCell>
                    <TableCell>{formatCurrency(item.paid_amount || 0)}</TableCell>
                    <TableCell>{formatCurrency(item.pending_amount || 0)}</TableCell>
                  </TableRow>
                );
              })}
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

export default ExpensesCategoryTable;
