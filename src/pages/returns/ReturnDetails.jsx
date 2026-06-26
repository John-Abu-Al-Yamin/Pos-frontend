import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Printer, Package, Hash, DollarSign, CalendarDays, User, CreditCard, Undo2, FileText, AlertCircle } from "lucide-react";

import { useGetReturnById } from "@/hooks/Actions/returns/useCurdsReturns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loading from "@/customs/Loading";
import InfoCard from "@/customs/InfoCard";
import AddEditHeader from "@/customs/AddEditHeader";
import ReturnReceipt from "@/_components/pos/ReturnReceipt";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const refundMethodLabels = {
  cash: { label: "نقدي", color: "bg-green-50 text-green-700 border-green-200" },
  card: { label: "بطاقة", color: "bg-blue-50 text-blue-700 border-blue-200" },
  bank_transfer: { label: "تحويل بنكي", color: "bg-purple-50 text-purple-700 border-purple-200" },
};

const conditionLabels = {
  new: { label: "جديد", color: "bg-green-50 text-green-700" },
  excellent: { label: "ممتاز", color: "bg-blue-50 text-blue-700" },
  good: { label: "جيد", color: "bg-yellow-50 text-yellow-700" },
  fair: { label: "مقبول", color: "bg-orange-50 text-orange-700" },
  damaged: { label: "تالف", color: "bg-red-50 text-red-700" },
};

const ReturnDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: res, isPending } = useGetReturnById(id);
  const returnData = res?.data?.data ?? res?.data;

  if (isPending) return <Loading />;

  if (!returnData) {
    return (
      <div className="mx-auto p-4">
        <div className="flex flex-col items-center gap-3 py-20">
          <p className="text-lg font-medium text-muted-foreground">المرتجع غير موجود</p>
          <Button onClick={() => navigate("/returns")} variant="outline">العودة للمرتجعات</Button>
        </div>
      </div>
    );
  }

  const items = returnData.return_items ?? [];
  const refundInfo = refundMethodLabels[returnData.refund_method] ?? { label: returnData.refund_method, color: "" };

  const receiptData = {
    id: returnData.id,
    reference_code: returnData.reference_code,
    return_date: returnData.return_date,
    sale_reference: returnData.sale?.reference_code,
    customer_name: returnData.customer?.name || returnData.sale?.customer?.name || null,
    refund_method: returnData.refund_method,
    refund_total: Number(returnData.refund_total),
    restocking_fee: Number(returnData.restocking_fee),
    items: items.map((item) => ({
      product_name: item.product?.name ?? `منتج #${item.product_id}`,
      quantity: Number(item.quantity),
      refund_amount: Number(item.refund_amount),
      condition: item.condition_after_inspection,
      restock: item.restock,
    })),
  };

  const handlePrint = () => {
    const afterPrint = () => {
      window.removeEventListener("afterprint", afterPrint);
      clearTimeout(timer);
    };
    window.addEventListener("afterprint", afterPrint);
    const timer = setTimeout(afterPrint, 2000);
    window.print();
  };

  return (
    <div className="mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <AddEditHeader
          title={`مرتجع #${returnData.id}`}
          description={`كود المرجع: ${returnData.reference_code ?? "—"}`}
          backPath="/returns"
          backText="العودة للمرتجعات"
        />
        <div className="flex gap-2 shrink-0">
          <Button onClick={() => navigate(`/sales/${returnData.sale_id}`)} variant="outline" className="gap-2">
            <Undo2 className="h-4 w-4" />
            عرض الفاتورة
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            طباعة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" dir="rtl">
        <InfoCard icon={Hash} label="رقم المرتجع" value={`#${returnData.id}`} accent />
        <InfoCard icon={FileText} label="كود المرجع" value={returnData.reference_code ?? "—"} />
        <InfoCard icon={CalendarDays} label="تاريخ الإرجاع" value={returnData.return_date} />
        <InfoCard icon={User} label="العميل" value={returnData.customer?.name || returnData.sale?.customer?.name || "—"} />
        <InfoCard icon={DollarSign} label="المبلغ المسترد" value={`${Number(returnData.refund_total).toLocaleString("ar-EG")} ج.م`} accent />
        <InfoCard icon={Package} label="فاتورة البيع" value={returnData.sale?.reference_code ?? `#${returnData.sale_id}`} />
        <InfoCard icon={User} label="المستخدم" value={returnData.user?.name ?? "—"} />
        <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="shrink-0 rounded-lg p-2 bg-neutral-100 text-neutral-500">
            <CreditCard className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1" dir="rtl">
            <p className="text-xs font-medium text-muted-foreground">طريقة الاسترداد</p>
            <div className="mt-1">
              <Badge variant="outline" className={refundInfo.color}>
                {refundInfo.label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {returnData.reason && (
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm" dir="rtl">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">سبب الإرجاع</h3>
          </div>
          <p className="text-sm text-muted-foreground">{returnData.reason}</p>
        </div>
      )}

      {returnData.restocking_fee > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm" dir="rtl">
          <p className="text-sm font-medium text-amber-800">
            رسوم إعادة التخزين: {Number(returnData.restocking_fee).toLocaleString("ar-EG")} ج.م
          </p>
        </div>
      )}

      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border" dir="rtl">
          <Package className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">الأصناف المرتجعة</h2>
        </div>

        <div dir="rtl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">#</TableHead>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">المبلغ المسترد</TableHead>
                <TableHead className="text-right">الحالة بعد الفحص</TableHead>
                <TableHead className="text-right">إعادة تخزين</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                const condInfo = conditionLabels[item.condition_after_inspection];
                return (
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
                    <TableCell className="font-semibold">
                      {Number(item.refund_amount).toLocaleString("ar-EG")} ج.م
                    </TableCell>
                    <TableCell>
                      {condInfo ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${condInfo.color}`}>
                          {condInfo.label}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {item.restock ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">نعم</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">لا</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-neutral-50" dir="rtl">
            <span className="text-sm font-semibold text-muted-foreground">الإجمالي المسترد</span>
            <span className="text-base font-bold text-foreground">
              {Number(returnData.refund_total).toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        </div>
      </div>

      <div className="hidden print:block">
        <ReturnReceipt returnData={receiptData} />
      </div>
    </div>
  );
};

export default ReturnDetails;
