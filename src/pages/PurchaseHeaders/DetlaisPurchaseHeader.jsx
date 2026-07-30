import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

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
import { useGetPurchaseHeadersById } from "@/hooks/Actions/PurchaseHeader/useCurdsPurchaseHeader";
import { useDeletePurchaseItems } from "@/hooks/Actions/PurchaseItem/useCurdsPurchaseItem";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import { ArrowRight, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrintInvoiceButton from "@/components/invoice/PrintInvoiceButton";

const statusConfig = {
  draft: { label: "مسودة", className: "bg-yellow-100 text-yellow-800" },
  completed: { label: "مكتملة", className: "bg-green-100 text-green-800" },
  cancelled: { label: "ملغية", className: "bg-red-100 text-red-800" },
};

const DetlaisPurchaseHeader = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending } = useGetPurchaseHeadersById(id);
  const { mutate: deleteItemMutate } = useDeletePurchaseItems(id);

  const confirmDeleteItem = (itemId) => {
    toast("هل أنت متأكد من حذف هذا الصنف؟", {
      action: {
        label: "نعم",
        onClick: () => deleteItemMutate({ id: itemId }),
      },
      duration: Infinity,
    });
  };

  if (isPending) return <Loading />;

  const purchaseHeader = data?.data?.data;
  if (!purchaseHeader) return null;

  const status = statusConfig[purchaseHeader.status] || statusConfig.draft;
  const isDraft = purchaseHeader.status === "draft";

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <AddEditHeader
          title={`فاتورة شراء رقم ${purchaseHeader.purchaseHeader_number}`}
          description={purchaseHeader.notes || "لا توجد ملاحظات"}
          backPath="/purchase-headers"
          backText="رجوع"
          showBack={false}
        />
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            onClick={() => navigate("/purchase-headers")}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            رجوع
          </Button>
          {!isDraft && <PrintInvoiceButton type="purchase" id={id} />}
        </div>
      </div>

      <div className=" p-6 mb-6 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">المورد</p>
            <p className="text-sm font-medium">
              {purchaseHeader.supplier?.name || "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">رقم فاتورة المورد</p>
            <p className="text-sm font-medium">
              {purchaseHeader.supplier_invoice_number || "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">الحالة</p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">المبلغ الإجمالي</p>
            <p className="text-sm font-medium">
              {formatCurrency(purchaseHeader.total_amount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">أنشئ بواسطة</p>
            <p className="text-sm font-medium">
              {purchaseHeader.created_by?.name || "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
            <p className="text-sm font-medium">
              {formatDateTime(purchaseHeader.created_at)}
            </p>
          </div>
          {purchaseHeader.completed_at && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">تاريخ الإتمام</p>
              <p className="text-sm font-medium">
                {formatDateTime(purchaseHeader.completed_at)}
              </p>
            </div>
          )}
          {purchaseHeader.cancelled_at && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">تاريخ الإلغاء</p>
              <p className="text-sm font-medium">
                {formatDateTime(purchaseHeader.cancelled_at)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mb-2">
        {isDraft && (
          <Button
            variant="default"
            size="sm"
            onClick={() =>
              navigate(`/purchase-item/add/${id}`)
            }
          >
            <Plus className="h-4 w-4" />
            إضافة بضاعة
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">المنتج</TableHead>
              <TableHead className="text-right">الكمية</TableHead>
              <TableHead className="text-right">سعر الوحدة</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseHeader.items?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.product?.name || "—"}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                <TableCell>{formatCurrency(item.total_price)}</TableCell>
               

                <TableCell>
                  {isDraft && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/purchase-item/update/${item.id}`)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!purchaseHeader.items || purchaseHeader.items.length === 0) && (
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

export default DetlaisPurchaseHeader;
