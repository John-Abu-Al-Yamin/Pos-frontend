import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Loading from "@/customs/Loading";
import SerializedItemRow from "./SerializedItemRow";
import NonSerializedProductCard from "./NonSerializedProductCard";

const ProductPanel = ({
  search,
  onSearchChange,
  stockPending,
  groupedStock,
  addForm,
  onInitForm,
  onSetFormValue,
  onAddSerialized,
  onAddNonSerialized,
  isSerializedInCart,
  isNonSerializedInCart,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن منتج أو IMEI..."
            className="pr-10 text-right"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
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
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">
                    {group.product?.name}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {group.items.length} متاح
                  </Badge>
                </div>

                {group.product?.is_serialized ? (
                  <div className="space-y-1.5">
                    {group.items.map((item) => {
                      const formKey = `${item.product_id}_${item.id}`;
                      return (
                        <SerializedItemRow
                          key={item.id}
                          item={item}
                          formKey={formKey}
                          addForm={addForm}
                          onInitForm={onInitForm}
                          onSetFormValue={onSetFormValue}
                          onAdd={onAddSerialized}
                          isInCart={isSerializedInCart(item.id)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <NonSerializedProductCard
                    group={group}
                    defaultPrice={defaultPrice}
                    addForm={addForm}
                    onInitForm={onInitForm}
                    onSetFormValue={onSetFormValue}
                    onAdd={onAddNonSerialized}
                    isInCart={isNonSerializedInCart(group.product.id)}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductPanel;
