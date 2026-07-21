import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import AddEditHeader from "@/customs/AddEditHeader";
import Loading from "@/customs/Loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useGetReturnableSaleById } from "@/hooks/Actions/SalesReturnable/useCurdsSalesReturnable";
import { useAddSalesReturnHeaders } from "@/hooks/Actions/SalesReturnHeader/useCurdsSalesReturnHeaders";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ReturnableInvoiceItems = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending } = useGetReturnableSaleById(id);
  const { mutate: addReturnMutate, isPending: isCreating } =
    useAddSalesReturnHeaders();

  const [selectedItems, setSelectedItems] = React.useState({});
  const [selectedQty, setSelectedQty] = React.useState({});

  if (isPending) return <Loading />;

  const invoice = data?.data?.data;
  if (!invoice) return null;

  const items = invoice.items || [];

  const isMobile = (item) => item.product?.type === "mobile";

  const handleToggle = (salesItemId) => {
    setSelectedItems((prev) => {
      const next = { ...prev, [salesItemId]: !prev[salesItemId] };
      if (next[salesItemId]) {
        const item = items.find((i) => i.sales_item_id === salesItemId);
        if (item && !isMobile(item)) {
          setSelectedQty((q) => ({
            ...q,
            [salesItemId]: item.returnable_qty,
          }));
        }
      }
      return next;
    });
  };

  const handleQtyChange = (salesItemId, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    setSelectedQty((prev) => ({ ...prev, [salesItemId]: num }));
  };

