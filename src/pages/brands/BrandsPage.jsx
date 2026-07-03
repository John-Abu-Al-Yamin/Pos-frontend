import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useAddBrands,
  useDeleteBrands,
  useGetAllBrands,
} from "@/hooks/Actions/brands/useCurdsBrands";
import usePutData from "@/hooks/curdsHook/usePutData";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import CustomHeader from "@/customs/CustomHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { brandSchema } from "@/validation/brands/brands";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppModalEdite from "@/customs/AppModalEdite";
import Loading from "@/customs/Loading";
import { formatDate } from "@/lib/utils";

const BrandsPage = () => {
  const { data, isPending } = useGetAllBrands();
  const { mutate: addMutate, isPending: addIsPending, error: addError } = useAddBrands();
  const { mutate: updateMutate, isPending: updateIsPending, error: updateError } = usePutData(
    endPoints.brands,
    [queryKeys.updatebrands],
    [queryKeys.brands, queryKeys.updatebrands],
  );
  const { mutate: deleteMutate } = useDeleteBrands();

  const [editingBrand, setEditingBrand] = React.useState(null);

  const form = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: "" },
  });

  const editForm = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (formData) => {
    addMutate({ data: formData }, {
      onSuccess: () => { form.reset(); },
    });
  };

  const onEditSubmit = (formData) => {
    updateMutate({ data: formData, url: `${endPoints.brands}/${editingBrand.id}` }, {
      onSuccess: () => { editForm.reset(); setEditingBrand(null); },
    });
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    editForm.reset({ name: brand.name });
  };

  const confirmDelete = (brandId) => {
    toast("هل أنت متأكد من الحذف؟", {
      action: { label: "نعم", onClick: () => deleteMutate({ id: brandId }) },
      duration: Infinity,
    });
  };

  if (isPending) return <Loading />;

  const brands = data?.data?.data ?? [];

  return (
    <div>
      <CustomHeader
        title="العلامات التجارية"
        description="قائمة العلامات التجارية"
        buttonText="علامة تجارية"
        addModal={{
          title: "إضافة علامة تجارية جديدة",
          description: "أدخل بيانات العلامة التجارية",
          onSubmit: form.handleSubmit(onSubmit),
          isLoading: addIsPending,
          error: addError?.response?.data?.errors?.map(e => e.message),
          submitText: "حفظ",
          children: (
            <div className="space-y-2">
              <Label htmlFor="name">اسم العلامة التجارية</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
          ),
        }}
      />

      <AppModalEdite
        open={!!editingBrand}
        onOpenChange={(open) => { if (!open) { setEditingBrand(null); editForm.reset(); } }}
        title="تعديل العلامة التجارية"
        description="قم بتعديل اسم العلامة التجارية"
        onSubmit={editForm.handleSubmit(onEditSubmit)}
        isLoading={updateIsPending}
        error={updateError?.response?.data?.errors?.map(e => e.message)}
        submitText="تحديث"
      >
        <div className="space-y-2">
          <Label htmlFor="edit-name">اسم العلامة التجارية</Label>
          <Input id="edit-name" {...editForm.register("name")} />
          {editForm.formState.errors.name && (
            <p className="text-sm text-destructive">{editForm.formState.errors.name.message}</p>
          )}
        </div>
      </AppModalEdite>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {brands?.map((brand) => (
          <div key={brand.id} className="bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">{brand.name}</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => openEditModal(brand)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" onClick={() => confirmDelete(brand.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <div className="text-xs text-muted-foreground/80 font-medium">
                {formatDate(brand.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsPage;
