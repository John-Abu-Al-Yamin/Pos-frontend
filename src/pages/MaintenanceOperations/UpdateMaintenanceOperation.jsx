import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import AddEditHeader from "@/customs/AddEditHeader";
import Loading from "@/customs/Loading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  useGetMaintenanceOperationById,
  useUpdateMaintenanceOperations,
} from "@/hooks/Actions/MaintenanceOperations/useCurdsMaintenanceOperations";

const updateOperationSchema = z.object({
  description: z
    .string()
    .min(1, { message: "يرجى إدخال العملية" }),
  operation_date: z
    .string()
    .min(1, { message: "يرجى إدخال التاريخ" }),
  technician: z
    .string()
    .optional(),
  cost: z
    .string()
    .optional(),
  notes: z
    .string()
    .optional(),
});

const UpdateMaintenanceOperation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const headerId = location.state?.headerId || id;

  const { data: operationData, isPending: isFetching } =
    useGetMaintenanceOperationById(headerId, id);
  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdateMaintenanceOperations(headerId, id);

  const operation = operationData?.data?.data;

  const form = useForm({
    resolver: zodResolver(updateOperationSchema),
    values: operation
      ? {
          description: operation.description || "",
          operation_date: operation.operation_date || "",
          technician: operation.technician || "",
          cost: operation.cost ?? "",
          notes: operation.notes || "",
        }
      : {
          description: "",
          operation_date: "",
          technician: "",
          cost: "",
          notes: "",
        },
  });

  const onSubmit = (formData) => {
    updateMutate(
      {
        data: {
          description: formData.description,
          operation_date: formData.operation_date,
          technician: formData.technician || undefined,
          cost: formData.cost ? Number(formData.cost) : undefined,
          notes: formData.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          navigate(`/maintenance-tickets/details/${headerId}`);
        },
      },
    );
  };

  if (isFetching) return <Loading />;

  return (
    <div>
      <AddEditHeader
        title="تعديل عملية صيانة"
        description="تحديث بيانات عملية الصيانة"
        backPath={`/maintenance-tickets/details/${headerId}`}
        backText="رجوع"
      />

      <div className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">العملية</Label>
              <Input
                id="description"
                placeholder="مثال: تغيير شاشة، تنظيف داخلي"
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="operation_date">التاريخ</Label>
              <Input
                id="operation_date"
                type="date"
                {...form.register("operation_date")}
              />
              {form.formState.errors.operation_date && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.operation_date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="technician">الفني (اختياري)</Label>
              <Input
                id="technician"
                placeholder="اسم الفني"
                {...form.register("technician")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">التكلفة (اختياري)</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="any"
                {...form.register("cost")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات (اختياري)</Label>
            <Textarea id="notes" rows={3} {...form.register("notes")} />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "جاري التحديث..." : "تحديث"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/maintenance-tickets/details/${headerId}`)}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMaintenanceOperation;
