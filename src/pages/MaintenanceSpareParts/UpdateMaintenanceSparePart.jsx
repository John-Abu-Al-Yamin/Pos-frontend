import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import AddEditHeader from "@/customs/AddEditHeader";
import Loading from "@/customs/Loading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  useGetMaintenanceUsedPartById,
  useUpdateMaintenanceUsedParts,
} from "@/hooks/Actions/MaintenanceSpareParts/useCurdsMaintenanceSpareParts";
import { formatCurrency } from "@/lib/utils";

const updateUsedPartSchema = z.object({
  quantity: z
    .string()
    .min(1, { message: "يرجى إدخال الكمية" }),
});

const UpdateMaintenanceSparePart = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const headerId = location.state?.headerId || id;

  const { data: partData, isPending: isFetching } =
    useGetMaintenanceUsedPartById(headerId, id);
  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdateMaintenanceUsedParts(headerId, id);

  const part = partData?.data?.data;

  const form = useForm({
    resolver: zodResolver(updateUsedPartSchema),
    values: part
      ? { quantity: String(part.quantity) }
      : { quantity: "" },
  });

  const onSubmit = (formData) => {
    updateMutate(
      { data: { quantity: Number(formData.quantity) } },
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
        title="تعديل قطعة غيار"
        description="تحديث كمية قطعة الغيار — السعر محتسب تلقائياً"
        backPath={`/maintenance-tickets/details/${headerId}`}
        backText="رجوع"
      />

      <div className="p-6">
        {part && (
          <div className="mb-6 rounded-lg border bg-muted/30 p-4 space-y-1">
            <p className="text-sm">
              <span className="font-medium">قطعة الغيار: </span>
              {part.product?.name || "—"}
            </p>
            <p className="text-sm">
              <span className="font-medium">سعر الوحدة: </span>
              {formatCurrency(part.unit_price)}
            </p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="max-w-xs space-y-2">
            <Label htmlFor="quantity">الكمية الجديدة</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              step="any"
              {...form.register("quantity")}
            />
            {form.formState.errors.quantity && (
              <p className="text-sm text-destructive">
                {form.formState.errors.quantity.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "جاري التحديث..." : "تحديث"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(`/maintenance-tickets/details/${headerId}`)
              }
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMaintenanceSparePart;
