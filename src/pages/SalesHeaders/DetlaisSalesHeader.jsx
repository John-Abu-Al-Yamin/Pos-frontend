import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import AddEditHeader from "@/customs/AddEditHeader";
import Loading from "@/customs/Loading";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useGetSalesHeaderById } from "@/hooks/Actions/SalesHeaders/useCurdsSalesHeaders";
import { formatDateTime, formatCurrency } from "@/lib/utils";

const DetlaisSalesHeader = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending } = useGetSalesHeaderById(id);

  if (isPending) return <Loading />;

  const sale = data?.data?.data;
  if (!sale) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <AddEditHeader
          title={`فاتورة بيع رقم ${sale.invoice_number}`}
          description={sale.notes || "لا توجد ملاحظات"}
          backPath="/sales-headers"
          backText="رجوع"
        />
        <Button
          variant="default"
          size="sm"
          onClick={() =>
            navigate(`/sales-returnable/${sale.id}`)
          }
        >
          <RotateCcw className="h-4 w-4" />
          إنشاء مرتجع
        </Button>
      </div>

      <div className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">العميل</p>
            <p className="text-sm font-medium">{sale.customer?.name || "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">رقم الفاتورة</p>
            <p className="text-sm font-medium">{sale.invoice_number}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">المجموع الفرعي</p>
            <p className="text-sm font-medium">
              {formatCurrency(sale.subtotal)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">قيمة الخصم</p>
            <p className="text-sm font-medium">
              {formatCurrency(sale.discount_amount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">الإجمالي</p>
            <p className="text-sm font-medium">
              {formatCurrency(sale.total_amount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">أنشئ بواسطة</p>
            <p className="text-sm font-medium">
              {sale.created_by?.name || "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
            <p className="text-sm font-medium">
              {formatDateTime(sale.created_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">المنتج</TableHead>
              <TableHead className="text-right">الرقم التسلسلي</TableHead>
              <TableHead className="text-right">الكمية</TableHead>
              <TableHead className="text-right">سعر الوحدة</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sale.items?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.product?.name || "—"}</TableCell>
                <TableCell>
                  {item.inventory_item?.internal_serial || "—"}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                <TableCell>{formatCurrency(item.total_price)}</TableCell>
              </TableRow>
            ))}
            {(!sale.items || sale.items.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  لا توجد أصناف في هذه الفاتورة
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DetlaisSalesHeader;
