import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Smartphone,
  User,
  AlertCircle,
  Wrench,
  Coins,
  CalendarDays,
  CheckCircle,
  XCircle,
  Edit,
  BadgeIcon as WrenchIcon,
  CreditCard,
  Banknote,
} from "lucide-react";

import {
  useGetRepairById,
  useCompleteRepair,
  usePayRepair,
  useCancelRepair,
  useDeleteRepair,
  useUpdateRepair,
} from "@/hooks/Actions/repairs/useCurdsRepairs";
import Loading from "@/customs/Loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import InfoCard from "@/customs/InfoCard";

const STATUS_OPTIONS = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "in_progress", label: "قيد الإصلاح" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

const PAYMENT_STATUS_OPTIONS = {
  pending: { label: "غير مدفوع", className: "bg-red-50 text-red-700 border-red-200" },
  partial: { label: "مدفوع جزئياً", className: "bg-amber-50 text-amber-700 border-amber-200" },
  paid: { label: "مدفوع", className: "bg-green-50 text-green-700 border-green-200" },
};

const STATUS_BADGE = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const RepairDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending } = useGetRepairById(id);
  const { mutate: completeRepair, isPending: completing } =
    useCompleteRepair(id);
  const { mutate: payRepair, isPending: paying } = usePayRepair(id);
  const { mutate: cancelRepair, isPending: cancelling } = useCancelRepair(id);
  const { mutate: deleteRepair } = useDeleteRepair();
  const { mutate: updateRepair, isPending: updatingStatus } =
    useUpdateRepair(id);

  const repair = data?.data?.data;

  if (isPending) return <Loading />;
  if (!repair)
    return (
      <div className="text-center py-12 text-muted-foreground">
        أمر الإصلاح غير موجود
      </div>
    );

  const canEdit = !["completed", "cancelled"].includes(repair.status);
  const canComplete = ["pending", "in_progress"].includes(repair.status);
  const canCancel = ["pending", "in_progress"].includes(repair.status);
  const canPay = repair.status === "completed" && repair.payment_status !== "paid";

  const handleStatusChange = (newStatus) => {
    updateRepair({ data: { status: newStatus } });
  };

  const handleComplete = (markAsPaid) => {
    completeRepair(
      { mark_as_paid: markAsPaid },
      {
        onError: () => toast.error("فشل في إكمال أمر الإصلاح"),
      },
    );
  };

  const handlePay = () => {
    payRepair(
      {},
      {
        onError: () => toast.error("فشل في تسجيل الدفع"),
      },
    );
  };

  const handleCancel = () => {
    cancelRepair(
      {},
      {
        // onSuccess: () => toast.success("تم إلغاء أمر الإصلاح"),
        onError: () => toast.error("فشل في إلغاء أمر الإصلاح"),
      },
    );
  };

  const handleDelete = () => {
    deleteRepair(
      { id: repair.id },
      {
        onSuccess: () => {
          // toast.success("تم حذف أمر الإصلاح");
          navigate("/repairs");
        },
        onError: () => toast.error("فشل في حذف أمر الإصلاح"),
      },
    );
  };

  const totalRemaining = Number(repair.estimated_cost) - Number(repair.deposit);

  return (
    <div className="p-4  mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            تفاصيل أمر الإصلاح
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {repair.reference_code} — {repair.device_type}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/repairs")}
            variant="outline"
            className="gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            العودة
          </Button>
          {canEdit && (
            <Button
              onClick={() => navigate(`/repairs/edit/${repair.id}`)}
              variant="outline"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Status + Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Select
              value={repair.status}
              onValueChange={handleStatusChange}
              disabled={updatingStatus}
            >
              <SelectTrigger
                className={`w-[160px] text-sm font-medium border-2 ${STATUS_BADGE[repair.status] || ""} [&_svg]:text-current`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {repair.status === "completed" && (
              <Badge
                variant="outline"
                className={`text-sm px-3 py-1.5 ${PAYMENT_STATUS_OPTIONS[repair.payment_status]?.className || ""}`}
              >
                {PAYMENT_STATUS_OPTIONS[repair.payment_status]?.label || repair.payment_status}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            {canComplete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={completing} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {completing ? "جاري..." : "إكمال"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد إكمال أمر الإصلاح</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                      <p>هل تريد تأكيد إكمال أمر الإصلاح <span className="font-semibold">{repair.reference_code}</span>؟</p>
                      {totalRemaining > 0 && (
                        <div className="rounded-lg border border-border bg-muted/50 p-3 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>المبلغ المتبقي:</span>
                            <span className="font-bold text-destructive">{totalRemaining.toLocaleString("ar-EG")}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">هل تم استلام المبلغ المتبقي من العميل؟</p>
                        </div>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <Button variant="outline" onClick={() => handleComplete(false)}>
                      إكمال فقط
                    </Button>
                    <Button onClick={() => handleComplete(true)} className="gap-2">
                      <Banknote className="h-4 w-4" />
                      إكمال وتسجيل الدفع
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {canPay && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={paying} className="gap-2">
                    <Banknote className="h-4 w-4" />
                    {paying ? "جاري..." : "تسجيل الدفع"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الدفع</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                      <p>هل تم استلام المبلغ المتبقي <span className="font-bold text-destructive">{totalRemaining.toLocaleString("ar-EG")}</span> من العميل؟</p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <Button onClick={handlePay} className="gap-2">
                      <Banknote className="h-4 w-4" />
                      تأكيد الدفع
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {canCancel && (
              <Button
                onClick={handleCancel}
                disabled={cancelling}
                variant="outline"
                className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <XCircle className="h-4 w-4" />
                {cancelling ? "جاري..." : "إلغاء"}
              </Button>
            )}
            {canCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="text-destructive">
                    حذف
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      سيتم حذف أمر الإصلاح وإعادة قطع الغيار إلى المخزون.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      حذف
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Customer + Device Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={User  }
            label="العميل"
            value={repair.customer_name || repair.customer?.name || "غير محدد"}
            accent
          />
          <InfoCard
            icon={Smartphone  }
            label="نوع الجهاز"
            value={repair.device_type}
            accent
          />
          {repair.customer_phone && (
            <InfoCard
              icon={User  }
              label="رقم الهاتف"
              value={repair.customer_phone}
            />
          )}
          {repair.device_serial && (
            <InfoCard
              icon={Smartphone  }
              label="الرقم التسلسلي"
              value={repair.device_serial}
            />
          )}
          {repair.expected_delivery_date && (
            <InfoCard
              icon={CalendarDays  }
              label="تاريخ التسليم"
              value={repair.expected_delivery_date}
            />
          )}
          {repair.user?.name && (
            <InfoCard
              icon={User  }
              label="المسؤول"
              value={repair.user.name}
            />
          )}
        </div>

        {/* Issue + Work Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                وصف المشكلة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {repair.issue_description}
              </p>
            </CardContent>
          </Card>

          {repair.work_description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-primary" />
                  العمل المطلوب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {repair.work_description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Parts Used */}
        {repair.repair_parts?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <WrenchIcon className="h-4 w-4 text-primary" />
                قطع الغيار المستخدمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {repair.repair_parts.map((part) => (
                  <div
                    key={part.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {part.product?.name}
                      </span>
                      {part.stock_item?.serial_number && (
                        <span
                          className="text-xs text-muted-foreground"
                          dir="ltr"
                        >
                          {part.stock_item.serial_number}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-sm">
                      {Number(part.unit_cost).toLocaleString("ar-EG")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              التكاليف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">التكلفة التقديرية</span>
                <span className="font-semibold">
                  {Number(repair.estimated_cost).toLocaleString("ar-EG")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">تكلفة قطع الغيار</span>
                <span className="font-semibold">
                  {Number(repair.parts_cost).toLocaleString("ar-EG")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الدفعة المقدمة</span>
                <span className="font-semibold text-amber-600">
                  {Number(repair.deposit).toLocaleString("ar-EG")}
                </span>
              </div>
              {repair.payment_status && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">حالة الدفع</span>
                  <span className={`font-semibold ${repair.payment_status === "paid" ? "text-green-600" : repair.payment_status === "partial" ? "text-amber-600" : "text-destructive"}`}>
                    {PAYMENT_STATUS_OPTIONS[repair.payment_status]?.label || repair.payment_status}
                  </span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between text-sm">
                <span className="font-semibold">المتبقي</span>
                <span
                  className={`font-bold ${totalRemaining > 0 ? "text-destructive" : "text-green-600"}`}
                >
                  {totalRemaining.toLocaleString("ar-EG")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RepairDetails;
