import React from "react";
import { useParams } from "react-router-dom";

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
import { useGetPurchaseReturnHeaderById } from "@/hooks/Actions/PurchaseReturnHeader/useCurdsPurchaseReturnHeaders";
import { formatDateTime, formatCurrency } from "@/lib/utils";

const DetlaisPurchaseReturnHeader = () => {
  const { id } = useParams();

  const { data, isPending } = useGetPurchaseReturnHeaderById(id);

  if (isPending) return <Loading />;

  const returnHeader = data?.data?.data;
  if (!returnHeader) return null;

  return (
    <div>
      <AddEditHeader
        title={`مرتجع شراء رقم ${returnHeader.return_number}`}
        description={returnHeader.reason || "لا توجد ملاحظات"}
        backPath="/purchase-returns"
        backText="رجوع"
      />

      <div className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">رقم المرتجع</p>
            <p className="text-sm font-medium">{returnHeader.return_number}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">فاتورة الشراء</p>
            <p className="text-sm font-medium">
              {returnHeader.purchaseHeader?.purchaseHeader_number || returnHeader.purchase_header?.purchaseHeader_number || "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">المورد</p>
            <p className="text-sm font-medium">
              {returnHeader.supplier?.name || "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">المبلغ المسترد</p>
            <p className="text-sm font-medium">
              {formatCurrency(returnHeader.total_refund_amount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">تاريخ الإرجاع</p>
            <p className="text-sm font-medium">
              {returnHeader.return_date ? formatDateTime(returnHeader.return_date) : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">أنشئ بواسطة</p>
            <p className="text-sm font-medium">
              {returnHeader.user?.name || "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
            <p className="text-sm font-medium">
              {formatDateTime(returnHeader.created_at)}
            </p>
          </div>
          {returnHeader.reason && (
            <div className="space-y-1 md:col-span-2">
              <p className="text-xs text-muted-foreground">سبب الإرجاع</p>
              <p className="text-sm font-medium">{returnHeader.reason}</p>
            </div>
          )}
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
              <TableHead className="text-right">مبلغ الوحدة</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returnHeader.items?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.product?.name || "—"}</TableCell>
                <TableCell>
                  {item.inventory_item?.internal_serial || "—"}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.unit_refund_amount)}</TableCell>
                <TableCell>{formatCurrency(item.total_refund)}</TableCell>
              </TableRow>
            ))}
            {(!returnHeader.items || returnHeader.items.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  لا توجد أصناف في هذا المرتجع
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DetlaisPurchaseReturnHeader;
