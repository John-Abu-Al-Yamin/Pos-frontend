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
import { useGetAllSuppliers } from "@/hooks/Actions/suppliers/useCurdsSuppliers";
import { useAddPurchaseHeaders } from "@/hooks/Actions/PurchaseHeader/useCurdsPurchaseHeader";
import { purchaseHeadersSchema } from "@/validation/purchaseHeaders/purchaseHeaders";

const AddPurchaseHeader = () => {
  const navigate = useNavigate();

  const { data: suppliersData } = useGetAllSuppliers(1, 100);
  const { mutate: addMutate, isPending } = useAddPurchaseHeaders();

  const suppliers = suppliersData?.data?.data ?? [];

  const form = useForm({
    resolver: zodResolver(purchaseHeadersSchema),
    defaultValues: {
      supplier_id: "",
      supplier_invoice_number: "",
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
            navigate(`/purchase-item/add/${purchaseHeaderId}`);
          }
        },
      },
    );
  };

  return (
    <div>
      <AddEditHeader
        title="إضافة طلب شراء"
        description="أدخل بيانات طلب الشراء"
        backPath="/purchase-headers"
        backText="رجوع"
      />

      <div className=" p-6 ">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier_id">المورد</Label>
              <Controller
                name="supplier_id"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر المورد" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem
                          key={supplier.id}
                          value={String(supplier.id)}
                        >
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.supplier_id && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.supplier_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier_invoice_number">رقم فاتورة المورد</Label>
              <Input
                id="supplier_invoice_number"
                {...form.register("supplier_invoice_number")}
              />
              {form.formState.errors.supplier_invoice_number && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.supplier_invoice_number.message}
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
              onClick={() => navigate("/purchase-headers")}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPurchaseHeader;
