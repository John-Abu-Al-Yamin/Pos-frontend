import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { useUpdateMaintenanceStatus, useUpdateMaintenanceTickets } from "@/hooks/Actions/MaintenanceTickets/useCurdsMaintenanceTickets";
import { toast } from "sonner";

const MaintenancePaymentModal = ({ isOpen, onClose, ticket, headerId, refetchTicket }) => {
  const { mutate: updateStatusMutate } = useUpdateMaintenanceStatus();
  const { mutate: updateHeaderMutate } = useUpdateMaintenanceTickets(headerId);

  const grandTotal = Number(ticket.total_cost || 0);
  const paidAmount = Number(ticket.advance_payment || 0);
  const remainingAmount = Math.max(0, grandTotal - paidAmount);

  const [paymentInput, setPaymentInput] = useState(remainingAmount);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = () => {
    if (paymentInput < remainingAmount) {
      toast.error("المبلغ المدخل أقل من المبلغ المتبقي لتسليم الجهاز.");
      return;
    }

    setIsProcessing(true);

    // First update the advance_payment to fully paid
    const newPaidAmount = paidAmount + Number(paymentInput);
    
    updateHeaderMutate(
      { data: { advance_payment: newPaidAmount } },
      {
        onSuccess: () => {
          // Then update status to delivered
          updateStatusMutate(
            headerId, 
            "delivered",
            {
              onSuccess: () => {
                toast.success("تم تسديد المبلغ وتسليم الجهاز بنجاح!");
                setIsProcessing(false);
                onClose();
                refetchTicket();
              },
              onError: () => setIsProcessing(false)
            }
          );
        },
        onError: () => setIsProcessing(false)
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تسديد المتبقي وتسليم الجهاز</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">الإجمالي الكلي</p>
              <p className="font-semibold text-primary">{formatCurrency(grandTotal)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">المدفوع سابقاً</p>
              <p className="font-semibold text-purple-600">{formatCurrency(paidAmount)}</p>
            </div>
          </div>
          
          <div className="rounded-lg bg-amber-50 p-4 border border-amber-100">
            <p className="text-sm font-medium text-amber-800 mb-1">المبلغ المتبقي للدفغ</p>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(remainingAmount)}</p>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="payment">المبلغ المدفوع الآن</Label>
            <Input
              id="payment"
              type="number"
              min={remainingAmount}
              step="any"
              value={paymentInput}
              onChange={(e) => setPaymentInput(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
            إلغاء
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={isProcessing}>
            {isProcessing ? "جاري المعالجة..." : "تأكيد الدفع والتسليم"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenancePaymentModal;
