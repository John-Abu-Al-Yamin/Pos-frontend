import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Smartphone,
  User,
  AlertCircle,
  Wrench,
  Coins,
  CalendarDays,
  X,
  Loader2,
} from "lucide-react";

import { useAddRepair } from "@/hooks/Actions/repairs/useCurdsRepairs";
import { useGetAllCustomers } from "@/hooks/Actions/customers/useCurdsCustomers";
import { useGetAllStock } from "@/hooks/Actions/stock/useCurdsStock";
import { repairsSchema } from "@/validation/repairs/repairs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import AddEditHeader from "@/customs/AddEditHeader";

const RepairAdd = () => {
  const navigate = useNavigate();

  const { data: customersData } = useGetAllCustomers(1, 1000);
  const customers = customersData?.data?.data ?? [];

  const { data: stockData } = useGetAllStock({
    page: 1,
    per_page: 100,
    status: "available",
    product_category: "part",
  });
  const availableParts = stockData?.data?.data ?? [];

  const { mutate: addRepair, isPending: submitPending } = useAddRepair();

  const form = useForm({
    resolver: zodResolver(repairsSchema),
    defaultValues: {
      customer_id: "",
      customer_name: "",
      customer_phone: "",
      device_type: "",
      device_serial: "",
      issue_description: "",
      work_description: "",
      estimated_cost: "",
      deposit: "",
      expected_delivery_date: null,
      parts: [],
    },
  });

  const [selectedParts, setSelectedParts] = React.useState([]);
  const [customerType, setCustomerType] = React.useState("new");
  const [selectedPartId, setSelectedPartId] = React.useState("");

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const addPart = (stockItem) => {
    if (selectedParts.some((p) => p.stock_item_id === String(stockItem.id)))
      return;
    const newPart = {
      stock_item_id: String(stockItem.id),
      product_name: stockItem.product?.name || "",
      serial_number: stockItem.serial_number || "",
      cost_price: String(stockItem.cost_price || 0),
    };
    setSelectedParts((prev) => [...prev, newPart]);
    form.setValue("parts", [...selectedParts, newPart]);
  };

  const removePart = (stockItemId) => {
    const filtered = selectedParts.filter(
      (p) => p.stock_item_id !== stockItemId,
    );
    setSelectedParts(filtered);
    form.setValue("parts", filtered);
  };

  const onSubmit = (formData) => {
    const payload = {
      customer_name:
        customerType === "new" ? formData.customer_name : undefined,
      customer_phone:
        customerType === "new" ? formData.customer_phone : undefined,
      customer_id:
        customerType === "existing" && formData.customer_id
          ? formData.customer_id
          : undefined,
      device_type: formData.device_type,
      device_serial: formData.device_serial || undefined,
      issue_description: formData.issue_description,
      work_description: formData.work_description || undefined,
      estimated_cost: formData.estimated_cost
        ? Number(formData.estimated_cost)
        : 0,
      deposit: formData.deposit ? Number(formData.deposit) : 0,
      expected_delivery_date: formData.expected_delivery_date
        ? formatDateToYYYYMMDD(formData.expected_delivery_date)
        : undefined,
      parts:
        selectedParts.length > 0
          ? selectedParts.map((p) => ({
              stock_item_id: Number(p.stock_item_id),
            }))
          : undefined,
    };

    addRepair(
      { data: payload },
      {
        onSuccess: () => {
          navigate("/repairs");
        },
        onError: (error) => {
          const errorData = error?.response?.data;
          const messages = errorData?.errors?.map((e) => e.message);
          if (messages?.length) {
            toast.error(messages.join("\n"));
          } else {
            toast.error(errorData?.message || "فشل في إنشاء أمر الإصلاح");
          }
        },
      },
    );
  };

  const totalPartsCost = selectedParts.reduce(
    (sum, p) => sum + Number(p.cost_price || 0),
    0,
  );

  return (
    <div className=" p-4">
      <AddEditHeader
        title="إضافة أمر إصلاح"
        description="أدخل تفاصيل أمر الإصلاح الجديد"
        backPath="/repairs"
        backText="العودة لأوامر الإصلاح"
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
        {/* Device Section */}
        <div className=" p-4 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            بيانات الجهاز
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="device_type">نوع الجهاز *</Label>
              <Input
                id="device_type"
                placeholder="مثال: iPhone 14 Pro Max"
                className="text-right"
                {...form.register("device_type")}
              />
              {form.formState.errors.device_type && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.device_type.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="device_serial">الرقم التسلسلي للجهاز</Label>
              <Input
                id="device_serial"
                placeholder="IMEI / Serial Number"
                dir="ltr"
                className="text-left"
                {...form.register("device_serial")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue_description">وصف المشكلة *</Label>
            <div className="relative">
              <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="issue_description"
                placeholder="ما هي المشكلة في الجهاز؟"
                className="text-right pr-9 min-h-20"
                {...form.register("issue_description")}
              />
            </div>
            {form.formState.errors.issue_description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.issue_description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="work_description">العمل المطلوب</Label>
            <div className="relative">
              <Wrench className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="work_description"
                placeholder="ما هي الإصلاحات التي ستتم؟"
                className="text-right pr-9 min-h-20"
                {...form.register("work_description")}
              />
            </div>
          </div>
        </div>

        {/* Customer Section */}
        <div className=" p-4 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            بيانات العميل
          </h2>

          <div className="flex gap-4 mb-2">
            <Button
              type="button"
              variant={customerType === "new" ? "default" : "outline"}
              size="sm"
              onClick={() => setCustomerType("new")}
            >
              عميل جديد
            </Button>
            <Button
              type="button"
              variant={customerType === "existing" ? "default" : "outline"}
              size="sm"
              onClick={() => setCustomerType("existing")}
            >
              عميل موجود
            </Button>
          </div>

          {customerType === "new" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">اسم العميل</Label>
                <Input
                  id="customer_name"
                  placeholder="اسم العميل"
                  className="text-right"
                  {...form.register("customer_name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_phone">رقم الهاتف</Label>
                <Input
                  id="customer_phone"
                  placeholder="01000000000"
                  dir="ltr"
                  className="text-right"
                  {...form.register("customer_phone")}
                />
              </div>
            </div>
          ) : (
            <Controller
              name="customer_id"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>اختر العميل</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name} {c.phone && `(${c.phone})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          )}
        </div>

        {/* Spare Parts Section */}
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            قطع الغيار
          </h2>

          <div className="space-y-2">
            <Label>إضافة قطعة غيار</Label>
            <Select
              value={selectedPartId}
              onValueChange={(val) => {
                const item = availableParts.find((p) => String(p.id) === val);
                if (item) addPart(item);
                setSelectedPartId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر قطعة غيار..." />
              </SelectTrigger>
              <SelectContent>
                {availableParts
                  .filter(
                    (p) =>
                      !selectedParts.some(
                        (sp) => sp.stock_item_id === String(p.id),
                      ),
                  )
                  .map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.product?.name}
                      {item.serial_number && ` (${item.serial_number})`}
                      {" - "}
                      {Number(item.cost_price || 0).toLocaleString("ar-EG")}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {selectedParts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedParts.map((part) => (
                <Badge
                  key={part.stock_item_id}
                  variant="secondary"
                  className="gap-1 pl-1"
                >
                  {part.product_name}
                  {part.serial_number && ` (${part.serial_number})`}
                  <button
                    type="button"
                    onClick={() => removePart(part.stock_item_id)}
                    className="mr-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {selectedParts.length > 0 && (
            <div className="text-sm text-muted-foreground">
              إجمال يفلوس قطع الغيار: {totalPartsCost.toLocaleString("ar-EG")}
            </div>
          )}

          {availableParts.length === 0 && (
            <p className="text-sm text-muted-foreground">
              لا توجد قطع غيار متاحة في المخزون
            </p>
          )}
        </div>

        {/* Pricing Section */}
        <div className=" p-4 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            التكاليف والدفع
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_cost">التكلفة التقديرية</Label>
              <Input
                id="estimated_cost"
                type="number"
                step="0.01"
                placeholder="0.00"
                dir="ltr"
                className="text-left"
                {...form.register("estimated_cost")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">الدفعة المقدمة / العربون</Label>
              <Input
                id="deposit"
                type="number"
                step="0.01"
                placeholder="0.00"
                dir="ltr"
                className="text-left"
                {...form.register("deposit")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_delivery_date">
              تاريخ التسليم المتوقع
            </Label>
            <Controller
              name="expected_delivery_date"
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
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      {field.value ? (
                        field.value.toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      ) : (
                        <span>اختر تاريخ التسليم</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>التكلفة التقديرية:</span>
            <span className="font-semibold">
              {Number(form.watch("estimated_cost") || 0).toLocaleString(
                "ar-EG",
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>الدفعة المقدمة:</span>
            <span className="font-semibold text-amber-600">
              {Number(form.watch("deposit") || 0).toLocaleString("ar-EG")}
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto min-w-[200px] font-semibold gap-2"
            disabled={submitPending}
          >
            {submitPending && <Loader2 className="h-4 w-4 animate-spin" />}
            إنشاء أمر الإصلاح
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RepairAdd;
