import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AddEditHeader from "@/customs/AddEditHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllCustomers } from "@/hooks/Actions/customers/useCurdsCustomers";
import { useAddUsedPurchaseHeaders } from "@/hooks/Actions/UsedDevicePurchaseHeader/useCurdsUsedDevicePurchaseHeader";
import { usedDevicePurchaseHeadersSchema } from "@/validation/usedDevicePurchaseHeaders/usedDevicePurchaseHeaders";

const AddUsedDevicePurchaseHeader = () => {
  const navigate = useNavigate();

  const { data: customersData } = useGetAllCustomers(1, 100);
  const { mutate: addMutate, isPending } = useAddUsedPurchaseHeaders();

  const customers = customersData?.data?.data ?? [];

  const form = useForm({
    resolver: zodResolver(usedDevicePurchaseHeadersSchema),
    defaultValues: {
      purchase_number: "",
      customer_id: "",
      notes: "",
    },
  });

  const onSubmit = (data) => {
    addMutate(
      { data: data },

      {
        onSuccess: (response) => {
          const purchaseHeaderId = response?.data?.data?.id;
          if (purchaseHeaderId) {
            navigate(`/used-purchase-item/add/${purchaseHeaderId}`);
          }
        },
      },
    );
  };

  return (
    <div>
      <AddEditHeader
        title="إضافة فاتورة شراء أجهزة مستعملة"
        description="أدخل بيانات فاتورة شراء الأجهزة المستعملة"
        backPath="/used-purchase-headers"
        backText="رجوع"
      />

      <div className=" p-6 ">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchase_number">رقم الفاتورة</Label>
              <Input
                id="purchase_number"
                {...form.register("purchase_number")}
              />
              {form.formState.errors.purchase_number && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.purchase_number.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_id">العميل</Label>
              <Controller
                name="customer_id"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem
                          key={customer.id}
                          value={String(customer.id)}
                        >
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.customer_id && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.customer_id.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea id="notes" rows={4} {...form.register("notes")} />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/used-purchase-headers")}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUsedDevicePurchaseHeader;
