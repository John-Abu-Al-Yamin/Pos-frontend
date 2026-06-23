import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarIcon, ShoppingBag, Boxes, Loader2 } from "lucide-react";

import { useAddPurchaseHeaders } from "@/hooks/Actions/PurchaseHeaders/useCurdsPurchaseHeaders";
import { useGetAllSuppliers } from "@/hooks/Actions/suppliers/useCurdsSuppliers";
import { purchasesSchema } from "@/validation/Purchases/Purchases";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import AddEditHeader from "@/customs/AddEditHeader";

const PurchasesAdd = () => {
  const navigate = useNavigate();

  const { data: suppliersData, isPending: suppliersPending } =
    useGetAllSuppliers(1, 1000);
  const suppliers = suppliersData?.data?.data ?? [];

  const { mutate: addPurchase, isPending: submitPending } =
    useAddPurchaseHeaders();

  // Setup React Hook Form
  const form = useForm({
    resolver: zodResolver(purchasesSchema),
    defaultValues: {
      supplier_id: "",
      date: null,
      reference: "",
      type: "purchase", // Default value as requested
    },
  });

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onSubmit = (formData) => {
    const formattedDate = formatDateToYYYYMMDD(formData.date);
    const payload = {
      supplier_id: formData.supplier_id,
      date: formattedDate,
      reference: formData.reference,
      type: formData.type,
    };

    addPurchase(
      { data: payload },
      {
        onSuccess: () => {
          toast.success("تم إضافة فاتورة المشتريات بنجاح");
          navigate("/purchases");
        },
        onError: () => {
          toast.error("فشل في إضافة فاتورة المشتريات");
        },
      },
    );
  };

  return (
    <div className=" mx-auto p-4">
      <AddEditHeader
        title="إضافة فاتورة مشتريات"
        description="أدخل تفاصيل فاتورة المشتريات الجديدة للموردين"
        backPath="/purchases"
        backText="العودة للمشتريات"
      />

      {/* Main Form Card */}
      <div className="">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Supplier and Date - side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Supplier Selector */}
            <div className="space-y-2">
              <Label htmlFor="supplier_id" className="text-sm font-semibold">
                المورد
              </Label>
              <Controller
                name="supplier_id"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          suppliersPending
                            ? "جاري تحميل الموردين..."
                            : "اختر المورد"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((sup) => (
                        <SelectItem key={sup.id} value={String(sup.id)}>
                          {sup.name} {sup.phone && `(${sup.phone})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.supplier_id && (
                <p className="text-sm text-destructive font-medium">
                  {form.formState.errors.supplier_id.message}
                </p>
              )}
            </div>

            {/* Date Picker */}
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="date" className="text-sm font-semibold">
                التاريخ
              </Label>
              <Controller
                name="date"
                control={form.control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-right font-normal gap-2 ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {field.value ? (
                          field.value.toLocaleDateString("ar-EG", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        ) : (
                          <span>اختر التاريخ</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive font-medium">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>
          </div>

          {/* Reference/Description Field */}
          <div className="space-y-2">
            <Label htmlFor="reference" className="text-sm font-semibold">
              المرجع / وصف الفاتورة
            </Label>
            <Input
              id="reference"
              placeholder="مثال: شراء ايفونات 15 برو ماكس"
              className="text-right"
              {...form.register("reference")}
            />
            {form.formState.errors.reference && (
              <p className="text-sm text-destructive font-medium">
                {form.formState.errors.reference.message}
              </p>
            )}
          </div>

          {/* Invoice Type Cards */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">نوع الفاتورة</Label>
            <Controller
              name="type"
              control={form.control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-4">
                  {/* Purchase Card */}
                  <div
                    onClick={() => field.onChange("purchase")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-3 border cursor-pointer select-none transition-all duration-300 w-auto ${
                      field.value === "purchase"
                        ? "bg-primary/4 border-primary ring-2 ring-primary/20 shadow-xs"
                        : "bg-white border-border hover:border-primary/30 hover:bg-neutral-50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        field.value === "purchase"
                          ? "bg-primary/10 text-primary"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div className="text-center">
                      <p
                        className={`font-semibold text-sm ${field.value === "purchase" ? "text-primary" : "text-neutral-800"}`}
                      >
                        مشتريات
                      </p>
                      <p className="text-sm text-neutral-400 mt-0.5 max-w-40">
                        فاتورة شراء بضاعة جديدة من مورد خارجي
                      </p>
                    </div>
                  </div>

                  {/* Opening Stock Card */}
                  <div
                    onClick={() => field.onChange("opening_stock")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-3 border cursor-pointer select-none transition-all duration-300 w-auto ${
                      field.value === "opening_stock"
                        ? "bg-primary/4 border-primary ring-2 ring-primary/20 shadow-xs"
                        : "bg-white border-border hover:border-primary/30 hover:bg-neutral-50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        field.value === "opening_stock"
                          ? "bg-primary/10 text-primary"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      <Boxes className="h-4 w-4" />
                    </div>
                    <div className="text-center">
                      <p
                        className={`font-semibold text-sm ${field.value === "opening_stock" ? "text-primary" : "text-neutral-800"}`}
                      >
                        بضاعة بالمحل
                      </p>
                      <p className="text-sm text-neutral-400 mt-0.5 max-w-40">
                        رصيد أول المدة أو بضاعة موجودة بالمستودع
                      </p>
                    </div>
                  </div>
                </div>
              )}
            />
            {form.formState.errors.type && (
              <p className="text-sm text-destructive font-medium">
                {form.formState.errors.type.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto min-w-[150px] font-semibold gap-2"
              disabled={submitPending}
            >
              {submitPending && <Loader2 className="h-4 w-4 animate-spin" />}
              حفظ الفاتورة
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchasesAdd;
