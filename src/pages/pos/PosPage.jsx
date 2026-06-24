import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Loader2,
  Package,
  User,
  CreditCard,
  Check,
  X,
  DollarSign,
} from "lucide-react";

import {
  useGetAvailableStock,
  useAddSale,
} from "@/hooks/Actions/sales/useCurdsSales";
import { useGetAllCustomers } from "@/hooks/Actions/customers/useCurdsCustomers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import Loading from "@/customs/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const paymentMethods = [
  { value: "cash", label: "نقدي" },
  { value: "card", label: "بطاقة" },
  { value: "transfer", label: "تحويل" },
  { value: "installment", label: "تقسيط" },
];

const conditionMeta = {
  new: { label: "جديد", bg: "bg-blue-50 text-blue-700 border-blue-200" },
  excellent: {
    label: "ممتاز",
    bg: "bg-green-50 text-green-700 border-green-200",
  },
  good: {
    label: "جيد",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  fair: { label: "مقبول", bg: "bg-amber-50 text-amber-700 border-amber-200" },
};

const PosPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [cart, setCart] = React.useState([]);
  const [customerId, setCustomerId] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const [customerDialogOpen, setCustomerDialogOpen] = React.useState(false);
  const [payDialogOpen, setPayDialogOpen] = React.useState(false);

  const { data: stockRes, isPending: stockPending } = useGetAvailableStock({
    search,
    per_page: 200,
  });
  const stockItems = stockRes?.data?.data ?? [];

  const { data: customersRes } = useGetAllCustomers(1, 1000);
  const customers = customersRes?.data?.data ?? [];

  const { mutate: addSale, isPending: salePending } = useAddSale();

  // Per-product add quantity/price state
  const [addForm, setAddForm] = React.useState({});

  const groupedStock = React.useMemo(() => {
    const map = {};
    stockItems.forEach((item) => {
      const pid = item.product_id;
      if (!map[pid]) {
        map[pid] = { product: item.product, items: [] };
      }
      map[pid].items.push(item);
    });
    return Object.values(map);
  }, [stockItems]);

  const initForm = (productId, isSerialized, defaultPrice) => {
    setAddForm((prev) => {
      if (prev[productId]) return prev;
      return {
        ...prev,
        [productId]: {
          quantity: 1,
          unit_price: defaultPrice,
        },
      };
    });
  };

  const setFormValue = (productId, field, value) => {
    setAddForm((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const addNonSerialized = (group, price) => {
    const pid = group.product.id;
    const form = addForm[pid] || { quantity: 1, unit_price: price };
    const qty = parseInt(form.quantity, 10) || 1;
    const unitPrice = parseFloat(form.unit_price) || 0;

    if (qty < 1) {
      toast.error("الكمية يجب أن تكون 1 على الأقل");
      return;
    }
    if (unitPrice <= 0) {
      toast.error("يرجى إدخال سعر البيع");
      return;
    }

    setCart((prev) => {
      const existing = prev.find(
        (c) => !c.is_serialized && c.product_id === pid,
      );
      if (existing) {
        return prev.map((c) =>
          c.product_id === pid
            ? { ...c, quantity: c.quantity + qty, unit_price: unitPrice }
            : c,
        );
      }
      return [
        ...prev,
        {
          product_id: pid,
          product_name: group.product.name,
          is_serialized: false,
          stock_item_ids: [],
          quantity: qty,
          unit_price: unitPrice,
        },
      ];
    });
  };

  const addSerialized = (stockItem) => {
    const pid = stockItem.product_id;
    const form = addForm[`${pid}_${stockItem.id}`] || {
      unit_price: Number(stockItem.cost_price) || 0,
    };
    const unitPrice = parseFloat(form.unit_price) || 0;

    if (unitPrice <= 0) {
      toast.error("يرجى إدخال سعر البيع");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((c) => c.stock_item_ids?.[0] === stockItem.id);
      if (existing) {
        toast.error("هذا الهاتف مضاف بالفعل");
        return prev;
      }
      return [
        ...prev,
        {
          product_id: pid,
          product_name: stockItem.product?.name,
          is_serialized: true,
          stock_item_ids: [stockItem.id],
          serial_number: stockItem.serial_number,
          condition: stockItem.condition,
          quantity: 1,
          unit_price: unitPrice,
        },
      ];
    });
  };

  const updateQty = (index, delta) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const updateCartPrice = (index, price) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, unit_price: parseFloat(price) || 0 } : item,
      ),
    );
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const isSerializedInCart = (stockItemId) =>
    cart.some((c) => c.stock_item_ids?.[0] === stockItemId);

  const isNonSerializedInCart = (productId) =>
    cart.some((c) => !c.is_serialized && c.product_id === productId);

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0,
  );

  const handleCompleteSale = () => {
    const payload = {
      customer_id: customerId || null,
      payment_method: paymentMethod,
      items: cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        stock_item_ids: item.stock_item_ids,
      })),
    };

    addSale(
      { data: payload },
      {
        onSuccess: (res) => {
          const saleId = res?.data?.data?.id;
          toast.success("تم إتمام البيع بنجاح");
          setCart([]);
          setAddForm({});
          setCustomerId("");
          setPaymentMethod("cash");
          setPayDialogOpen(false);
          if (saleId) navigate(`/sales/${saleId}`);
        },
        onError: () => {
          toast.error("فشل في إتمام البيع");
        },
      },
    );
  };

  const selectedCustomer = customers.find(
    (c) => String(c.id) === String(customerId),
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6rem)]">
      {/* ─── Products Panel ─── */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن منتج أو IMEI..."
              className="pr-10 text-right"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {stockPending ? (
            <Loading />
          ) : groupedStock.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              لا توجد منتجات متاحة
            </p>
          ) : (
            groupedStock.map((group) => {
              const defaultPrice =
                group.items.length > 0
                  ? Number(group.items[0].cost_price) || 0
                  : 0;

              return (
                <div key={group.product?.id} className="space-y-2">
                  {/* Product Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">
                      {group.product?.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {group.items.length} متاح
                    </Badge>
                  </div>

                  {group.product?.is_serialized ? (
                    /* ── Serialized: show individual units ── */
                    <div className="space-y-1.5">
                      {group.items.map((item) => {
                        const formKey = `${item.product_id}_${item.id}`;
                        const cond = conditionMeta[item.condition];
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 py-1.5 px-3 rounded-lg border hover:bg-neutral-50 transition-colors"
                          >
                            <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span
                              className="text-xs font-mono flex-1 min-w-0"
                              dir="ltr"
                            >
                              {item.serial_number}
                            </span>
                            {cond && (
                              <Badge
                                variant="outline"
                                className={`text-[10px] h-5 ${cond.bg}`}
                              >
                                {cond.label}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                سعر
                              </span>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="h-7 w-20 text-xs text-left"
                                dir="ltr"
                                placeholder="السعر"
                                defaultValue={
                                  addForm[formKey]?.unit_price ??
                                  (Number(item.cost_price) || 0)
                                }
                                onFocus={() =>
                                  initForm(
                                    formKey,
                                    true,
                                    Number(item.cost_price) || 0,
                                  )
                                }
                                onChange={(e) =>
                                  setFormValue(
                                    formKey,
                                    "unit_price",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            {isSerializedInCart(item.id) ? (
                              <Button
                                size="icon-sm"
                                variant="outline"
                                className="h-7 w-7 shrink-0 border-green-500 text-green-600 bg-green-50"
                                disabled
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <Button
                                size="icon-sm"
                                variant="default"
                                className="h-7 w-7 shrink-0"
                                onClick={() => addSerialized(item)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* ── Non-serialized: quantity + price + add ── */
                    <div className="flex items-center gap-3 py-2 px-3 rounded-lg border">
                      <span className="text-xs text-muted-foreground">
                        {group.items.length} متاحة
                      </span>
                      <div className="flex items-center gap-1 mr-auto">
                        <Label className="text-xs text-muted-foreground">
                          الكمية
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          className="h-7 w-16 text-xs text-center"
                          placeholder="1"
                          defaultValue={
                            addForm[group.product.id]?.quantity ?? 1
                          }
                          onFocus={() =>
                            initForm(group.product.id, false, defaultPrice)
                          }
                          onChange={(e) =>
                            setFormValue(
                              group.product.id,
                              "quantity",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Label className="text-xs text-muted-foreground">
                          سعر الوحدة
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="h-7 w-20 text-xs text-left"
                          dir="ltr"
                          placeholder="السعر"
                          defaultValue={
                            addForm[group.product.id]?.unit_price ??
                            defaultPrice
                          }
                          onFocus={() =>
                            initForm(group.product.id, false, defaultPrice)
                          }
                          onChange={(e) =>
                            setFormValue(
                              group.product.id,
                              "unit_price",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      {isNonSerializedInCart(group.product.id) ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 gap-1 shrink-0 border-green-500 text-green-600 bg-green-50"
                        >
                          <Check className="h-3.5 w-3.5" />
                          مضاف
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 gap-1 shrink-0"
                          onClick={() => addNonSerialized(group, defaultPrice)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          أضف
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── Cart Panel ─── */}
      <div className="w-full lg:w-md flex flex-col bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-neutral-50 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">فاتورة البيع</h2>
          <Badge variant="secondary" className="mr-auto">
            {cart.length} صنف
          </Badge>
        </div>

        {/* Customer Selector */}
        <div className="px-4 py-3 border-b">
          <button
            onClick={() => setCustomerDialogOpen(true)}
            className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="h-4 w-4" />
            {selectedCustomer ? selectedCustomer.name : "اختيار عميل (اختياري)"}
            {selectedCustomer && (
              <X
                className="h-3.5 w-3.5 mr-auto text-muted-foreground cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setCustomerId("");
                }}
              />
            )}
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">
              الفاتورة فارغة
              <br />
              أضف منتجات من القائمة
            </p>
          ) : (
            cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 rounded-lg border"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium truncate">
                    {item.product_name}
                  </p>
                  {item.serial_number && (
                    <p
                      className="text-xs text-muted-foreground font-mono"
                      dir="ltr"
                    >
                      {item.serial_number}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {/* Price input */}
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="h-7 w-20 text-xs text-left"
                        dir="ltr"
                        value={item.unit_price}
                        onChange={(e) => updateCartPrice(index, e.target.value)}
                      />
                    </div>

                    {/* Qty controls (non-serialized only) */}
                    {!item.is_serialized && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => updateQty(index, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-semibold w-5 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => updateQty(index, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {item.is_serialized && (
                      <span className="text-xs text-muted-foreground">x1</span>
                    )}
                  </div>
                </div>

                {/* Line total */}
                <div className="text-left shrink-0">
                  <p className="text-sm font-bold">
                    {(item.quantity * item.unit_price).toLocaleString("ar-EG")}
                  </p>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="h-6 w-6 text-destructive"
                    onClick={() => removeFromCart(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              الإجمالي
            </span>
            <span className="text-lg font-bold text-foreground">
              {total.toLocaleString("ar-EG")} ج.م
            </span>
          </div>

          <Button
            className="w-full gap-2"
            size="lg"
            disabled={cart.length === 0}
            onClick={() => setPayDialogOpen(true)}
          >
            <CreditCard className="h-5 w-5" />
            إتمام البيع
          </Button>
        </div>
      </div>

      {/* ─── Customer Dialog ─── */}
      <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>اختيار عميل</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {customers.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCustomerId(String(c.id));
                  setCustomerDialogOpen(false);
                }}
                className={`w-full text-right px-3 py-2 rounded-lg border transition-colors ${
                  String(c.id) === customerId
                    ? "border-primary bg-primary/5"
                    : "hover:bg-neutral-50"
                }`}
              >
                <p className="text-sm font-medium">{c.name}</p>
                {c.phone && (
                  <p className="text-xs text-muted-foreground">{c.phone}</p>
                )}
              </button>
            ))}
            <button
              onClick={() => {
                setCustomerId("");
                setCustomerDialogOpen(false);
              }}
              className="w-full text-center text-sm text-muted-foreground py-2 hover:text-foreground"
            >
              بدون عميل
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Payment Dialog ─── */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>إتمام البيع</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>طريقة الدفع</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((pm) => (
                    <SelectItem key={pm.value} value={pm.value}>
                      {pm.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-neutral-50 p-4 space-y-2">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="truncate ml-2">{item.product_name}</span>
                  <span className="font-semibold shrink-0">
                    {(item.quantity * item.unit_price).toLocaleString("ar-EG")}{" "}
                    ج.م
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between text-sm font-bold">
                <span>الإجمالي</span>
                <span>{total.toLocaleString("ar-EG")} ج.م</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPayDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleCompleteSale}
              disabled={salePending}
              className="gap-2"
            >
              {salePending && <Loader2 className="h-4 w-4 animate-spin" />}
              <Check className="h-4 w-4" />
              تأكيد البيع
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PosPage;
