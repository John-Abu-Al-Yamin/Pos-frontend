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
import { ShoppingCart, TrendingUp } from "lucide-react";
import SectionTitle from "./SectionTitle";

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2.5">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="text-sm font-bold text-foreground">{value}</p>
  </div>
);

const SalesSection = ({ sales, kpis, isPending }) => {
  if (isPending) {
    return (
      <section className="mb-8">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (!sales) return null;

  const hasSummary =
    kpis?.sales_invoice_count !== undefined ||
    sales.total_quantity_sold !== undefined ||
    kpis?.sales_gross_profit !== undefined ||
    sales.total_returns !== undefined;

  const hasBestSelling = sales.best_selling?.length > 0;

  if (!hasSummary && !hasBestSelling) return null;

  const summaryRows = [
    ...(kpis?.sales_invoice_count !== undefined
      ? [{ label: "عدد الفواتير", value: kpis.sales_invoice_count }]
      : []),
    ...(sales.total_quantity_sold !== undefined
      ? [{ label: "الكمية المباعة", value: sales.total_quantity_sold }]
      : []),
    ...(kpis?.sales_gross_profit !== undefined
      ? [
          {
            label: "إجمالي الربح",
            value: formatCurrency(kpis.sales_gross_profit),
          },
        ]
      : []),
    ...(sales.total_returns !== undefined
      ? [
          {
            label: "المرتجعات",
            value: `${sales.returns_count ?? 0} بكمية ${formatCurrency(
              sales.total_returns
            )}`,
          },
        ]
      : []),
  ];

  return (
    <section className="mb-8">
      <SectionTitle title="أداء المبيعات" icon={ShoppingCart} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {hasSummary && (
          <Card className="h-fit transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">ملخص المبيعات</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summaryRows.map((row) => (
                  <SummaryRow key={row.label} {...row} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {hasBestSelling && (
          <Card className="transition-all duration-200 hover:shadow-md lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">
                أفضل المنتجات مبيعاً
              </CardTitle>
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
                        <TableCell>
                          {formatCurrency(item.total_revenue || 0)}
                        </TableCell>
                        {item.gross_profit !== undefined && (
                          <TableCell>
                            {formatCurrency(item.gross_profit || 0)}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default SalesSection;
