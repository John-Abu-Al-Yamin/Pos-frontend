import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CustomerDialog = ({
  open,
  onOpenChange,
  customers,
  customerId,
  onSelectCustomer,
  onClearCustomer,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>اختيار عميل</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {customers.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCustomer(String(c.id))}
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
            onClick={onClearCustomer}
            className="w-full text-center text-sm text-muted-foreground py-2 hover:text-foreground"
          >
            بدون عميل
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
