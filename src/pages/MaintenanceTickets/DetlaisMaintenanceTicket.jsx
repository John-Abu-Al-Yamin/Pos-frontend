import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import AddEditHeader from "@/customs/AddEditHeader";
import Loading from "@/customs/Loading";
import InfoCard from "@/customs/InfoCard";
import ProductSearchCombobox from "@/customs/ProductSearchCombobox";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetMaintenanceTicketById,
  useUpdateMaintenanceTickets,
  useUpdateMaintenanceStatus,
} from "@/hooks/Actions/MaintenanceTickets/useCurdsMaintenanceTickets";
import { useDeleteMaintenanceOperations } from "@/hooks/Actions/MaintenanceOperations/useCurdsMaintenanceOperations";
import { useAddMaintenanceUsedParts } from "@/hooks/Actions/MaintenanceSpareParts/useCurdsMaintenanceSpareParts";
import { useDeleteMaintenanceUsedParts } from "@/hooks/Actions/MaintenanceSpareParts/useCurdsMaintenanceSpareParts";
import { formatCurrency } from "@/lib/utils";
import {
  Plus,
  Pencil,
  Trash2,
  Smartphone,
  User,
  Hash,
  DollarSign,
  CreditCard,
  CalendarClock,
  Wrench,
  Package,
} from "lucide-react";

const statusConfig = {
  pending: {
    label: "قيد الانتظار",
    className: "bg-yellow-100 text-yellow-800",
  },
  under_repair: {
    label: "قيد الإصلاح",
    className: "bg-blue-100 text-blue-800",
  },
  waiting_parts: {
    label: "بانتظار قطع الغيار",
    className: "bg-purple-100 text-purple-800",
  },
  repaired: { label: "تم الإصلاح", className: "bg-green-100 text-green-800" },
  delivered: { label: "تم التسليم", className: "bg-gray-100 text-gray-800" },
  cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
};

