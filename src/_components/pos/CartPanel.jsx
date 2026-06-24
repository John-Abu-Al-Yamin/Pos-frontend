import React from "react";
import {
  ShoppingCart,
  User,
  X,
  DollarSign,
  Minus,
  Plus,
  Trash2,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CartPanel = ({
  cart,
  selectedCustomer,
  onOpenCustomerDialog,
  onClearCustomer,
  onUpdateQty,
  onUpdateCartPrice,
  onRemoveFromCart,
  total,
  onOpenPayDialog,
}) => {
  return (
    <div className="w-full lg:w-md flex flex-col bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-neutral-50 flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-primary" />
        <h2 className="text-base font-bold text-foreground">فاتورة البيع</h2>
        <Badge variant="secondary" className="mr-auto">
          {cart.length} صنف
        </Badge>
      </div>

      <div className="px-4 py-3 border-b">
        <button
          onClick={onOpenCustomerDialog}
          className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <User className="h-4 w-4" />
          {selectedCustomer ? selectedCustomer.name : "اختيار عميل (اختياري)"}
          {selectedCustomer && (
            <X
              className="h-3.5 w-3.5 mr-auto text-muted-foreground cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onClearCustomer();
              }}
            />
          )}
        </button>
      </div>

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
                  <p className="text-xs text-muted-foreground font-mono" dir="ltr">
                    {item.serial_number}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="h-7 w-20 text-xs text-left"
                      dir="ltr"
                      value={item.unit_price}
                      onChange={(e) => onUpdateCartPrice(index, e.target.value)}
                    />
                  </div>

                  {!item.is_serialized && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => onUpdateQty(index, -1)}
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
                        onClick={() => onUpdateQty(index, 1)}
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

              <div className="text-left shrink-0">
                <p className="text-sm font-bold">
                  {(item.quantity * item.unit_price).toLocaleString("ar-EG")}
                </p>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="h-6 w-6 text-destructive"
                  onClick={() => onRemoveFromCart(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

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
          onClick={onOpenPayDialog}
        >
          <CreditCard className="h-5 w-5" />
          إتمام البيع
        </Button>
      </div>
    </div>
  );
};

export default CartPanel;
