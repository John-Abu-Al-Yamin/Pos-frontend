import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useAddCategories,
  useDeleteCategories,
  useGetAllCategories,
} from "@/hooks/Actions/Categories/useCurdsCategories";
import usePutData from "@/hooks/curdsHook/usePutData";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import CustomHeader from "@/customs/CustomHeader";
import LoadingSkeleton from "@/customs/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categorySchema } from "@/validation/category/category";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppModalEdite from "@/customs/AppModalEdite";
import Loading from "@/customs/Loading";

const CategoryPage = () => {
  const { data, isPending } = useGetAllCategories();
  const { mutate: addMutate, isPending: addIsPending, error: addError } = useAddCategories();
  const { mutate: updateMutate, isPending: updateIsPending, error: updateError } = usePutData(
    endPoints.categories,
    [queryKeys.updatecategories],
    [queryKeys.categories, queryKeys.updatecategories],
  );
  const { mutate: deleteMutate } = useDeleteCategories();

  const [editingCategory, setEditingCategory] = React.useState(null);

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  const editForm = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (formData) => {
    addMutate({ data: formData }, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const onEditSubmit = (formData) => {
    updateMutate({ data: formData, url: `${endPoints.categories}/${editingCategory.id}` }, {
      onSuccess: () => {
        editForm.reset();
        setEditingCategory(null);
      },
    });
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    editForm.reset({ name: category.name });
  };

  const confirmDelete = (categoryId) => {
    toast("هل أنت متأكد من الحذف؟", {
      action: {
        label: "نعم",
        onClick: () => deleteMutate({ id: categoryId }),
      },
      duration: Infinity,
    });
  };

  if (isPending) return <Loading />;

  const categories = data?.data?.data ?? [];

  return (
    <div>
      <CustomHeader
        title="التصنيفات"
        description="قائمة التصنيفات"
        buttonText="تصنيف جديد"
        addModal={{
          title: "إضافة تصنيف جديد",
          description: "أدخل بيانات التصنيف",
          onSubmit: form.handleSubmit(onSubmit),
          isLoading: addIsPending,
          error: addError?.response?.data?.errors?.map(e => e.message),
          submitText: "حفظ",
          children: (
            <div className="space-y-2">
              <Label htmlFor="name">اسم التصنيف</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
          ),
        }}
      />

      <AppModalEdite
        open={!!editingCategory}
        onOpenChange={(open) => { if (!open) { setEditingCategory(null); editForm.reset(); } }}
        title="تعديل التصنيف"
        description="قم بتعديل اسم التصنيف"
        onSubmit={editForm.handleSubmit(onEditSubmit)}
        isLoading={updateIsPending}
        error={updateError?.response?.data?.errors?.map(e => e.message)}
        submitText="تحديث"
      >
        <div className="space-y-2">
          <Label htmlFor="edit-name">اسم التصنيف</Label>
          <Input id="edit-name" {...editForm.register("name")} />
          {editForm.formState.errors.name && (
            <p className="text-sm text-destructive">{editForm.formState.errors.name.message}</p>
          )}
        </div>
      </AppModalEdite>

      <div className="grid gap-4 grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                {category.name}
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => openEditModal(category)}>
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button size="icon" onClick={() => confirmDelete(category.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-gray-400">
                {new Date(category.created_at).toLocaleDateString("ar-EG")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
