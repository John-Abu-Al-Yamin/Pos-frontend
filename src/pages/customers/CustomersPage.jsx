import React from "react";
import { Pencil, Trash2, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  useAddCustomers,
  useDeleteCustomers,
  useGetAllCustomers,
} from "@/hooks/Actions/customers/useCurdsCustomers";
import usePutData from "@/hooks/curdsHook/usePutData";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import CustomHeader from "@/customs/CustomHeader";
import Loading from "@/customs/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { customersSchema } from "@/validation/customers/customers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppModalEdite from "@/customs/AppModalEdite";
import CustomPagination from "@/customs/CustomPagination";
import { formatDate } from "@/lib/utils";

const CustomersPage = () => {
  const [page, setPage] = React.useState(1);
  const per_page = 12;

  const { data, isPending } = useGetAllCustomers(page, per_page);
  const {
    mutate: addMutate,
    isPending: addIsPending,
    error: addError,
  } = useAddCustomers();
  const {
    mutate: updateMutate,
    isPending: updateIsPending,
    error: updateError,
  } = usePutData(
    endPoints.customers,
    [queryKeys.updatecustomers],
    [queryKeys.customers, queryKeys.updatecustomers],
  );
  const { mutate: deleteMutate } = useDeleteCustomers();

  const [editingCustomer, setEditingCustomer] = React.useState(null);

  const form = useForm({
    resolver: zodResolver(customersSchema),
    defaultValues: { name: "", phone: "" },
  });

  const editForm = useForm({
    resolver: zodResolver(customersSchema),
    defaultValues: { name: "", phone: "" },
  });

  const onSubmit = (formData) => {
    addMutate(
      { data: formData },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  const onEditSubmit = (formData) => {
    updateMutate(
      { data: formData, url: `${endPoints.customers}/${editingCustomer.id}` },
      {
        onSuccess: () => {
          editForm.reset();
          setEditingCustomer(null);
        },
      },
    );
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    editForm.reset({
      name: customer.name,
      phone: customer.phone ?? "",
      email: customer.email ?? "",
    });
  };

  const confirmDelete = (customerId) => {
    toast("هل أنت متأكد من الحذف؟", {
      action: {
        label: "نعم",
        onClick: () => deleteMutate({ id: customerId }),
      },
      duration: Infinity,
    });
  };

  if (isPending) return <Loading />;

  const customers = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div>
      <CustomHeader
        title="العملاء"
        description="قائمة العملاء"
        buttonText="عميل جديد"
        addModal={{
          title: "إضافة عميل جديد",
          description: "أدخل بيانات العميل",
          onSubmit: form.handleSubmit(onSubmit),
          isLoading: addIsPending,
          error: addError?.response?.data?.errors?.map((e) => e.message),
          submitText: "حفظ",
          children: (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم العميل</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input id="phone" {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          ),
        }}
      />

      <AppModalEdite
        open={!!editingCustomer}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCustomer(null);
            editForm.reset();
          }
        }}
        title="تعديل العميل"
        description="تعديل بيانات العميل"
        onSubmit={editForm.handleSubmit(onEditSubmit)}
        isLoading={updateIsPending}
        error={updateError?.response?.data?.errors?.map((e) => e.message)}
        submitText="تحديث"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">اسم العميل</Label>
            <Input id="edit-name" {...editForm.register("name")} />
            {editForm.formState.errors.name && (
              <p className="text-sm text-destructive">
                {editForm.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">رقم الهاتف</Label>
            <Input id="edit-phone" {...editForm.register("phone")} />
            {editForm.formState.errors.phone && (
              <p className="text-sm text-destructive">
                {editForm.formState.errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </AppModalEdite>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                {customer.name}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditModal(customer)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button size="icon" onClick={() => confirmDelete(customer.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              {customer.phone && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span dir="ltr">{customer.phone}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}
              <div className="text-xs text-muted-foreground/80 font-medium pt-1">
                {formatDate(customer.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <CustomPagination
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default CustomersPage;
