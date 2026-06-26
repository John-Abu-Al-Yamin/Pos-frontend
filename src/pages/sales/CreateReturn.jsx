import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Package, DollarSign, Undo2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useGetSaleReturnable, useAddReturn } from "@/hooks/Actions/returns/useCurdsReturns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loading from "@/customs/Loading";
import AddEditHeader from "@/customs/AddEditHeader";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const conditionOptions = [
  { value: "new", label: "جديد" },
  { value: "excellent", label: "ممتاز" },
  { value: "good", label: "جيد" },
  { value: "fair", label: "مقبول" },
  { value: "damaged", label: "تالف" },
];

const refundMethodOptions = [
  { value: "cash", label: "نقدي" },
  { value: "card", label: "بطاقة" },
  { value: "bank_transfer", label: "تحويل بنكي" },
];

const CreateReturn = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: res, isPending } = useGetSaleReturnable(id);
  const sale = res?.data?.data ?? res?.data;
  const { mutate: createReturn, isPending: isSubmitting } = useAddReturn();

  const [items, setItems] = React.useState([]);
  const [refundMethod, setRefundMethod] = React.useState("cash");
  const [restockingFee, setRestockingFee] = React.useState(0);
  const [reason, setReason] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (sale?.sale_items) {
      setItems(
        sale.sale_items
          .filter((item) => item.returnable_quantity > 0)
          .map((item) => ({
            sale_item_id: item.id,
            product_id: item.product_id,
            product_name: item.product?.name ?? `منتج #${item.product_id}`,
            is_serialized: item.product?.is_serialized ?? true,
            quantity: item.returnable_quantity,
            max_returnable: item.max_returnable,
            unit_price: Number(item.unit_price),
            stock_items: item.returnable_stock_items ?? [],
            selected: false,
            return_qty: Math.min(1, item.returnable_quantity),
            refund_amount: Number(item.unit_price) * Math.min(1, item.returnable_quantity),
            condition_after_inspection: "",
            restock: true,
            stock_item_id: item.returnable_stock_items?.[0]?.id ?? null,
            reason: "",
          }))
      );
    }
  }, [sale]);

  if (isPending) return <Loading />;

  if (!sale) {
    return (
      <div className="mx-auto p-4">
        <div className="flex flex-col items-center gap-3 py-20">
          <p className="text-lg font-medium text-muted-foreground">الفاتورة غير موجودة</p>
          <Button onClick={() => navigate("/sales")} variant="outline">العودة للمبيعات</Button>
        </div>
      </div>
    );
  }

  const hasReturnableItems = items.some((item) => item.max_returnable > 0);

  if (!hasReturnableItems) {
    return (
      <div className="mx-auto p-4 space-y-4">
        <AddEditHeader
          title="إنشاء مرتجع"
          description={`فاتورة: ${sale.reference_code ?? `#${sale.id}`}`}
          backPath={`/sales/${id}`}
          backText="العودة للفاتورة"
        />
        <div className="flex flex-col items-center gap-3 py-20">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">لا توجد أصناف قابلة للإرجاع في هذه الفاتورة</p>
          <Button onClick={() => navigate(`/sales/${id}`)} variant="outline">العودة للفاتورة</Button>
        </div>
      </div>
    );
  }

  const toggleItem = (index) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updateItem = (index, updates) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, ...updates };
        if (updates.return_qty !== undefined || updates.unit_price) {
          const qty = updated.return_qty || 0;
          updated.refund_amount = qty * Number(updated.unit_price);
        }
        return updated;
      })
    );
  };

  const selectedItems = items.filter((item) => item.selected);
  const totalRefund = selectedItems.reduce((sum, item) => sum + Number(item.refund_amount), 0);
  const finalTotal = Math.max(0, totalRefund - Number(restockingFee));

  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      toast.error("يجب اختيار صنف واحد على الأقل للإرجاع");
      return;
    }

    if (!refundMethod) {
      toast.error("يجب اختيار طريقة الاسترداد");
      return;
    }

    const payload = {
      sale_id: Number(id),
      refund_method: refundMethod,
      restocking_fee: Number(restockingFee) || 0,
      reason: reason || null,
      notes: notes || null,
      items: selectedItems.map((item) => ({
        sale_item_id: item.sale_item_id,
        stock_item_id: item.is_serialized ? item.stock_item_id : null,
        quantity: item.is_serialized ? 1 : Number(item.return_qty),
        refund_amount: Number(item.refund_amount),
        condition_after_inspection: item.condition_after_inspection || null,
        restock: item.restock,
        reason: item.reason || null,
        notes: null,
      })),
    };

    createReturn({
      data: payload,
      onSuccess: (response) => {
        const returnId = response?.data?.data?.id;
        // toast.success("تم إنشاء المرتجع بنجاح");
        if (returnId) {
          navigate(`/returns/${returnId}`);
        } else {
          navigate("/returns");
        }
      },
      onError: (error) => {
        const messages = error?.response?.data?.errors;
        if (messages && Array.isArray(messages)) {
          messages.forEach((m) => toast.error(m.message));
        } else {
          toast.error(error?.response?.data?.message || "حدث خطأ أثناء إنشاء المرتجع");
        }
      },
    });
  };

  return (
    <div className="mx-auto p-4 space-y-6">
      <AddEditHeader
        title="إنشاء مرتجع"
        description={`فاتورة: ${sale.reference_code ?? `#${sale.id}`} — العميل: ${sale.customer?.name ?? "—"}`}
        backPath={`/sales/${id}`}
        backText="العودة للفاتورة"
      />

      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border" dir="rtl">
          <Package className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">الأصناف القابلة للإرجاع</h2>
        </div>

        <div dir="rtl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right w-12">اختيار</TableHead>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-center">المباع</TableHead>
                <TableHead className="text-center">المتبقي</TableHead>
                <TableHead className="text-center">الكمية</TableHead>
                <TableHead className="text-center">المبلغ المسترد</TableHead>
                <TableHead className="text-center">الحالة بعد الفحص</TableHead>
                <TableHead className="text-center">إعادة تخزين</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow
                  key={item.sale_item_id}
                  className={item.selected ? "bg-primary/5" : ""}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleItem(index)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-sm">{item.product_name}</span>
                    {item.is_serialized && item.stock_item_id && (
                      <Badge variant="outline" className="mr-2 text-xs">
                        #{item.stock_item_id}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.is_serialized ? 1 : item.stock_items.length}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.max_returnable}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.is_serialized ? (
                      <span>1</span>
                    ) : (
                      <Input
                        type="number"
                        min={0}
                        max={item.max_returnable}
                        value={item.return_qty}
                        disabled={!item.selected}
                        onChange={(e) =>
                          updateItem(index, {
                            return_qty: Math.min(
                              Math.max(0, Number(e.target.value)),
                              item.max_returnable
                            ),
                          })
                        }
                        className="w-20 h-8 text-center mx-auto"
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.refund_amount}
                      disabled={!item.selected}
                      onChange={(e) =>
                        updateItem(index, { refund_amount: Number(e.target.value) })
                      }
                      className="w-24 h-8 text-center mx-auto"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <select
                      value={item.condition_after_inspection}
                      disabled={!item.selected}
                      onChange={(e) =>
                        updateItem(index, { condition_after_inspection: e.target.value })
                      }
                      className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
                    >
                      <option value="">—</option>
                      {conditionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={item.restock}
                      disabled={!item.selected}
                      onChange={(e) =>
                        updateItem(index, { restock: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div dir="rtl" className="space-y-2">
            <Label>طريقة الاسترداد</Label>
            <select
              value={refundMethod}
              onChange={(e) => setRefundMethod(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {refundMethodOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div dir="rtl" className="space-y-2">
            <Label>رسوم إعادة التخزين (اختياري)</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={restockingFee}
              onChange={(e) => setRestockingFee(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>

          <div dir="rtl" className="space-y-2">
            <Label>سبب الإرجاع (اختياري)</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="أدخل سبب الإرجاع..."
              rows={3}
            />
          </div>

          <div dir="rtl" className="space-y-2">
            <Label>ملاحظات (اختياري)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ملاحظات إضافية..."
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm" dir="rtl">
            <h3 className="text-lg font-bold mb-4">ملخص المرتجع</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">عدد الأصناف:</span>
                <span className="font-medium">{selectedItems.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">إجمالي المبلغ المسترد:</span>
                <span className="font-medium">
                  {totalRefund.toLocaleString("ar-EG")} ج.م
                </span>
              </div>
              {restockingFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">رسوم إعادة التخزين:</span>
                  <span className="font-medium text-red-600">
                    -{Number(restockingFee).toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-base font-bold">
                <span>الصافي المسترد:</span>
                <span className="text-primary">
                  {finalTotal.toLocaleString("ar-EG")} ج.م
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedItems.length === 0}
            className="w-full gap-2"
            size="lg"
          >
            <Undo2 className="h-5 w-5" />
            {isSubmitting ? "جاري الإنشاء..." : "تأكيد المرتجع"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateReturn;
