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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ShoppingCart, Activity } from "lucide-react";
import SectionTitle from "./SectionTitle";

const movementTypeLabels = {
  purchase: "مشتريات",
  sale: "مبيعات",
  return: "مرتجعات",
  adjustment: "تسوية",
};

const SectionSkeleton = () => (
  <Card>
    <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
    <CardContent>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded" />
        ))}
      </div>
    </CardContent>
  </Card>
);

const LatestSales = ({ data }) => {
  if (!data || data.length === 0) return null;
  const showAmount = data[0]?.total_amount !== undefined;
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">آخر المبيعات</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border bg-white mx-6 mb-6 overflow-x-auto transition-shadow duration-200 hover:shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الفاتورة</TableHead>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">بواسطة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                {showAmount && <TableHead className="text-right">المبلغ</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.invoice_number}</TableCell>
                  <TableCell>{sale.customer_name}</TableCell>
                  <TableCell>{sale.created_by}</TableCell>
                  <TableCell className="text-xs">{formatDateTime(sale.created_at)}</TableCell>
                  {showAmount && <TableCell>{formatCurrency(sale.total_amount || 0)}</TableCell>}
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={showAmount ? 5 : 4} className="h-24 text-center text-muted-foreground">
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

const LatestMaintenance = ({ data }) => {
  if (!data || data.length === 0) return null;
  const showCost = data[0]?.total_cost !== undefined;
  const statusColor = {
    pending: "secondary",
    under_repair: "default",
    waiting_parts: "outline",
    delivered: "secondary",
    repaired: "default",
    cancelled: "destructive",
  };
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">آخر تذاكر الصيانة</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border bg-white mx-6 mb-6 overflow-x-auto transition-shadow duration-200 hover:shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">التذكرة</TableHead>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">الجهاز</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                {showCost && <TableHead className="text-right">التكلفة</TableHead>}
                <TableHead className="text-right">التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.ticket_number}</TableCell>
                  <TableCell>{ticket.customer_name}</TableCell>
                  <TableCell className="text-xs">{ticket.device}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor[ticket.status] || "outline"}>{ticket.status}</Badge>
                  </TableCell>
                  {showCost && <TableCell>{formatCurrency(ticket.total_cost || 0)}</TableCell>}
                  <TableCell className="text-xs">{formatDateTime(ticket.created_at)}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={showCost ? 6 : 5} className="h-24 text-center text-muted-foreground">
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

const LatestExpenses = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">آخر المصروفات</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border bg-white mx-6 mb-6 overflow-x-auto transition-shadow duration-200 hover:shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">التصنيف</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.expense_category}</TableCell>
                  <TableCell>
                    <Badge variant={expense.status === "paid" ? "default" : "secondary"}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{expense.expense_date}</TableCell>
                  <TableCell>{formatCurrency(expense.amount || 0)}</TableCell>
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

const LatestStockMovements = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">آخر حركات المخزون</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border bg-white mx-6 mb-6 overflow-x-auto transition-shadow duration-200 hover:shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الاتجاه</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">بواسطة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-medium">{movement.product_name}</TableCell>
                  <TableCell>{movementTypeLabels[movement.movement_type] || movement.movement_type}</TableCell>
                  <TableCell>
                    <Badge variant={movement.direction === "in" ? "default" : "destructive"}>
                      {movement.direction === "in" ? "داخل" : "خارج"}
                    </Badge>
                  </TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.created_by}</TableCell>
                  <TableCell className="text-xs">{formatDateTime(movement.created_at)}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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

const RecentActivity = ({ recentActivity, isPending }) => {
  if (isPending) {
    return (
      <section className="mb-8">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
      </section>
    );
  }

  if (!recentActivity) return null;

  const hasSales = recentActivity.latest_sales?.length > 0;
  const hasMaintenance = recentActivity.latest_maintenance_tickets?.length > 0;
  const hasExpenses = recentActivity.latest_expenses?.length > 0;
  const hasStock = recentActivity.latest_stock_movements?.length > 0;

  if (!hasSales && !hasMaintenance && !hasExpenses && !hasStock) return null;

  return (
    <section className="mb-8">
      <SectionTitle title="النشاط الأخير" icon={Activity} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasSales && <LatestSales data={recentActivity.latest_sales} />}
        {hasMaintenance && <LatestMaintenance data={recentActivity.latest_maintenance_tickets} />}
        {hasExpenses && <LatestExpenses data={recentActivity.latest_expenses} />}
        {hasStock && <LatestStockMovements data={recentActivity.latest_stock_movements} />}
      </div>
    </section>
  );
};

export default RecentActivity;
