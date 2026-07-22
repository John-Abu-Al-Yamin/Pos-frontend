import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useUpdateMaintenanceTickets } from "@/hooks/Actions/MaintenanceTickets/useCurdsMaintenanceTickets";

const MaintenanceSummary = ({ ticket, headerId, canMutate, refetchTicket, onPayAndDeliver }) => {
  const { mutate: updateHeaderMutate } = useUpdateMaintenanceTickets(headerId);

  const [editingAdvance, setEditingAdvance] = useState(false);
  const [advanceValue, setAdvanceValue] = useState("");

  const grandTotal = Number(ticket.total_cost || 0);
  const paidAmount = Number(ticket.advance_payment || 0);
  const remainingAmount = Math.max(0, grandTotal - paidAmount);
  const canEditAdvance = canMutate && ticket.status !== "repaired";

  const handleSaveAdvance = () => {
    const val = parseFloat(advanceValue);
    if (isNaN(val) || val < 0) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }

    updateHeaderMutate(
      { data: { advance_payment: val } },
      {
        onSuccess: () => {
          setEditingAdvance(false);
          refetchTicket();
        },
      }
    );
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">ملخص الفاتورة</h2>
        {ticket.status === "repaired" && remainingAmount >= 0 && (
          <Button variant="default" onClick={onPayAndDeliver}>
            تسديد المتبقي وتسليم
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
          <p className="text-xs font-medium text-primary mb-1">
            الإجمالي الكلي (من النظام)
          </p>
          <p className="text-xl font-bold text-primary">
            {formatCurrency(grandTotal)}
          </p>
        </div>
        
        <div className="rounded-lg bg-purple-50 p-4 border border-purple-100">
          <p className="text-xs font-medium text-purple-600 mb-1">
            المدفوع مقدمًا
          </p>
          {canEditAdvance && editingAdvance ? (
            <div className="flex items-center gap-1 mt-1">
              <Input
                type="number"
                min="0"
                step="any"
                value={advanceValue}
                onChange={(e) => setAdvanceValue(e.target.value)}
                className="h-8 text-sm"
              />
              <Button
                size="sm"
                variant="default"
                className="h-8 px-2"
                onClick={handleSaveAdvance}
              >
                حفظ
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2"
                onClick={() => setEditingAdvance(false)}
              >
                إلغاء
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xl font-bold text-purple-700">
                {formatCurrency(paidAmount)}
              </p>
              {canEditAdvance && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-1"
                  onClick={() => {
                    setAdvanceValue(String(paidAmount));
                    setEditingAdvance(true);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="rounded-lg bg-amber-50 p-4 border border-amber-100">
          <p className="text-xs font-medium text-amber-600 mb-1">
            المبلغ المتبقي
          </p>
          <p className="text-xl font-bold text-amber-700">
            {formatCurrency(remainingAmount)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceSummary;
