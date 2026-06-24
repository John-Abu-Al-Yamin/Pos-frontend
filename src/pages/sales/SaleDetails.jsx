import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Package, Hash, DollarSign, CalendarDays, User, CreditCard, FileText, Layers } from "lucide-react";

import { useGetSaleById } from "@/hooks/Actions/sales/useCurdsSales";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loading from "@/customs/Loading";
import InfoCard from "@/customs/InfoCard";
import AddEditHeader from "@/customs/AddEditHeader";
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
  cash: { label: "نقدي", color: "bg-green-50 text-green-700 border-green-200" },
  card: { label: "بطاقة", color: "bg-blue-50 text-blue-700 border-blue-200" },
  transfer: { label: "تحويل", color: "bg-purple-50 text-purple-700 border-purple-200" },
  installment: { label: "تقسيط", color: "bg-amber-50 text-amber-700 border-amber-200" },
};

const SaleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: res, isPending } = useGetSaleById(id);
  const sale = res?.data?.data ?? res?.data;

  if (isPending) return <Loading />;

  if (!sale) {
    return (
      <div className="mx-auto p-4">
        <div className="flex flex-col items-center gap-3 py-20">
          <p className="text-lg font-medium text-muted-foreground">البيع غير موجود</p>
          <Button onClick={() => navigate("/sales")} variant="outline">العودة للمبيعات</Button>
        </div>
      </div>
    );
  }

  const items = sale.sale_items ?? [];
  const paymentInfo = paymentLabels[sale.payment_method] ?? { label: sale.payment_method, color: "" };

  return (
    <div className="mx-auto p-4 space-y-6">
      <AddEditHeader
        title={`فاتورة بيع #${sale.id}`}
        description={`كود المرجع: ${sale.reference_code ?? "—"}`}
        backPath="/sales"
        backText="العودة للمبيعات"
      />

      {/* Info Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" dir="rtl">
        <InfoCard icon={Hash} label="رقم الفاتورة" value={`#${sale.id}`} accent />
        <InfoCard icon={FileText} label="كود المرجع" value={sale.reference_code ?? "—"} />
        <InfoCard icon={CalendarDays} label="التاريخ" value={sale.date} />
        <InfoCard icon={User} label="العميل" value={sale.customer?.name ?? "—"} />
        <InfoCard icon={DollarSign} label="الإجمالي" value={`${Number(sale.total).toLocaleString("ar-EG")} ج.م`} accent />
        <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="shrink-0 rounded-lg p-2 bg-neutral-100 text-neutral-500">
            <CreditCard className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1" dir="rtl">
            <p className="text-xs font-medium text-muted-foreground">طريقة الدفع</p>
            <div className="mt-1">
              <Badge variant="outline" className={paymentInfo.color}>
                {paymentInfo.label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border" dir="rtl">
          <Package className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">أصناف الفاتورة</h2>
        </div>

        <div dir="rtl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">#</TableHead>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">سعر الوحدة</TableHead>
                <TableHead className="text-right">الإجمالي</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium text-sm">
                        {item.product?.name ?? `منتج #${item.product_id}`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{Number(item.quantity).toLocaleString("ar-EG")}</TableCell>
                  <TableCell>{Number(item.unit_price).toLocaleString("ar-EG")}</TableCell>
                  <TableCell className="font-semibold">
                    {Number(item.line_total).toLocaleString("ar-EG")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-neutral-50" dir="rtl">
            <span className="text-sm font-semibold text-muted-foreground">الإجمالي الكلي</span>
            <span className="text-base font-bold text-foreground">
              {Number(sale.total).toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetails;
