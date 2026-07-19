import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Pencil } from "lucide-react";

import AddEditHeader from "@/customs/AddEditHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useGetAllProducts } from "@/hooks/Actions/Product/useCurdsProduct";
import { useAddPurchaseItems } from "@/hooks/Actions/PurchaseItem/useCurdsPurchaseItem";
import { purchaseItemsSchema } from "@/validation/purchaseItems/purchaseItems";

const AddPurchaseItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(productSearch);
    }, 400);
    return () => clearTimeout(timer);
  }, [productSearch]);

  const { data: productsData } = useGetAllProducts(1, 100, { search: debouncedSearch || undefined });
  const { mutate: addMutate, isPending } = useAddPurchaseItems();

  const products = productsData?.data?.data ?? [];

  const form = useForm({
    resolver: zodResolver(purchaseItemsSchema),
    defaultValues: {
      product_id: "",
      quantity: "",
      unit_cost: "",
    },
  });

  const onSubmit = (formData) => {
    addMutate(
      {
        data: {
          purchase_header_id: Number(id),
          product_id: Number(formData.product_id),
          quantity: Number(formData.quantity),
          unit_cost: Number(formData.unit_cost),
        },
      },
      {
        onSuccess: () => {
          navigate(`/purchase-headers/details/${id}`);
        },
      },
    );
  };

  return (
    <div>
      <AddEditHeader
        title="إضافة بضاعة للفاتورة"
        description="أدخل بيانات البضاعة"
        backPath={`/purchase-headers/details/${id}`}
        backText="رجوع"
      />

      <div className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="product_id">المنتج</Label>
              <Controller
                name="product_id"
                control={form.control}
                render={({ field }) => (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {field.value
                          ? products.find((p) => String(p.id) === field.value)
                              ?.name
                          : "اختر المنتج"}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput
                          placeholder="بحث عن منتج..."
                          value={productSearch}
                          onValueChange={setProductSearch}
                        />
                        <CommandList>
                          <CommandEmpty>لا توجد نتائج</CommandEmpty>
                          <CommandGroup>
                            {products.map((product) => (
                              <CommandItem
                                key={product.id}
                                value={product.name}
                                onSelect={() => {
                                  field.onChange(String(product.id));
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    field.value === String(product.id)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {product.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {form.formState.errors.product_id && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.product_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">الكمية</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="any"
                {...form.register("quantity")}
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.quantity.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_cost">سعر الوحدة</Label>
              <Input
                id="unit_cost"
                type="number"
                min="0"
                step="any"
                {...form.register("unit_cost")}
              />
              {form.formState.errors.unit_cost && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.unit_cost.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/purchase-headers/details/${id}`)}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPurchaseItem;
