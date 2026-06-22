import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomHeader from "@/customs/CustomHeader";
import {
  useAddProducts,
  useGetAllProducts,
  useDeleteProducts,
} from "@/hooks/Actions/Product/useCurdsProduct";
import { useGetAllCategories } from "@/hooks/Actions/Categories/useCurdsCategories";
import { productsSchema } from "@/validation/products/products";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Pencil, Trash2, Smartphone, Headphones, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AppModalEdite from "@/customs/AppModalEdite";
import Loading from "@/customs/Loading";
import usePutData from "@/hooks/curdsHook/usePutData";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";

const ProductPage = () => {
  const {
    mutate: addProducts,
    data: addProductsData,
    isPending: addIsPending,
    error: addError,
  } = useAddProducts();

  const { data: categoriesData } = useGetAllCategories(1, 100);
  const categories = categoriesData?.data?.data ?? [];

  const { data: productsData, isPending: getIsPending } = useGetAllProducts();
  const { mutate: deleteMutate } = useDeleteProducts();
  const {
    mutate: updateMutate,
    isPending: updateIsPending,
    error: updateError,
  } = usePutData(
    endPoints.products,
    [queryKeys.updateproducts],
    [queryKeys.products, queryKeys.updateproducts],
  );

  const [editingProduct, setEditingProduct] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [filters, setFilters] = React.useState({
    category_id: "",
    is_serialized: "",
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const form = useForm({
    resolver: zodResolver(productsSchema),
    defaultValues: {
      name: "",
      category_id: "",
      is_serialized: true,
    },
  });

  const editForm = useForm({
    resolver: zodResolver(productsSchema),
    defaultValues: {
      name: "",
      category_id: "",
      is_serialized: false,
    },
  });

  const onSubmit = (formData) => {
    addProducts(
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
      { data: formData, url: `${endPoints.products}/${editingProduct.id}` },
      {
        onSuccess: () => {
          editForm.reset();
          setEditingProduct(null);
        },
      },
    );
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    editForm.reset({
      name: product.name,
      category_id: String(product.category_id),
      is_serialized: Boolean(product.is_serialized),
    });
  };

  const confirmDelete = (productId) => {
    toast("هل أنت متأكد من الحذف؟", {
      action: {
        label: "نعم",
        onClick: () => deleteMutate({ id: productId }),
      },
      duration: Infinity,
    });
  };

  if (getIsPending) return <Loading />;

  const products = productsData?.data?.data ?? [];

  return (
    <div>
      <CustomHeader
        title="الموديلات"
        description="قائمة الموديلات"
        buttonText="موديل جديد"
        addModal={{
          title: "إضافة موديل جديد",
          description: "أدخل بيانات الموديل",
          onSubmit: form.handleSubmit(onSubmit),
          isLoading: addIsPending,
          error: addError?.response?.data?.errors?.map((e) => e.message),
          submitText: "حفظ",
          children: (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم الموديل</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">التصنيف</Label>
                <Controller
                  name="category_id"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر تصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.category_id && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.category_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>النوع</Label>
                <Controller
                  name="is_serialized"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex ">
                      <div className="inline-grid grid-cols-2 gap-3">
                        <div
                          onClick={() => field.onChange(true)}
                          className={`flex flex-col items-center gap-1.5 rounded-xl p-3 min-w-28 cursor-pointer select-none transition-all duration-200 ${
                            field.value === true
                              ? "bg-accent ring-2 ring-primary shadow-sm"
                              : "ring-1 ring-border hover:ring-primary/30 hover:shadow-sm hover:bg-accent/30"
                          }`}
                        >
                          <Smartphone
                            className={`size-5 ${field.value === true ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <span
                            className={`text-xs font-medium ${field.value === true ? "text-primary" : "text-foreground"}`}
                          >
                            موبايل
                          </span>
                        </div>
                        <div
                          onClick={() => field.onChange(false)}
                          className={`flex flex-col items-center gap-1.5 rounded-xl p-3 min-w-28 cursor-pointer select-none transition-all duration-200 ${
                            field.value === false
                              ? "bg-accent ring-2 ring-primary shadow-sm"
                              : "ring-1 ring-border hover:ring-primary/30 hover:shadow-sm hover:bg-accent/30"
                          }`}
                        >
                          <Headphones
                            className={`size-5 ${field.value === false ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <span
                            className={`text-xs font-medium ${field.value === false ? "text-primary" : "text-foreground"}`}
                          >
                            اكسسوار
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          ),
        }}
      />

      <AppModalEdite
        open={!!editingProduct}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProduct(null);
            editForm.reset();
          }
        }}
        title="تعديل الموديل"
        description="قم بتعديل بيانات الموديل"
        onSubmit={editForm.handleSubmit(onEditSubmit)}
        isLoading={updateIsPending}
        error={updateError?.response?.data?.errors?.map((e) => e.message)}
        submitText="تحديث"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">اسم الموديل</Label>
            <Input id="edit-name" {...editForm.register("name")} />
            {editForm.formState.errors.name && (
              <p className="text-sm text-destructive">
                {editForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category_id">التصنيف</Label>
            <Controller
              name="category_id"
              control={editForm.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر تصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {editForm.formState.errors.category_id && (
              <p className="text-sm text-destructive">
                {editForm.formState.errors.category_id.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>النوع</Label>
            <Controller
              name="is_serialized"
              control={editForm.control}
              render={({ field }) => (
                <div className="flex ">
                  <div className="inline-grid grid-cols-2 gap-3">
                    <div
                      onClick={() => field.onChange(true)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl p-3 min-w-28 cursor-pointer select-none transition-all duration-200 ${
                        field.value === true
                          ? "bg-accent ring-2 ring-primary shadow-sm"
                          : "ring-1 ring-border hover:ring-primary/30 hover:shadow-sm hover:bg-accent/30"
                      }`}
                    >
                      <Smartphone
                        className={`size-5 ${field.value === true ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-xs font-medium ${field.value === true ? "text-primary" : "text-foreground"}`}
                      >
                        موبايل
                      </span>
                    </div>
                    <div
                      onClick={() => field.onChange(false)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl p-3 min-w-28 cursor-pointer select-none transition-all duration-200 ${
                        field.value === false
                          ? "bg-accent ring-2 ring-primary shadow-sm"
                          : "ring-1 ring-border hover:ring-primary/30 hover:shadow-sm hover:bg-accent/30"
                      }`}
                    >
                      <Headphones
                        className={`size-5 ${field.value === false ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-xs font-medium ${field.value === false ? "text-primary" : "text-foreground"}`}
                      >
                        اكسسوار
                      </span>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </AppModalEdite>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products?.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditModal(product)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" onClick={() => confirmDelete(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  product.is_serialized === 1
                    ? "bg-primary/90 text-white"
                    : "bg-muted text-black"
                }`}
              >
                {product.is_serialized === 1 ? "موبايل" : "اكسسوار"}
              </span>

              <div className="text-xs text-muted-foreground/80 font-medium">
                {new Date(product.created_at).toLocaleDateString("ar-EG", {
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

export default ProductPage;
