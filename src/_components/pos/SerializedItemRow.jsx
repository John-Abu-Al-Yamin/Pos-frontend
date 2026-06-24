import React from "react";
import { Package, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

const SerializedItemRow = ({
  item,
  formKey,
  addForm,
  onInitForm,
  onSetFormValue,
  onAdd,
  isInCart,
}) => {
  const cond = conditionMeta[item.condition];
  const defaultPrice = Number(item.cost_price) || 0;

  return (
    <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg border hover:bg-neutral-50 transition-colors">
      <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="text-xs font-mono flex-1 min-w-0" dir="ltr">
        {item.serial_number}
      </span>
      {cond && (
        <Badge variant="outline" className={`text-[10px] h-5 ${cond.bg}`}>
          {cond.label}
        </Badge>
      )}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">سعر</span>
        <Input
          type="number"
          min="0"
          step="0.01"
          className="h-7 w-20 text-xs text-left"
          dir="ltr"
          placeholder="السعر"
          defaultValue={addForm[formKey]?.unit_price ?? defaultPrice}
          onFocus={() => onInitForm(formKey, true, defaultPrice)}
          onChange={(e) => onSetFormValue(formKey, "unit_price", e.target.value)}
        />
      </div>
      {isInCart ? (
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
          onClick={() => onAdd(item)}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};

export default SerializedItemRow;
