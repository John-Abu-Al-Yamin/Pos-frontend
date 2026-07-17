import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";

import AddEditHeader from "@/customs/AddEditHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetAllProducts } from "@/hooks/Actions/Product/useCurdsProduct";
import { useAddUsedPurchaseItems } from "@/hooks/Actions/UsedDevicePurchaseItem/useCurdsUsedDevicePurchaseItem";
import { usedDevicePurchaseItemsSchema } from "@/validation/usedDevicePurchaseItems/usedDevicePurchaseItems";

const AddUsedDevicePurchaseItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState(false);

  const { data: productsData } = useGetAllProducts(1, 100);
  const { mutate: addMutate, isPending } = useAddUsedPurchaseItems();

  const products = productsData?.data?.data ?? [];

  const form = useForm({
    resolver: zodResolver(usedDevicePurchaseItemsSchema),
    defaultValues: {
      product_id: "",
      quantity: "",
      unit_price: "",
      screen_condition: "",
      body_condition: "",
      fingerprint_working: "",
      face_id_working: "",
      notes: "",
    },
  });

  const onSubmit = (formData) => {
    const submitData = {
      purchaseId: Number(id),
      data: {
        product_id: Number(formData.product_id),
        quantity: Number(formData.quantity),
        unit_price: Number(formData.unit_price),
        screen_condition: formData.screen_condition || undefined,
        body_condition: formData.body_condition || undefined,
        fingerprint_working: formData.fingerprint_working === "" ? undefined : formData.fingerprint_working === "true",
        face_id_working: formData.face_id_working === "" ? undefined : formData.face_id_working === "true",
        notes: formData.notes || undefined,
      },
    };

    addMutate(submitData, {
      onSuccess: () => {
        navigate(`/used-purchase-headers/details/${id}`);
      },
    });
  };

  return (
    <div>
      <AddEditHeader
        title="إضافة جهاز للفاتورة"
        description="أدخل بيانات الجهاز المستعمل"
        backPath={`/used-purchase-headers/details/${id}`}
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
                        <CommandInput placeholder="بحث عن منتج..." />
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
                step="1"
                {...form.register("quantity")}
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.quantity.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_price">سعر الوحدة</Label>
              <Input
                id="unit_price"
                type="number"
                min="0"
                step="any"
                {...form.register("unit_price")}
              />
              {form.formState.errors.unit_price && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.unit_price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="screen_condition">حالة الشاشة</Label>
              <Controller
                name="screen_condition"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر حالة الشاشة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ممتاز">ممتاز</SelectItem>
                      <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                      <SelectItem value="جيد">جيد</SelectItem>
                      <SelectItem value="مقبول">مقبول</SelectItem>
                      <SelectItem value="سيء">سيء</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_condition">حالة الهيكل</Label>
              <Controller
                name="body_condition"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر حالة الهيكل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ممتاز">ممتاز</SelectItem>
                      <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                      <SelectItem value="جيد">جيد</SelectItem>
                      <SelectItem value="مقبول">مقبول</SelectItem>
                      <SelectItem value="سيء">سيء</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fingerprint_working">البصمة</Label>
              <Controller
                name="fingerprint_working"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">تعمل</SelectItem>
                      <SelectItem value="false">لا تعمل</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="face_id_working">Face ID</Label>
              <Controller
                name="face_id_working"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">يعمل</SelectItem>
                      <SelectItem value="false">لا يعمل</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea id="notes" rows={3} {...form.register("notes")} />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/used-purchase-headers/details/${id}`)}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUsedDevicePurchaseItem;
