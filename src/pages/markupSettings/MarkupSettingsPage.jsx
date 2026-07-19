import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useAddMarkupSetting,
  useDeleteMarkupSetting,
  useGetAllMarkupSettings,
} from "@/hooks/Actions/markupSettings/useCurdsMarkupSettings";
import usePutData from "@/hooks/curdsHook/usePutData";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import CustomHeader from "@/customs/CustomHeader";
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
import { markupSettingSchema } from "@/validation/markupSettings/markupSettings";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppModalEdite from "@/customs/AppModalEdite";
import Loading from "@/customs/Loading";
import { formatDate } from "@/lib/utils";

const productTypeLabels = {
  new_mobile: "موبايل جديد",
  used_mobile: "موبايل مستعمل",
  accessory: "اكسسوار",
  spare_part: "قطعة غيار",
};

const MarkupSettingsPage = () => {
  const { data, isPending } = useGetAllMarkupSettings();
  const { mutate: addMutate, isPending: addIsPending, error: addError } = useAddMarkupSetting();
  const { mutate: updateMutate, isPending: updateIsPending, error: updateError } = usePutData(
    endPoints.markupSettings,
    [queryKeys.updateMarkupSettings],
    [queryKeys.markupSettings, queryKeys.updateMarkupSettings],
  );
  const { mutate: deleteMutate } = useDeleteMarkupSetting();

  const [editingSetting, setEditingSetting] = React.useState(null);

  const usedTypes = React.useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data.map((s) => s.product_type);
  }, [data]);

  const availableTypes = React.useMemo(() => {
    return ["new_mobile", "used_mobile", "accessory", "spare_part"].filter(
      (t) => !usedTypes.includes(t),
    );
  }, [usedTypes]);

  const form = useForm({
    resolver: zodResolver(markupSettingSchema),
    defaultValues: { product_type: undefined, profit_percentage: undefined },
  });

  const editForm = useForm({
    resolver: zodResolver(markupSettingSchema),
    defaultValues: { product_type: undefined, profit_percentage: undefined },
  });

  const onSubmit = (formData) => {
    addMutate({ data: formData }, {
      onSuccess: () => { form.reset(); },
    });
  };

  const onEditSubmit = (formData) => {
    updateMutate({ data: formData, url: `${endPoints.markupSettings}/${editingSetting.id}` }, {
      onSuccess: () => { editForm.reset(); setEditingSetting(null); },
    });
  };

  const openEditModal = (setting) => {
    setEditingSetting(setting);
    editForm.reset({
      product_type: setting.product_type,
      profit_percentage: setting.profit_percentage,
    });
  };

  const confirmDelete = (settingId) => {
    toast("هل أنت متأكد من الحذف؟", {
      action: { label: "نعم", onClick: () => deleteMutate({ id: settingId }) },
      duration: Infinity,
    });
  };

  if (isPending) return <Loading />;

  const settings = data?.data?.data ?? [];

  return (
    <div>
      <CustomHeader
        title="اعدادات الربح"
        description="حدد نسبة الربح لكل نوع منتج"
        buttonText="إعداد ربح"
        addModal={{
          title: "إضافة إعداد ربح جديد",
          description: "اختر نوع المنتج ونسبة الربح",
          onSubmit: form.handleSubmit(onSubmit),
          isLoading: addIsPending,
          error: addError?.response?.data?.errors?.map(e => e.message),
          submitText: "حفظ",
          children: (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product_type">نوع المنتج</Label>
                <Controller
                  name="product_type"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر نوع المنتج" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTypes.length === 0 ? (
                          <SelectItem value="__none__" disabled>
                            لا توجد انواع متاحة
                          </SelectItem>
                        ) : (
                          availableTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {productTypeLabels[type]}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.product_type && (
                  <p className="text-sm text-destructive">{form.formState.errors.product_type.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="profit_percentage">نسبة الربح (%)</Label>
                <Input
                  id="profit_percentage"
                  type="number"
                  step="0.01"
                  {...form.register("profit_percentage")}
                />
                {form.formState.errors.profit_percentage && (
                  <p className="text-sm text-destructive">{form.formState.errors.profit_percentage.message}</p>
                )}
              </div>
            </div>
          ),
        }}
      />

      <AppModalEdite
        open={!!editingSetting}
        onOpenChange={(open) => { if (!open) { setEditingSetting(null); editForm.reset(); } }}
        title="تعديل إعداد الربح"
        description="قم بتعديل نسبة الربح"
        onSubmit={editForm.handleSubmit(onEditSubmit)}
        isLoading={updateIsPending}
        error={updateError?.response?.data?.errors?.map(e => e.message)}
        submitText="تحديث"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>نوع المنتج</Label>
            <Input
              value={productTypeLabels[editingSetting?.product_type] || ""}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-profit_percentage">نسبة الربح (%)</Label>
            <Input
              id="edit-profit_percentage"
              type="number"
              step="0.01"
              {...editForm.register("profit_percentage")}
            />
            {editForm.formState.errors.profit_percentage && (
              <p className="text-sm text-destructive">{editForm.formState.errors.profit_percentage.message}</p>
            )}
          </div>
        </div>
      </AppModalEdite>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {settings?.map((setting) => (
          <div key={setting.id} className="bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                {productTypeLabels[setting.product_type] || setting.product_type}
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => openEditModal(setting)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" onClick={() => confirmDelete(setting.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <div className="text-lg font-semibold text-foreground">
                {setting.profit_percentage}%
              </div>
              <div className="text-xs text-muted-foreground/80 font-medium">
                {formatDate(setting.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarkupSettingsPage;
