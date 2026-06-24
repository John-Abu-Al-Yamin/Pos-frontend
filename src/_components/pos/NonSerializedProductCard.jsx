import React from "react";
import { Plus, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NonSerializedProductCard = ({
  group,
  defaultPrice,
  addForm,
  onInitForm,
  onSetFormValue,
  onAdd,
  isInCart,
}) => {
  const productId = group.product.id;

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg border">
      <span className="text-xs text-muted-foreground">
        {group.items.length} متاحة
      </span>
      <div className="flex items-center gap-1 mr-auto">
        <Label className="text-xs text-muted-foreground">الكمية</Label>
        <Input
          type="number"
          min="1"
          className="h-7 w-16 text-xs text-center"
          placeholder="1"
          defaultValue={addForm[productId]?.quantity ?? 1}
          onFocus={() => onInitForm(productId, false, defaultPrice)}
          onChange={(e) => onSetFormValue(productId, "quantity", e.target.value)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Label className="text-xs text-muted-foreground">سعر الوحدة</Label>
        <Input
          type="number"
          min="0"
          step="0.01"
          className="h-7 w-20 text-xs text-left"
          dir="ltr"
          placeholder="السعر"
          defaultValue={addForm[productId]?.unit_price ?? defaultPrice}
          onFocus={() => onInitForm(productId, false, defaultPrice)}
          onChange={(e) => onSetFormValue(productId, "unit_price", e.target.value)}
        />
      </div>
      {isInCart ? (
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
          onClick={() => onAdd(group, defaultPrice)}
        >
          <Plus className="h-3.5 w-3.5" />
          أضف
        </Button>
      )}
    </div>
  );
};

export default NonSerializedProductCard;
