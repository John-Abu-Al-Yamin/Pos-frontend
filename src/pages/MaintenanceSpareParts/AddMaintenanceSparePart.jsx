import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { z } from "zod";

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
import { useAddMaintenanceUsedParts } from "@/hooks/Actions/MaintenanceSpareParts/useCurdsMaintenanceSpareParts";

const addUsedPartSchema = z.object({
  product_id: z
    .string()
    .min(1, { message: "يرجى اختيار قطعة الغيار" }),
  quantity: z
    .string()
    .min(1, { message: "يرجى إدخال الكمية" }),
});

const AddMaintenanceSparePart = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState(false);

  const { data: productsData } = useGetAllProducts(1, 100, { type: "spare_part" });
  const { mutate: addMutate, isPending } = useAddMaintenanceUsedParts();

  const products = productsData?.data?.data ?? [];

  const form = useForm({
    resolver: zodResolver(addUsedPartSchema),
    defaultValues: {
      product_id: "",
      quantity: "",
    },
  });

  const onSubmit = (formData) => {
    addMutate(
      {
        headerId: Number(id),
        data: {
          product_id: Number(formData.product_id),
          quantity: Number(formData.quantity),
        },
      },
      {
        onSuccess: () => {
          navigate(`/maintenance-tickets/details/${id}`);
        },
      },
    );
  };

  return (
    <div>
      <AddEditHeader
        title="إضافة قطعة غيار"
        description="اختر قطعة الغيار والكمية — سيتم احتساب السعر تلقائياً"
        backPath={`/maintenance-tickets/details/${id}`}
        backText="رجوع"
      />

      <div className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="max-w-lg space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product_id">قطعة الغيار</Label>
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
                          : "اختر قطعة الغيار"}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput placeholder="بحث عن قطعة غيار..." />
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
                min="1"
                step="any"
                {...form.register("quantity")}
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.quantity.message}
                </p>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              سيتم احتساب سعر الوحدة والإجمالي تلقائياً بناءً على التسعير المحدد.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/maintenance-tickets/details/${id}`)}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenanceSparePart;