const statusTransitions = {
  pending: ["under_repair", "cancelled"],
  under_repair: ["waiting_parts", "repaired", "cancelled"],
  waiting_parts: ["under_repair", "cancelled"],
  repaired: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

const DetlaisMaintenanceTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending, refetch } = useGetMaintenanceTicketById(id);
  const { mutate: updateHeaderMutate } = useUpdateMaintenanceTickets(id);
  const { mutate: deleteOperationMutate } = useDeleteMaintenanceOperations(id);
  const { mutate: addUsedPartMutate } = useAddMaintenanceUsedParts();
  const { mutate: deleteUsedPartMutate } = useDeleteMaintenanceUsedParts(id);
  const { mutate: updateStatusMutate } = useUpdateMaintenanceStatus();

  const [showAddPart, setShowAddPart] = useState(false);
  const [newPartProduct, setNewPartProduct] = useState(null);
  const [newPartQty, setNewPartQty] = useState("1");

  const [editingAdvance, setEditingAdvance] = useState(false);
  const [advanceValue, setAdvanceValue] = useState("");

  const confirmDeleteOperation = (operationId) => {
    toast("هل أنت متأكد من حذف هذه العملية؟", {
      action: {
        label: "نعم",
        onClick: () =>
          deleteOperationMutate(
            { operationId },
            { onSuccess: () => refetch() },
          ),
      },
      duration: Infinity,
    });
  };

  const confirmDeleteUsedPart = (partId) => {
    toast(
      "هل أنت متأكد من حذف قطعة الغيار هذه؟ سيتم إعادة الكمية إلى المخزون.",
      {
        action: {
          label: "نعم",
          onClick: () =>
            deleteUsedPartMutate({ partId }, { onSuccess: () => refetch() }),
        },
        duration: Infinity,
      },
    );
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus === ticket.status) return;
    updateStatusMutate(id, newStatus, {
      onSuccess: () => refetch(),
    });
  };

  const handleAddPart = () => {
    if (!newPartProduct || !newPartQty || Number(newPartQty) <= 0) {
      toast.error("يرجى اختيار قطعة الغيار وإدخال كمية صحيحة");
      return;
    }

    addUsedPartMutate(
      {
        headerId: Number(id),
        data: {
          product_id: Number(newPartProduct.id),
          quantity: Number(newPartQty),
        },
      },
      {
        onSuccess: () => {
          setNewPartProduct(null);
          setNewPartQty("1");
          setShowAddPart(false);
          refetch();
        },
      },
    );
  };

  const handleSaveAdvance = () => {
    const val = parseFloat(advanceValue);
    if (isNaN(val) || val < 0) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }

    updateHeaderMutate(
      { data: { advance_payment: val } },
      {
        onSuccess: () => {
          setEditingAdvance(false);
          refetch();
        },
      },
    );
  };

  if (isPending) return <Loading />;

  const ticket = data?.data?.data;
  if (!ticket) return null;

  const status = statusConfig[ticket.status] || statusConfig.pending;
  const allowedTransitions = statusTransitions[ticket.status] || [];
  const canMutate = !["delivered", "cancelled"].includes(ticket.status);
  const device = ticket.maintenance_device;

  const partsTotal =
    ticket.parts_total ?? ticket.used_parts_sum_total_price ?? 0;
  const laborCost = ticket.labor_cost ?? ticket.operations_sum_cost ?? 0;
  const grandTotal = ticket.grand_total ?? ticket.total_cost ?? 0;
  const remainingAmount =
    ticket.remaining_amount ??
    Math.max(0, grandTotal - (ticket.advance_payment || 0));

  return (
    <div>
      <AddEditHeader
        title={`تذكرة صيانة رقم ${ticket.ticket_number}`}
        description={ticket.problem_description || "لا توجد ملاحظات"}
        backPath="/maintenance-tickets"
        backText="رجوع"
      />

      <div className="p-6 mb-6">
        {canMutate && (allowedTransitions.length > 0) && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium text-muted-foreground">
              تغيير الحالة:
            </span>
            <div className="w-48">
              <Select value={ticket.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[ticket.status, ...allowedTransitions].map((st) => (
                    <SelectItem key={st} value={st}>
                      {statusConfig[st]?.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <InfoCard
            icon={Hash}
            label="رقم التذكرة"
            value={ticket.ticket_number}
          />
          <InfoCard
            icon={User}
            label="العميل"
            value={ticket.customer?.name || "—"}
            accent
          />
          <InfoCard
            icon={Smartphone}
            label="نوع الجهاز"
            value={device?.device_type || "—"}
            accent
          />
          <InfoCard
            icon={Hash}
            label="العلامة التجارية"
            value={device?.brand || "—"}
          />
          <InfoCard icon={Hash} label="الموديل" value={device?.model || "—"} />
          <InfoCard
            icon={Hash}
            label="الرقم التسلسلي"
            value={device?.serial_number || "—"}
          />
          <InfoCard icon={Hash} label="اللون" value={device?.color || "—"} />
          <InfoCard
            icon={CalendarClock}
            label="تاريخ الاستلام"
            value={ticket.received_date || "—"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">الحالة</p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">أنشئ بواسطة</p>
            <p className="text-sm font-medium">
              {ticket.created_by?.name || "—"}
            </p>
          </div>
          {ticket.delivery_date && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                تاريخ التسليم المتوقع
              </p>
              <p className="text-sm font-medium">{ticket.delivery_date}</p>
            </div>
          )}
        </div>

        {device?.condition_notes && (
          <div className="space-y-1 mb-6">
            <p className="text-xs text-muted-foreground">ملاحظات حالة الجهاز</p>
            <p className="text-sm font-medium">{device.condition_notes}</p>
          </div>
        )}
      </div>

      <div className="space-y-8 px-6 pb-8">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              عمليات الصيانة
            </h2>
            {canMutate && (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate(`/maintenance-operations/add/${id}`)}
              >
                <Plus className="h-4 w-4" />
                إضافة عملية
              </Button>
            )}
          </div>

          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">#</TableHead>
                  <TableHead className="text-right">العملية</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الفني</TableHead>
                  <TableHead className="text-right">التكلفة</TableHead>
                  <TableHead className="text-right">ملاحظات</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ticket.operations?.map((op, index) => (
                  <TableRow key={op.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{op.description}</TableCell>
                    <TableCell>{op.operation_date || "—"}</TableCell>
                    <TableCell>{op.technician || "—"}</TableCell>
                    <TableCell>
                      {op.cost ? formatCurrency(op.cost) : "—"}
                    </TableCell>
                    <TableCell>{op.notes || "—"}</TableCell>
                    <TableCell>
                      {canMutate && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/maintenance-operations/update/${op.id}`,
                                { state: { headerId: id } },
                              )
                            }
                          >
                            <Pencil className="h-4 w-4" />
                            تعديل
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDeleteOperation(op.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            حذف
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(!ticket.operations || ticket.operations.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      لا توجد عمليات صيانة
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              قطع الغيار المستخدمة
            </h2>
            {canMutate && (
              <div className="flex items-center gap-2">
                {!showAddPart && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setShowAddPart(true);
                      setNewPartProduct(null);
                      setNewPartQty("1");
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    إضافة قطعة غيار
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/maintenance-used-parts/add/${id}`)}
                >
                  <Package className="h-4 w-4" />
                  إضافة (قائمة كاملة)
                </Button>
              </div>
            )}
          </div>

          {canMutate && showAddPart && (
            <div className="mb-4 rounded-lg border bg-muted/30 p-4">
              <div className="flex flex-col sm:flex-row items-end gap-3">
                <div className="flex-1 space-y-1">
                  <Label>قطعة الغيار</Label>
                  <ProductSearchCombobox
                    value={newPartProduct?.id}
                    onSelect={(product) => setNewPartProduct(product)}
                    placeholder="اختر قطعة الغيار..."
                    productType="spare_part"
                  />
                </div>
                <div className="w-24 space-y-1">
                  <Label>الكمية</Label>
                  <Input
                    type="number"
                    min="1"
                    step="any"
                    value={newPartQty}
                    onChange={(e) => setNewPartQty(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleAddPart}>
                    إضافة
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowAddPart(false);
                      setNewPartProduct(null);
                      setNewPartQty("1");
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
              {newPartProduct && (
                <p className="mt-2 text-xs text-muted-foreground">
                  سيتم احتساب السعر تلقائياً عند الإضافة
                </p>
              )}
            </div>
          )}

          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">#</TableHead>
                  <TableHead className="text-right">قطعة الغيار</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                  <TableHead className="text-right">سعر الوحدة</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ticket.used_parts?.map((part, index) => (
                  <TableRow key={part.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{part.product?.name || "—"}</TableCell>
                    <TableCell>{part.quantity}</TableCell>
                    <TableCell>{formatCurrency(part.unit_price)}</TableCell>
                    <TableCell>{formatCurrency(part.total_price)}</TableCell>
                    <TableCell>
                      {canMutate && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/maintenance-used-parts/update/${part.id}`,
                                { state: { headerId: id } },
                              )
                            }
                          >
                            <Pencil className="h-4 w-4" />
                            تعديل
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDeleteUsedPart(part.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            حذف
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(!ticket.used_parts || ticket.used_parts.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      لا توجد قطع غيار
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">ملخص الفاتورة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
              <p className="text-xs font-medium text-blue-600 mb-1">
                إجمالي قطع الغيار
              </p>
              <p className="text-xl font-bold text-blue-700">
                {formatCurrency(partsTotal)}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4 border border-green-100">
              <p className="text-xs font-medium text-green-600 mb-1">
                تكلفة العمالة
              </p>
              <p className="text-xl font-bold text-green-700">
                {formatCurrency(laborCost)}
              </p>
            </div>
            <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
              <p className="text-xs font-medium text-primary mb-1">
                الإجمالي الكلي
              </p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(grandTotal)}
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 border border-purple-100">
              <p className="text-xs font-medium text-purple-600 mb-1">
                المدفوع مقدمًا
              </p>
              {canMutate && editingAdvance ? (
                <div className="flex items-center gap-1 mt-1">
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    value={advanceValue}
                    onChange={(e) => setAdvanceValue(e.target.value)}
                    className="h-8 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="default"
                    className="h-8 px-2"
                    onClick={handleSaveAdvance}
                  >
                    حفظ
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2"
                    onClick={() => setEditingAdvance(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xl font-bold text-purple-700">
                    {formatCurrency(ticket.advance_payment || 0)}
                  </p>
                  {canMutate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1"
                      onClick={() => {
                        setAdvanceValue(String(ticket.advance_payment || ""));
                        setEditingAdvance(true);
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="rounded-lg bg-amber-50 p-4 border border-amber-100">
              <p className="text-xs font-medium text-amber-600 mb-1">
                المبلغ المتبقي
              </p>
              <p className="text-xl font-bold text-amber-700">
                {formatCurrency(remainingAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetlaisMaintenanceTicket;
