import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ShoppingCart, Smartphone, Hash } from "lucide-react";

import { useGetAllSales } from "@/hooks/Actions/sales/useCurdsSales";
import CustomHeader from "@/customs/CustomHeader";
import Loading from "@/customs/Loading";
import CustomPagination from "@/customs/CustomPagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const paymentLabels = {
  cash: "نقدي",
  card: "بطاقة",
  transfer: "تحويل",
  installment: "تقسيط",
};

const SalesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 10;

  const { data, isPending } = useGetAllSales(page, per_page);
  const sales = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  if (isPending) return <Loading />;

  return (
    <div>
      <CustomHeader
        title="المبيعات"
        description="قائمة فواتير المبيعات"
        buttonText="بيع جديد"
        onButtonClick={() => navigate("/pos")}
      />

      <div className="rounded-md border bg-white shadow-sm mt-4" dir="rtl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">كود المرجع</TableHead>
              <TableHead className="text-right">المنتجات</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
              <TableHead className="text-right">طريقة الدفع</TableHead>
              <TableHead className="text-right">الأجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.id}</TableCell>
                <TableCell className="text-xs">{sale.reference_code}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {(sale.sale_items ?? []).map((item) => (
                      <div key={item.id} className="flex items-center gap-1.5 text-xs">
                        <Smartphone className="h-3 w-3 shrink-0 text-primary" />
                        <span className="font-medium">{item.product?.name}</span>
                        {item.stock_items?.map((si) => (
                          <span key={si.id} className="text-muted-foreground" dir="ltr">
                            <Hash className="h-2.5 w-2.5 inline" />
                            {si.serial_number}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{sale.customer?.name ?? "—"}</TableCell>
                <TableCell className="text-xs">{sale.date}</TableCell>
                <TableCell className="font-semibold text-sm">
                  {Number(sale.total).toLocaleString("ar-EG")}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {paymentLabels[sale.payment_method] ?? sale.payment_method}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/sales/${sale.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <CustomPagination
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default SalesPage;
