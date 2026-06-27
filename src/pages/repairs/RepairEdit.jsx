import React from "react";
import { useParams, useNavigate } from "react-router-dom";
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

import {
  useGetRepairById,
  useUpdateRepair,
} from "@/hooks/Actions/repairs/useCurdsRepairs";
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
import Loading from "@/customs/Loading";
import AddEditHeader from "@/customs/AddEditHeader";

const STATUS_OPTIONS = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "in_progress", label: "قيد الإصلاح" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

const RepairEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: repairData, isPending } = useGetRepairById(id);
  const repair = repairData?.data?.data;

  const { data: customersData } = useGetAllCustomers(1, 1000);
  const customers = customersData?.data?.data ?? [];

  const [selectedParts, setSelectedParts] = React.useState([]);
  const [initialized, setInitialized] = React.useState(false);
  const [selectedPartId, setSelectedPartId] = React.useState("");

  const { data: stockData } = useGetAllStock({
    page: 1,
    per_page: 100,
    status: "available",
    product_category: "part",
  });
  const availableParts = stockData?.data?.data ?? [];

  const { mutate: updateRepair, isPending: submitPending } =
    useUpdateRepair(id);

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
      status: "pending",
      parts: [],
    },
  });

  const [customerType, setCustomerType] = React.useState("new");

  React.useEffect(() => {
    if (repair && !initialized) {
      const existingParts = (repair.repair_parts ?? []).map((p) => ({
        stock_item_id: String(p.stock_item_id),
        product_name: p.product?.name || "",
        serial_number: p.stock_item?.serial_number || "",
        cost_price: String(p.unit_cost || 0),
      }));

      form.reset({
        customer_id: repair.customer_id ? String(repair.customer_id) : "",
        customer_name: repair.customer_name || "",
        customer_phone: repair.customer_phone || "",
        device_type: repair.device_type || "",
        device_serial: repair.device_serial || "",
        issue_description: repair.issue_description || "",
        work_description: repair.work_description || "",
        estimated_cost: String(repair.estimated_cost || 0),
        deposit: String(repair.deposit || 0),
        expected_delivery_date: repair.expected_delivery_date
          ? new Date(repair.expected_delivery_date)
          : null,
        status: repair.status || "pending",
        parts: existingParts,
      });

      setSelectedParts(existingParts);
      setCustomerType(repair.customer_id ? "existing" : "new");
      setInitialized(true);
    }
  }, [repair, initialized, form]);

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
    const updated = [...selectedParts, newPart];
    setSelectedParts(updated);
    form.setValue("parts", updated);
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
        customerType === "new" ? formData.customer_name || null : null,
      customer_phone:
        customerType === "new" ? formData.customer_phone || null : null,
      customer_id:
        customerType === "existing" && formData.customer_id
          ? Number(formData.customer_id)
          : null,
      device_type: formData.device_type,
      device_serial: formData.device_serial || null,
      issue_description: formData.issue_description,
      work_description: formData.work_description || null,
      estimated_cost: formData.estimated_cost
        ? Number(formData.estimated_cost)
        : 0,
      deposit: formData.deposit ? Number(formData.deposit) : 0,
      expected_delivery_date: formData.expected_delivery_date
        ? formatDateToYYYYMMDD(formData.expected_delivery_date)
        : null,
      status: formData.status,
      parts:
        selectedParts.length > 0
          ? selectedParts.map((p) => ({
              stock_item_id: Number(p.stock_item_id),
            }))
          : [],
    };

    updateRepair(
      { data: payload },
      {
        onSuccess: () => {
          navigate(`/repairs/${id}`);
        },
        onError: (error) => {
          const errorData = error?.response?.data;
          const messages = errorData?.errors?.map((e) => e.message);
          if (messages?.length) {
            toast.error(messages.join("\n"));
          } else {
            toast.error(errorData?.message || "فشل في تحديث أمر الإصلاح");
          }
        },
      },
    );
  };

  if (isPending) return <Loading />;
  if (!repair)
    return (
      <div className="text-center py-12 text-muted-foreground">
        أمر الإصلاح غير موجود
      </div>
    );

  if (["completed", "cancelled"].includes(repair.status)) {
    return (
      <div className="p-4">
        <AddEditHeader
          title="تعديل أمر الإصلاح"
          description="لا يمكن تعديل أمر الإصلاح في هذه الحالة"
          backPath={`/repairs/${id}`}
          backText="العودة للتفاصيل"
        />
        <div className="text-center py-12 text-muted-foreground">
          لا يمكن تعديل أمر الإصلاح بعد إكماله أو إلغائه.
        </div>
      </div>
    );
  }

  const totalPartsCost = selectedParts.reduce(
    (sum, p) => sum + Number(p.cost_price || 0),
    0,
  );

  return (
    <div className="mx-auto p-4">
      <AddEditHeader
        title="تعديل أمر الإصلاح"
        description="تحديث بيانات أمر الإصلاح"
        backPath={`/repairs/${id}`}
        backText="العودة للتفاصيل"
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
              <Label>نوع الجهاز *</Label>
              <Input
                placeholder="iPhone 14 Pro Max"
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
              <Label>الرقم التسلسلي</Label>
              <Input
                placeholder="IMEI / Serial"
                dir="ltr"
                className="text-left"
                {...form.register("device_serial")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>وصف المشكلة *</Label>
            <Textarea
              placeholder="ما هي المشكلة؟"
              className="text-right min-h-20"
              {...form.register("issue_description")}
            />
            {form.formState.errors.issue_description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.issue_description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>العمل المطلوب</Label>
            <Textarea
              placeholder="ما هي الإصلاحات؟"
              className="text-right min-h-20"
              {...form.register("work_description")}
            />
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
                <Label>اسم العميل</Label>
                <Input
                  placeholder="اسم العميل"
                  className="text-right"
                  {...form.register("customer_name")}
                />
              </div>
              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input
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
                          {c.name}
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
              إجمالي فلوس قطع الغيار: {totalPartsCost.toLocaleString("ar-EG")}
            </div>
          )}

          {availableParts.length === 0 && (
            <p className="text-sm text-muted-foreground">
              لا توجد قطع غيار متاحة في المخزون
            </p>
          )}
        </div>

        {/* Pricing */}
        <div className=" p-4 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            التكاليف
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>التكلفة التقديرية</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                dir="ltr"
                className="text-left"
                {...form.register("estimated_cost")}
              />
            </div>
            <div className="space-y-2">
              <Label>الدفعة المقدمة</Label>
              <Input
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
            <Label>تاريخ التسليم المتوقع</Label>
            <Controller
              name="expected_delivery_date"
              control={form.control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-right font-normal gap-2 ${!field.value && "text-muted-foreground"}`}
                    >
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
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
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
        </div>

        {/* Status */}
        <div className="p-4 space-y-3">
          <h2 className="text-lg font-semibold">الحالة</h2>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
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
            تحديث أمر الإصلاح
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RepairEdit;
