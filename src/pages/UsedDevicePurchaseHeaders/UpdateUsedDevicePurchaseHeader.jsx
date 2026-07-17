import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";

import AddEditHeader from "@/customs/AddEditHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Loading from "@/customs/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllCustomers } from "@/hooks/Actions/customers/useCurdsCustomers";
import {
  useGetUsedPurchaseHeadersById,
  useUpdateUsedPurchaseHeaders,
} from "@/hooks/Actions/UsedDevicePurchaseHeader/useCurdsUsedDevicePurchaseHeader";
import { usedDevicePurchaseHeadersSchema } from "@/validation/usedDevicePurchaseHeaders/usedDevicePurchaseHeaders";

const UpdateUsedDevicePurchaseHeader = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: purchaseData, isPending: isFetching } =
    useGetUsedPurchaseHeadersById(id);
  const { data: customersData } = useGetAllCustomers(1, 100);
  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdateUsedPurchaseHeaders(id);

  const purchaseHeader = purchaseData?.data?.data;
  const customers = customersData?.data?.data ?? [];

  const isLocked =
    purchaseHeader &&
    ["completed", "cancelled"].includes(purchaseHeader.status);

  const form = useForm({
    resolver: zodResolver(usedDevicePurchaseHeadersSchema),
    defaultValues: {
      purchase_number: "",
      customer_id: "",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (purchaseHeader) {
      form.reset({
        purchase_number: purchaseHeader.purchase_number || "",
        customer_id: String(purchaseHeader.customer_id),
        notes: purchaseHeader.notes || "",
      });
    }
  }, [purchaseHeader, form]);

  const onSubmit = (formData) => {
    updateMutate(
      { data: formData },
      {
        onSuccess: () => {
          navigate("/used-purchase-headers");
        },
      },
    );
  };

  if (isFetching) return <Loading />;

  return (
    <div>
      <AddEditHeader
        title="تعديل فاتورة شراء أجهزة مستعملة"
        description="تحديث بيانات فاتورة شراء الأجهزة المستعملة"
        backPath="/used-purchase-headers"
        backText="رجوع"
      />

      <div className="p-6">
        {isLocked && (
          <div className="flex items-center gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 mb-6 text-sm text-yellow-800">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p>
              لا يمكن تعديل فاتورة{" "}
              {purchaseHeader.status === "completed" ? "مكتملة" : "ملغية"}
            </p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchase_number">رقم الفاتورة</Label>
              <Input
                id="purchase_number"
                disabled={isLocked}
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
                  <Select
                    disabled={isLocked}
                    onValueChange={field.onChange}
                    value={field.value}
                    key={field.value}
                  >
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
            <Textarea
              id="notes"
              rows={4}
              disabled={isLocked}
              {...form.register("notes")}
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isUpdating || isLocked}>
              {isUpdating ? "جاري التحديث..." : "تحديث"}
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

export default UpdateUsedDevicePurchaseHeader;
