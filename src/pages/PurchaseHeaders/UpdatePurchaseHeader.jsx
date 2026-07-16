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
import { useGetAllSuppliers } from "@/hooks/Actions/suppliers/useCurdsSuppliers";
import {
  useGetPurchaseHeadersById,
  useUpdatePurchaseHeaders,
} from "@/hooks/Actions/PurchaseHeader/useCurdsPurchaseHeader";
import { purchaseHeadersSchema } from "@/validation/purchaseHeaders/purchaseHeaders";

const UpdatePurchaseHeader = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: purchaseData, isPending: isFetching } =
    useGetPurchaseHeadersById(id);
  const { data: suppliersData } = useGetAllSuppliers(1, 100);
  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdatePurchaseHeaders(id);

  const purchaseHeader = purchaseData?.data?.data;
  const suppliers = suppliersData?.data?.data ?? [];

  const isLocked =
    purchaseHeader &&
    ["completed", "cancelled"].includes(purchaseHeader.status);

  const form = useForm({
    resolver: zodResolver(purchaseHeadersSchema),
    defaultValues: {
      supplier_id: "",
      supplier_invoice_number: "",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (purchaseHeader) {
      form.reset({
        supplier_id: String(purchaseHeader.supplier_id),
        supplier_invoice_number: purchaseHeader.supplier_invoice_number || "",
        notes: purchaseHeader.notes || "",
      });
    }
  }, [purchaseHeader, form]);

  const onSubmit = (formData) => {
    updateMutate(
      { data: formData },
      {
        onSuccess: () => {
          navigate("/purchase-headers");
        },
      },
    );
  };

  if (isFetching) return <Loading />;

  return (
    <div>
      <AddEditHeader
        title="تعديل طلب شراء"
        description="تحديث بيانات طلب الشراء"
        backPath="/purchase-headers"
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
              <Label htmlFor="supplier_id">المورد</Label>
              <Controller
                name="supplier_id"
                control={form.control}
                render={({ field }) => (
                  <Select
                    disabled={isLocked}
                    onValueChange={field.onChange}
                    value={field.value}
                    key={field.value}
                  >
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
                disabled={isLocked}
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

export default UpdatePurchaseHeader;
