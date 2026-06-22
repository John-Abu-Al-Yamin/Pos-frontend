import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useAddSuppliers,
  useDeleteSuppliers,
  useGetAllSuppliers,
} from "@/hooks/Actions/suppliers/useCurdsSuppliers";
import usePutData from "@/hooks/curdsHook/usePutData";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import CustomHeader from "@/customs/CustomHeader";
import Loading from "@/customs/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { suppliersSchema } from "@/validation/suppliers/suppliers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppModalEdite from "@/customs/AppModalEdite";

const SuppliersPage = () => {
  const { data, isPending } = useGetAllSuppliers();
  const { mutate: addMutate, isPending: addIsPending, error: addError } = useAddSuppliers();
  const { mutate: updateMutate, isPending: updateIsPending, error: updateError } = usePutData(
    endPoints.suppliers,
    [queryKeys.updatesuppliers],
    [queryKeys.suppliers, queryKeys.updatesuppliers],
  );
  const { mutate: deleteMutate } = useDeleteSuppliers();

  const [editingSupplier, setEditingSupplier] = React.useState(null);

  const form = useForm({
    resolver: zodResolver(suppliersSchema),
    defaultValues: { name: "", phone: "" },
  });

  const editForm = useForm({
    resolver: zodResolver(suppliersSchema),
    defaultValues: { name: "", phone: "" },
  });

  const onSubmit = (formData) => {
    addMutate({ data: formData }, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const onEditSubmit = (formData) => {
    updateMutate({ data: formData, url: `${endPoints.suppliers}/${editingSupplier.id}` }, {
      onSuccess: () => {
        editForm.reset();
        setEditingSupplier(null);
      },
    });
  };

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    editForm.reset({ name: supplier.name, phone: supplier.phone });
  };

  const confirmDelete = (supplierId) => {
    toast("هل أنت متأكد من الحذف؟", {
      action: {
        label: "نعم",
        onClick: () => deleteMutate({ id: supplierId }),
      },
      duration: Infinity,
    });
  };

  if (isPending) return <Loading />;

  const suppliers = data?.data?.data ?? [];

  return (
    <div>
      <CustomHeader
        title="الموردين"
        description="قائمة الموردين"
        buttonText="اضافة مورد"
        addModal={{
          title: "اضافة مورد",
          description: "ادخل بيانات المورد",
          onSubmit: form.handleSubmit(onSubmit),
          isLoading: addIsPending,
          error: addError?.response?.data?.errors?.map(e => e.message),
          submitText: "حفظ",
          children: (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المورد</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input id="phone" {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>
          ),
        }}
      />

      <AppModalEdite
        open={!!editingSupplier}
        onOpenChange={(open) => { if (!open) { setEditingSupplier(null); editForm.reset(); } }}
        title="تعديل المورد"
        description="تعديل تفاصيل المورد"
        onSubmit={editForm.handleSubmit(onEditSubmit)}
        isLoading={updateIsPending}
        error={updateError?.response?.data?.errors?.map(e => e.message)}
        submitText="تحديث"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">اسم المورد</Label>
            <Input id="edit-name" {...editForm.register("name")} />
            {editForm.formState.errors.name && (
              <p className="text-sm text-destructive">{editForm.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">رقم الهاتف</Label>
            <Input id="edit-phone" {...editForm.register("phone")} />
            {editForm.formState.errors.phone && (
              <p className="text-sm text-destructive">{editForm.formState.errors.phone.message}</p>
            )}
          </div>
        </div>
      </AppModalEdite>

      <div className="grid gap-4 grid-cols-3">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                {supplier.name}
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => openEditModal(supplier)}>
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button size="icon" onClick={() => confirmDelete(supplier.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <p className="text-sm font-semibold text-black">{supplier.phone}</p>
              <div className="text-xs text-muted-foreground/80 font-medium">
                  {new Date(supplier.created_at).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuppliersPage;
