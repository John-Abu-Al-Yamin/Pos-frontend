import React from "react";
import {
  Search,
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Smartphone,
  Headphones,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

import CustomHeader from "@/customs/CustomHeader";
import CustomPagination from "@/customs/CustomPagination";
import Loading from "@/customs/Loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useGetAllPosItems,
  usePosCheckout,
} from "@/hooks/Actions/Pos/useCurdsPos";
import { useGetAllCustomers } from "@/hooks/Actions/customers/useCurdsCustomers";
import useSearch from "@/hooks/useSearch/useSearch";
import { formatCurrency } from "@/lib/utils";

const productTypeTabs = [
  { value: "all", label: "الكل" },
  { value: "new_mobile", label: "موبايل جديد" },
  { value: "used_mobile", label: "موبايل مستعمل" },
  { value: "accessory", label: "اكسسوارات" },
];

const PosPage = () => {
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const [filterType, setFilterType] = React.useState("all");
  const { debouncedSearch, search, handelSearch, setSearch } = useSearch(
    "",
    400,
  );

  const { data, isPending } = useGetAllPosItems(debouncedSearch, filterType);
  const { data: customersData } = useGetAllCustomers(1, 200);
  const { mutate: checkoutMutate, isPending: checkoutPending } =
    usePosCheckout();

  const [cart, setCart] = React.useState([]);
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [customerId, setCustomerId] = React.useState("");
  const [discountAmount, setDiscountAmount] = React.useState("");

  const handleDiscountChange = (e) => {
    const val = e.target.value;
    if (val === "" || Number(val) >= 0) {
      setDiscountAmount(val);
    }
  };
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterType]);

  const clearFilters = () => {
    setSearch("");
    setFilterType("all");
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || filterType !== "all";

  const mobiles = data?.data?.data?.mobiles ?? [];
  const accessories = data?.data?.data?.accessories ?? [];

  const annotateItem = (item, type, category) => ({
    ...item,
    _type: type,
    _category: category,
  });
  const allItems = [
    ...mobiles.map((m) =>
      annotateItem(
        m,
        "mobile",
        m.battery_health != null ||
          m.screen_condition != null ||
          m.body_condition != null
          ? "used"
          : "new",
      ),
    ),
    ...accessories.map((a) => annotateItem(a, "accessory", "accessory")),
  ];
  const totalPages = Math.ceil(allItems.length / per_page);
  const paginatedItems = allItems.slice((page - 1) * per_page, page * per_page);

  const customers = customersData?.data?.data ?? [];

  const addToCart = (item) => {
    setSelectedItemId(item.id);
    const existingIndex = cart.findIndex((c) => {
      if (item._type === "mobile") return c.inventory_item_id === item.id;
      return c.product_id === item.product_id;
    });

    const defaultPrice = item.cost_price ? Number(item.cost_price) : 0;

    if (existingIndex >= 0 && item._type === "accessory") {
      setCart((prev) => {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
          total_price:
            (updated[existingIndex].quantity + 1) *
            updated[existingIndex].unit_price,
        };
        return updated;
      });
    } else if (existingIndex >= 0) {
      toast("الجهاز مضاف بالفعل إلى السلة");
    } else {
      if (item._type === "mobile") {
        setCart((prev) => [
          ...prev,
          {
            inventory_item_id: item.id,
            product_id: item.product_id,
            product_name: item.product?.name,
            serial: item.internal_serial,
            unit_price: defaultPrice,
            quantity: 1,
            total_price: defaultPrice,
            _type: "mobile",
          },
        ]);
      } else {
        setCart((prev) => [
          ...prev,
          {
            product_id: item.product_id,
            product_name: item.product?.name,
            quantity: 1,
            unit_price: defaultPrice,
            total_price: defaultPrice,
            available_qty: item.quantity,
            _type: "accessory",
          },
        ]);
      }
    }
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCartPrice = (index, newPrice) => {
    setCart((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        unit_price: Number(newPrice),
        total_price: Number(newPrice) * updated[index].quantity,
      };
      return updated;
    });
  };

  const updateCartQuantity = (index, newQty) => {
    const item = cart[index];
    if (item._type === "accessory" && newQty > item.available_qty) {
      toast("الكمية المتاحة غير كافية");
      return;
    }
    if (newQty < 1) return;
    setCart((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: newQty,
        total_price: newQty * updated[index].unit_price,
      };
      return updated;
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0);
  const discount = Number(discountAmount) || 0;
  const total = Math.max(0, subtotal - discount);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast("السلة فارغة");
      return;
    }

    const items = cart.map((item) => {
      if (item._type === "mobile") {
        return {
          inventory_item_id: item.inventory_item_id,
          unit_price: item.unit_price,
        };
      }
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      };
    });

    checkoutMutate(
      {
        data: {
          customer_id: customerId ? Number(customerId) : null,
          discount_amount: discount,
          notes: notes || null,
          items,
        },
      },
      {
        onSuccess: () => {
          setCart([]);
          setCustomerId("");
          setDiscountAmount("");
          setNotes("");
          setSelectedItemId(null);
        },
      },
    );
  };

  const getItemDisplayPrice = (item) => {
    if (item._type === "mobile") return Number(item.cost_price) || 0;
    return 0;
  };

  

  const isInCart = (item) => {
    return cart.some((c) => {
      if (item._type === "mobile") return c.inventory_item_id === item.id;
      return c.product_id === item.product_id;
    });
  };

  if (isPending) return <Loading />;

  return (
    <div>
      <CustomHeader title="نقطة البيع" description="إدارة عمليات البيع" />

      {/* searh and filter */}
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="relative w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث باسم المنتج..."
            value={search}
            onChange={handelSearch}
            className="pr-9"
          />
        </div>

        <div className="w-44">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="نوع المنتج" />
            </SelectTrigger>
            <SelectContent>
              {productTypeTabs.map((tab) => (
                <SelectItem key={tab.value} value={tab.value}>
                  {tab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={clearFilters}
            title="مسح الفلترة"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          {paginatedItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد منتجات متاحة
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedItems.map((item) => {
                const isSelected = selectedItemId === item.id;
                const alreadyInCart = isInCart(item);
                return (
                  <Card
                    key={`${item._type}-${item.id}`}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "ring-2 ring-primary shadow-lg"
                        : "hover:shadow-md"
                    } ${alreadyInCart ? "border-primary/50 bg-primary/5" : ""}`}
                    onClick={() => setSelectedItemId(item.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item._type === "mobile" ? (
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Headphones className="h-4 w-4 text-muted-foreground" />
                          )}
                          <CardTitle className="text-sm font-medium">
                            {item.product?.name || "منتج"}
                          </CardTitle>
                        </div>
                        <Badge
                          variant={
                            item._category === "used" ? "secondary" : "outline"
                          }
                        >
                          {item._category === "new"
                            ? "جديد"
                            : item._category === "used"
                              ? "مستعمل"
                              : "اكسسوار"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {item._type === "mobile" && (
                          <>
                            <p className="text-xs">
                              الرقم التسلسلي: {item.internal_serial}
                            </p>
                            {item.battery_health != null && (
                              <p className="text-xs">
                                البطارية: {item.battery_health}%
                              </p>
                            )}
                          </>
                        )}
                        {item._type === "accessory" && (
                          <p className="text-xs">
                            الكمية المتاحة: {item.quantity}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-foreground mt-2">
                          {formatCurrency(getItemDisplayPrice(item))}
                        </p>
                      </div>

                      <Button
                        variant={alreadyInCart ? "secondary" : "default"}
                        size="sm"
                        className="mt-3 w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 ml-1" />
                        {alreadyInCart ? "أضيف إلى السلة" : "إضافة إلى السلة"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <CustomPagination
            pagination={{
              current_page: page,
              last_page: totalPages || 1,
              total: allItems.length,
              from: (page - 1) * per_page + 1,
              to: Math.min(page * per_page, allItems.length),
              per_page,
            }}
            onPageChange={(p) => setPage(p)}
          />
        </div>

        {/* سلة المشتريات */}
        <div className="w-96 shrink-0">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">سلة المشتريات</CardTitle>
                <Badge variant="secondary">{cart.length} صنف</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  السلة فارغة
                </p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 border rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.product_name}
                          </p>
                          {item.serial && (
                            <p className="text-xs text-muted-foreground">
                              {item.serial}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => removeFromCart(index)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label className="text-xs w-16">السعر</Label>
                        <Input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) =>
                            updateCartPrice(index, Number(e.target.value))
                          }
                          className="h-7 text-xs"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      {item._type === "accessory" && (
                        <div className="flex items-center gap-2">
                          <Label className="text-xs w-16">الكمية</Label>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateCartQuantity(index, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateCartQuantity(index, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-left font-medium">
                        المجموع: {formatCurrency(item.total_price)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-4 mt-4 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">العميل (اختياري)</Label>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="اختر العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name} {c.phone ? `- ${c.phone}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">قيمة الخصم</Label>
                  <Input
                    type="number"
                    value={discountAmount}
                    onChange={handleDiscountChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">ملاحظات (اختياري)</Label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ملاحظات..."
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>المجموع الفرعي</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الخصم</span>
                  <span>{formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span>الإجمالي</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-4 gap-2"
                size="lg"
                disabled={cart.length === 0 || checkoutPending}
                onClick={handleCheckout}
              >
                <CreditCard className="h-4 w-4" />
                {checkoutPending ? "جاري المعالجة..." : "إتمام البيع"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PosPage;
