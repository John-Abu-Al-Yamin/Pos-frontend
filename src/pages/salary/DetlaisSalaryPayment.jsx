import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, CheckCheck, XCircle, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AddEditHeader from "@/customs/AddEditHeader";
import Loading from "@/customs/Loading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetSalaryPaymentById,
  useConfirmSalaryPayment,
  useCancelSalaryPayment,
} from "@/hooks/Actions/Salary/useCurdsSalaryPayments";
import {
  useAddSalaryPaymentItem,
  useUpdateSalaryPaymentItem,
  useDeleteSalaryPaymentItem,
} from "@/hooks/Actions/Salary/useCurdsSalaryPaymentItems";
import { salaryPaymentItemSchema } from "@/validation/salaryPaymentItem/salaryPaymentItem";
import { formatDate, formatCurrency } from "@/lib/utils";

const statusConfig = {
  draft: { label: "مسودة", className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "مؤكد", className: "bg-green-100 text-green-800" },
  cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
};

const itemTypeLabels = {
  base_salary: "الراتب الأساسي",
  overtime: "عمل إضافي",
  bonus: "مكافأة",
  commission: "عمولة",
  adjustment: "تعديل",
  deduction: "خصم",
  advance_repayment: "سلفة",
};

const itemTypeOptions = [
  { value: "overtime", label: "عمل إضافي" },
  { value: "bonus", label: "مكافأة" },
  { value: "commission", label: "عمولة" },
  { value: "adjustment", label: "تعديل" },
  { value: "deduction", label: "خصم" },
  { value: "advance_repayment", label: "سلفة" },
];

const DetlaisSalaryPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending, refetch } = useGetSalaryPaymentById(id);
  const { mutate: confirmMutate, isPending: isConfirming } = useConfirmSalaryPayment();
  const { mutate: cancelMutate } = useCancelSalaryPayment();
  const { mutate: addItemMutate, isPending: isAddingItem } = useAddSalaryPaymentItem();
  const { mutate: updateItemMutate, isPending: isUpdatingItem } = useUpdateSalaryPaymentItem();
  const { mutate: deleteItemMutate } = useDeleteSalaryPaymentItem();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const payment = data?.data?.data;
  const isDraft = payment?.status === "draft";
  const isConfirmed = payment?.status === "confirmed";

  // Item form
  const itemForm = useForm({
    resolver: zodResolver(salaryPaymentItemSchema),
    defaultValues: {
      type: "",
      label: "",
      amount: "",
    },
  });

  const openAddItem = () => {
    setEditingItem(null);
    itemForm.reset({ type: "", label: "", amount: "" });
    setIsItemDialogOpen(true);
  };

  const openEditItem = (item) => {
    if (item.type === "base_salary") return;
    setEditingItem(item);
    itemForm.reset({
      type: item.type,
      label: item.label,
      amount: String(item.amount),
    });
    setIsItemDialogOpen(true);
  };

  const handleItemSubmit = (formData) => {
    const payload = {
      type: formData.type,
      label: formData.label,
      amount: Number(formData.amount),
    };

    if (editingItem) {
      updateItemMutate(
        id,
        editingItem.id,
        { data: payload },
        {
          onSuccess: () => {
            setIsItemDialogOpen(false);
            refetch();
          },
        },
      );
    } else {
      addItemMutate(
        id,
        { data: payload },
        {
          onSuccess: () => {
            setIsItemDialogOpen(false);
            refetch();
          },
        },
      );
    }
  };

  const confirmDeleteItem = (itemId) => {
    toast("هل أنت متأكد من حذف هذا البند؟", {
      action: {
        label: "نعم",
        onClick: () => deleteItemMutate(id, itemId, { onSuccess: () => refetch() }),
      },
      duration: Infinity,
    });
  };

  const handleConfirm = () => {
    confirmMutate(id, {
      onSuccess: () => {
        setIsConfirmDialogOpen(false);
        refetch();
      },
    });
  };

  const handleCancel = () => {
    cancelMutate(id, {
      onSuccess: () => {
        setIsCancelDialogOpen(false);
        refetch();
      },
    });
  };

  if (isPending) return <Loading />;
  if (!payment) return null;

  const status = statusConfig[payment.status] || statusConfig.draft;
  const items = payment.items || [];

  return (
    <div>
      <AddEditHeader
        title={`دفعة راتب ${payment.payment_number}`}
        description={payment.user?.name || ""}
        backPath="/salary-payments"
        backText="رجوع"
      />

      {/* Payment Info */}
      <div className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">رقم الدفعة</p>
            <p className="text-sm font-medium font-mono">{payment.payment_number}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">الموظف</p>
            <p className="text-sm font-medium">{payment.user?.name || "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">الحالة</p>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
              {status.label}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">تاريخ الدفع</p>
            <p className="text-sm font-medium">{payment.payment_date ? formatDate(payment.payment_date) : "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">المبلغ الإجمالي</p>
            <p className="text-sm font-bold">{formatCurrency(payment.total_amount)}</p>
          </div>
          {isConfirmed && payment.confirmed_at && (
            <>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">تاريخ التأكيد</p>
                <p className="text-sm font-medium">{formatDate(payment.confirmed_at)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">تم التأكيد بواسطة</p>
                <p className="text-sm font-medium">{payment.confirmed_by_user?.name || "—"}</p>
              </div>
            </>
          )}
          {payment.notes && (
            <div className="space-y-1 md:col-span-2 lg:col-span-3">
              <p className="text-xs text-muted-foreground">ملاحظات</p>
              <p className="text-sm font-medium">{payment.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 px-6 mb-6">
        {isDraft && (
          <>
            <Button variant="default" size="sm" onClick={() => setIsConfirmDialogOpen(true)} disabled={isConfirming}>
              <CheckCheck className="h-4 w-4" />
              {isConfirming ? "جاري التأكيد..." : "تأكيد"}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsCancelDialogOpen(true)}>
              <XCircle className="h-4 w-4" />
              إلغاء
            </Button>
          </>
        )}
      </div>

      {/* Items Section */}
      <div className="px-6 pb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">بنود الدفعة</h2>
          {isDraft && (
            <Button variant="default" size="sm" onClick={openAddItem}>
              <Plus className="h-4 w-4" />
              إضافة بند
            </Button>
          )}
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">#</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الوصف</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                {isDraft && <TableHead className="text-right">الإجراءات</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                const isAddition = !["deduction", "advance_repayment"].includes(item.type);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {isAddition ? (
                          <ArrowUp className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5 text-red-600" />
                        )}
                        <span className={isAddition ? "text-green-700" : "text-red-700"}>
                          {itemTypeLabels[item.type] || item.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className={isAddition ? "text-green-700" : "text-red-700"}>
                      {isAddition ? "+" : "-"}{formatCurrency(item.amount)}
                    </TableCell>
                    {isDraft && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.type === "base_salary" ? (
                            <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-medium">
                              بند نظامي
                            </span>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" onClick={() => openEditItem(item)}>
                                <Pencil className="h-4 w-4" />
                                تعديل
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => confirmDeleteItem(item.id)}>
                                <Trash2 className="h-4 w-4" />
                                حذف
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isDraft ? 5 : 4} className="h-24 text-center text-muted-foreground">
                    لا توجد بنود
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={itemForm.handleSubmit(handleItemSubmit)}>
            <DialogHeader>
              <DialogTitle>{editingItem ? "تعديل بند" : "إضافة بند"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "تحديث بيانات البند" : "أدخل بيانات البند الجديد"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>النوع</Label>
                  <Controller
                    name="type"
                    control={itemForm.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemTypeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {itemForm.formState.errors.type && (
                    <p className="text-sm text-destructive">{itemForm.formState.errors.type.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>المبلغ</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...itemForm.register("amount")}
                  />
                  {itemForm.formState.errors.amount && (
                    <p className="text-sm text-destructive">{itemForm.formState.errors.amount.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input placeholder="وصف البند" {...itemForm.register("label")} />
                {itemForm.formState.errors.label && (
                  <p className="text-sm text-destructive">{itemForm.formState.errors.label.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isAddingItem || isUpdatingItem}>
                {editingItem ? "تحديث" : "إضافة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الدفعة</AlertDialogTitle>
            <AlertDialogDescription>
              تأكيد هذه الدفعة يعني أن الموظف قد استلم الراتب. سيتم تعيين تاريخ الدفع تلقائياً ولن يمكن تغييره.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>تراجع</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="bg-primary">
              تأكيد
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">إلغاء الدفعة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من إلغاء هذه الدفعة؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>تراجع</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              تأكيد الإلغاء
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DetlaisSalaryPayment;
