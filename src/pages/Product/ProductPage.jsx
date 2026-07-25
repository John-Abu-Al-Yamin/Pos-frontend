import React from "react";
import { toast } from "sonner";
import {
  useAddProducts,
  useDeleteProducts,
  useGetAllProducts,
} from "@/hooks/Actions/Product/useCurdsProduct";
import { useGetAllCategories } from "@/hooks/Actions/Categories/useCurdsCategories";
import { useGetAllBrands } from "@/hooks/Actions/brands/useCurdsBrands";
import usePutData from "@/hooks/curdsHook/usePutData";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import CustomHeader from "@/customs/CustomHeader";
import Loading from "@/customs/Loading";
import useSearch from "@/hooks/useSearch/useSearch";
import { productsSchema } from "@/validation/products/products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppModalEdite from "@/customs/AppModalEdite";
import CustomPagination from "@/customs/CustomPagination";
import ProductFormFields from "./components/ProductFormFields";
import ProductFilterBar from "./components/ProductFilterBar";
import ProductCard from "./components/ProductCard";
import ProductImportDialog from "./components/ProductImportDialog";
import { downloadProductImportTemplate } from "@/hooks/Actions/Product/useImportProducts";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

const ProductPage = () => {
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const [filterCategory, setFilterCategory] = React.useState("");
  const [filterBrand, setFilterBrand] = React.useState("");
  const [filterType, setFilterType] = React.useState("");
  const [importOpen, setImportOpen] = React.useState(false);
  const { debouncedSearch, search, handelSearch, setSearch } = useSearch("", 400);

  const filters = {
    search: debouncedSearch || undefined,
    category_id: filterCategory || undefined,
    brand_id: filterBrand || undefined,
    type: filterType || undefined,
  };

  const { data, isPending } = useGetAllProducts(page, per_page, filters);
  const { data: categoriesData } = useGetAllCategories(1, 100);
  const { data: brandsData } = useGetAllBrands();
  const { mutate: addMutate, isPending: addIsPending, error: addError } = useAddProducts();
  const { mutate: updateMutate, isPending: updateIsPending, error: updateError } = usePutData(
    endPoints.products,
    [queryKeys.updateproducts],
    [queryKeys.products, queryKeys.updateproducts],
  );
  const { mutate: deleteMutate } = useDeleteProducts();

  React.useEffect(() => { setPage(1); }, [debouncedSearch, filterCategory, filterBrand, filterType]);

  const clearFilters = () => {
    setSearch("");
    setFilterCategory("");
    setFilterBrand("");
    setFilterType("");
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || filterCategory || filterBrand || filterType;
  const [editingProduct, setEditingProduct] = React.useState(null);

  const categories = categoriesData?.data?.data ?? [];
  const brands = brandsData?.data?.data ?? [];

  const categoryMap = React.useMemo(
    () => Object.fromEntries(categories.map((c) => [String(c.id), c.name])),
    [categories],
  );
  const brandMap = React.useMemo(
    () => Object.fromEntries(brands.map((b) => [String(b.id), b.name])),
    [brands],
  );

  const form = useForm({
    resolver: zodResolver(productsSchema),
    defaultValues: { name: "", category_id: "", brand_id: "", type: "", min_stock: "5" },
  });

  const editForm = useForm({
    resolver: zodResolver(productsSchema),
    defaultValues: { name: "", category_id: "", brand_id: "", type: "", min_stock: "5" },
  });

  const transformData = (formData) => ({
    ...formData,
    category_id: Number(formData.category_id),
    brand_id: formData.brand_id ? Number(formData.brand_id) : null,
    min_stock: formData.min_stock ? Number(formData.min_stock) : 5,
  });

  const onSubmit = (formData) => {
    addMutate({ data: transformData(formData) }, {
      onSuccess: () => form.reset(),
    });
  };

  const onEditSubmit = (formData) => {
    updateMutate({ data: transformData(formData), url: `${endPoints.products}/${editingProduct.id}` }, {
      onSuccess: () => {
        editForm.reset();
        setEditingProduct(null);
      },
    });
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    editForm.reset({
      name: product.name,
      category_id: String(product.category_id),
      brand_id: product.brand_id ? String(product.brand_id) : "",
      type: product.type,
      min_stock: String(product.min_stock ?? 5),
    });
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadProductImportTemplate();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Template download failed");
    }
  };

  const confirmDelete = (productId) => {
    toast("هل أنت متأكد من الحذف؟", {
      action: { label: "نعم", onClick: () => deleteMutate({ id: productId }) },
      duration: Infinity,
    });
  };

  if (isPending) return <Loading />;

  const products = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div>
      <CustomHeader
        title="المنتجات"
        description="قائمة المنتجات"
        buttonText="منتج جديد"
        addModal={{
          title: "إضافة منتج جديد",
          description: "أدخل بيانات المنتج",
          onSubmit: form.handleSubmit(onSubmit),
          isLoading: addIsPending,
          error: addError?.response?.data?.errors?.map((e) => e.message),
          submitText: "حفظ",
          children: <ProductFormFields formInstance={form} categories={categories} brands={brands} />,
        }}
      />

      <AppModalEdite
        open={!!editingProduct}
        onOpenChange={(open) => { if (!open) { setEditingProduct(null); editForm.reset(); } }}
        title="تعديل المنتج"
        description="تعديل بيانات المنتج"
        onSubmit={editForm.handleSubmit(onEditSubmit)}
        isLoading={updateIsPending}
        error={updateError?.response?.data?.errors?.map((e) => e.message)}
        submitText="تحديث"
      >
        <ProductFormFields formInstance={editForm} categories={categories} brands={brands} prefix="edit-" />
      </AppModalEdite>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => setImportOpen(true)}>
          <Upload className="h-4 w-4" />
          Import Products
        </Button>
        <Button type="button" variant="outline" onClick={handleDownloadTemplate}>
          <Download className="h-4 w-4" />
          Download Template
        </Button>
      </div>

      <ProductImportDialog open={importOpen} onOpenChange={setImportOpen} />

      <ProductFilterBar
        search={search}
        handelSearch={handelSearch}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterBrand={filterBrand}
        setFilterBrand={setFilterBrand}
        filterType={filterType}
        setFilterType={setFilterType}
        categories={categories}
        brands={brands}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            categoryMap={categoryMap}
            brandMap={brandMap}
            openEditModal={openEditModal}
            confirmDelete={confirmDelete}
          />
        ))}
      </div>

      <CustomPagination pagination={pagination} onPageChange={(p) => setPage(p)} />
    </div>
  );
};

export default ProductPage;