const totalSelectedRefund = React.useMemo(() => {
  return items.reduce((sum, item) => {
    const selected = selectedItems[item.sales_item_id];

    if (!selected) return sum;

    if (isMobile(item)) {
      return sum + Number(item.unit_price);
    }

    const qty = Number(selectedQty[item.sales_item_id] || 0);

    return sum + qty * Number(item.unit_price);
  }, 0);
}, [items, selectedItems, selectedQty]);
  const hasSelection = Object.values(selectedItems).some(Boolean);

  const buildItemsPayload = () => {
    const payload = [];
    items.forEach((item) => {
      if (!selectedItems[item.sales_item_id]) return;
      if (isMobile(item)) {
        payload.push({
          sales_item_id: item.sales_item_id,
          inventory_item_id: item.inventory_item?.id ?? null,
          quantity: 1,
          unit_refund_amount: item.unit_price,
        });
      } else {
        const qty = selectedQty[item.sales_item_id] || 0;
        if (qty <= 0) return;
        payload.push({
          sales_item_id: item.sales_item_id,
          inventory_item_id: null,
          quantity: qty,
          unit_refund_amount: item.unit_price,
        });
      }
    });
    return payload;
  };

  const handleCreateReturn = () => {
    const itemsPayload = buildItemsPayload();
    if (itemsPayload.length === 0) return;

    addReturnMutate(
      {
        data: {
          sales_header_id: Number(id),
          customer_id: invoice.customer?.id ?? null,
          return_date: new Date().toISOString().split("T")[0],
          items: itemsPayload,
        },
      },
      {
        onSuccess: (response) => {
          const returnId = response?.data?.data?.id;
          if (returnId) {
            navigate(`/sales-returns/details/${returnId}`);
          } else {
            navigate("/sales-returns");
          }
        },
      },
    );
  };

  const mobileItems = items.filter(isMobile);
  const accessoryItems = items.filter((item) => !isMobile(item));

  return (
    <div>
      <AddEditHeader
        title={`فاتورة ${invoice.invoice_number}`}
        description={`العميل: ${invoice.customer?.name || "—"}`}
        backPath="/sales-returnable"
        backText="رجوع"
      />

      <div className="p-6 mb-6 bg-white rounded-md border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">رقم الفاتورة</p>
            <p className="text-sm font-medium">{invoice.invoice_number}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">العميل</p>
            <p className="text-sm font-medium">
              {invoice.customer?.name || "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">تاريخ الفاتورة</p>
            <p className="text-sm font-medium">{invoice.invoice_date || "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">إجمالي الفاتورة</p>
            <p className="text-sm font-medium">
              {formatCurrency(invoice.total_amount)}
            </p>
          </div>
        </div>
      </div>

      {mobileItems.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-1">
            الأجهزة (جوالات)
          </h3>
          <div className="rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right w-12">اختيار</TableHead>
                  <TableHead className="text-right">المنتج</TableHead>
                  <TableHead className="text-right">الرقم التسلسلي</TableHead>
                  <TableHead className="text-right">سعر الوحدة</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mobileItems.map((item) => {
                  const isChecked =
                    selectedItems[item.sales_item_id] || false;
                  return (
                    <TableRow
                      key={item.sales_item_id}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isChecked ? "bg-blue-50" : "",
                      )}
                      onClick={() => handleToggle(item.sales_item_id)}
                    >
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-8 w-8 p-0",
                            isChecked
                              ? "bg-black text-white border-black"
                              : "",
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(item.sales_item_id);
                          }}
                        >
                          {isChecked && <Check className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.product?.name || "—"}
                      </TableCell>
                      <TableCell>
                        {item.inventory_item?.internal_serial || "—"}
                      </TableCell>
                      <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell className="font-medium">
                        {isChecked
                          ? formatCurrency(item.unit_price)
                          : formatCurrency(0)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {accessoryItems.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-1">
            الإكسسوارات وقطع الغيار
          </h3>
          <div className="rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right w-12">اختيار</TableHead>
                  <TableHead className="text-right">المنتج</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">الكمية المباعة</TableHead>
                  <TableHead className="text-right">المعاد إرجاعه</TableHead>
                  <TableHead className="text-right">القابل للإرجاع</TableHead>
                  <TableHead className="text-right">سعر الوحدة</TableHead>
                  <TableHead className="text-right">الكمية المرتجعة</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessoryItems.map((item) => {
                  const isChecked =
                    selectedItems[item.sales_item_id] || false;
                  const qty = selectedQty[item.sales_item_id] || 0;
                  return (
                    <TableRow
                      key={item.sales_item_id}
                      className={cn(
                        "transition-colors",
                        isChecked ? "bg-blue-50" : "",
                      )}
                    >
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-8 w-8 p-0",
                            isChecked
                              ? "bg-black text-white border-black"
                              : "",
                          )}
                          onClick={() => handleToggle(item.sales_item_id)}
                        >
                          {isChecked && <Check className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.product?.name || "—"}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {item.product?.type === "accessory"
                            ? "اكسسوار"
                            : "قطعة غيار"}
                        </span>
                      </TableCell>
                      <TableCell>{item.quantity_sold}</TableCell>
                      <TableCell>{item.already_returned_qty}</TableCell>
                      <TableCell className="font-medium">
                        {item.returnable_qty}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(item.unit_price)}
                      </TableCell>
                      <TableCell className="w-28">
                        <Input
                          type="number"
                          min="0"
                          max={item.returnable_qty}
                          value={qty}
                          disabled={!isChecked}
                          onChange={(e) =>
                            handleQtyChange(
                              item.sales_item_id,
                              e.target.value,
                            )
                          }
                          className={cn(
                            "w-20 text-center",
                            !isChecked && "opacity-40",
                          )}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {isChecked
                          ? formatCurrency(qty * item.unit_price)
                          : formatCurrency(0)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="rounded-md border bg-white">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="h-24 text-center text-muted-foreground">
                  لا توجد أصناف قابلة للإرجاع في هذه الفاتورة
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          <span>
            اختر الأصناف المراد إرجاعها، ثم حدد الكميات للمنتجات غير المسلسلة
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-left">
            <p className="text-xs text-muted-foreground">
              إجمالي المبلغ المسترد
            </p>
            <p className="text-lg font-bold text-destructive">
              {formatCurrency(totalSelectedRefund)}
            </p>
          </div>
          <Button
            onClick={handleCreateReturn}
            disabled={!hasSelection || isCreating}
            size="lg"
          >
            <ShoppingCart className="h-4 w-4" />
            {isCreating ? "جاري الإنشاء..." : "إنشاء مرتجع"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReturnableInvoiceItems;
