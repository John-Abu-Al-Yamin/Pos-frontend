import React from "react";
import { Loader2, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

const PaymentDialog = ({
  open,
  onOpenChange,
  paymentMethod,
  onPaymentMethodChange,
  cart,
  total,
  salePending,
  onCompleteSale,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>إتمام البيع</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>طريقة الدفع</Label>
            <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
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
                  {(item.quantity * item.unit_price).toLocaleString("ar-EG")} ج.م
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            onClick={onCompleteSale}
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
  );
};

export default PaymentDialog;
