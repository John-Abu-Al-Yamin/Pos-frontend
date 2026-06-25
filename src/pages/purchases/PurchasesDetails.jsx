import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

import { useGetPurchaseHeadersById } from "@/hooks/Actions/PurchaseHeaders/useCurdsPurchaseHeaders";
import {
  useAddPurchaseItem,
  useDeletePurchaseItem,
} from "@/hooks/Actions/PurchaseItems/useCurdsPurchaseItems";
import { useGetAllProducts } from "@/hooks/Actions/Product/useCurdsProduct";

import { Button } from "@/components/ui/button";
import Loading from "@/customs/Loading";
import InvoiceInfoCards from "@/_components/purchases/InvoiceInfoCards";
import InvoiceItemsSection from "@/_components/purchases/InvoiceItemsSection";
import AddItemModal from "@/_components/purchases/AddItemModal";

/* ─────────────────────── main component ─────────────────────── */
const PurchasesDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ── data fetching ── */
  const { data: headerRes, isPending: headerPending } =
    useGetPurchaseHeadersById(id);
  const purchase = headerRes?.data?.data ?? headerRes?.data;

  const items = purchase?.purchase_items ?? [];

  const { data: productsRes, isPending: productsPending } = useGetAllProducts(
    1,
    1000,
  );
  const products = productsRes?.data?.data ?? [];

  /* ── mutations ── */
  const { mutate: addItem, isPending: addPending } = useAddPurchaseItem();
  const { mutate: deleteItem, isPending: deletePending } =
    useDeletePurchaseItem();

  /* ── add-item modal state ── */
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deviceDetails, setDeviceDetails] = React.useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      product_id: "",
      quantity: "",
      unit_cost: "",
      condition: "",
    },
  });

  const selectedProductId = watch("product_id");
  const conditionValue = watch("condition");
  const selectedProduct = products.find(
    (p) => String(p.id) === String(selectedProductId),
  );

  const isSerialized = selectedProduct?.is_serialized;

  React.useEffect(() => {
    if (selectedProductId && !isSerialized) {
      setValue("condition", "new");
    }
  }, [selectedProductId, isSerialized, setValue]);

  /* ── debug ── */
  console.log("[PurchasesDetails] selectedProduct:", selectedProduct, "selectedProductId:", selectedProductId, "isSerialized:", isSerialized, "condition:", conditionValue);

  const handleOpenModal = () => {
    reset({ product_id: "", quantity: "", unit_cost: "", condition: "" });
    setDeviceDetails({
      face_id_working: true,
      fingerprint_working: true,
      camera_working: true,
      speaker_working: true,
    });
    setModalOpen(true);
  };

  const onAddItem = (formData) => {
    if (!formData.product_id) {
      toast.error("الرجاء اختيار منتج");
      return;
    }

    const product = products.find(
      (p) => String(p.id) === String(formData.product_id),
    );

    const quantity = Number(formData.quantity);
    const condition = product?.is_serialized ? formData.condition : "new";

    const payload = {
      purchase_header_id: Number(id),
      product_id: Number(formData.product_id),
      quantity,
      unit_cost: Number(formData.unit_cost),
      condition,
    };

    if (product?.is_serialized && condition !== "new" && deviceDetails) {
      payload.device_details = Array.from({ length: quantity }, () => ({ ...deviceDetails }));
    }

    addItem(
      { data: payload },
      {
        onSuccess: () => {
        //   toast.success("تم إضافة الصنف بنجاح");
          setModalOpen(false);
          reset();
        },
        onError: () => {
          toast.error("فشل في إضافة الصنف");
        },
      },
    );
  };

  const handleViewItem = (item) => {
    navigate(`/purchases/${id}/items/${item.id}`);
  };

  const handleEditItem = (item) => {
    navigate(`/purchases/${id}/items/${item.id}/edit`, {
      state: { item, purchaseId: id },
    });
  };

  const handleDeleteItem = (itemId) => {
    deleteItem(
      { id: itemId },
      {
        onError: () => toast.error("فشل في حذف الصنف"),
      },
    );
  };

  /* ── loading ── */
  if (headerPending) return <Loading />;

  /* ── computed values ── */
  const typeLabel =
    purchase?.type === "purchase"
      ? "مشتريات"
      : purchase?.type === "opening_stock"
        ? "بضاعة بالمحل"
        : purchase?.type;

  const typeVariant = purchase?.type === "purchase" ? "default" : "outline";
  const typeBadgeClass =
    purchase?.type === "purchase"
      ? "bg-amber-50 text-black border-amber-100 hover:bg-amber-100"
      : "bg-primary/5 text-primary border-primary/20 hover:bg-primary/15";

  const totalItems = items.length;
  const grandTotal = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.quantity) || 0) *
        (Number(item.unit_cost ?? item.unit_price) || 0),
    0,
  );

  return (
    <div className="mx-auto p-4 space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            تفاصيل فاتورة المشتريات
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            عرض كامل لبيانات الفاتورة وأصنافها
          </p>
        </div>
        <Button
          onClick={() => navigate("/purchases")}
          variant="outline"
          className="sm:self-center gap-2 self-start"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للمشتريات
        </Button>
      </div>

      {/* ── Invoice Info Cards ── */}
      <InvoiceInfoCards
        purchase={purchase}
        typeLabel={typeLabel}
        typeVariant={typeVariant}
        typeBadgeClass={typeBadgeClass}
      />

      {/* ── Invoice Items Section ── */}
      <InvoiceItemsSection
        items={items}
        totalItems={totalItems}
        grandTotal={grandTotal}
        deletePending={deletePending}
        onDeleteItem={handleDeleteItem}
        onAddItem={handleOpenModal}
        onEditItem={handleEditItem}
        onViewItem={handleViewItem}
      />

      {/* ── إضافة أصناف الفاتورة Modal ── */}
      <AddItemModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        products={products}
        productsPending={productsPending}
        addPending={addPending}
        selectedProductId={selectedProductId}
        conditionValue={conditionValue}
        isSerialized={isSerialized}
        register={register}
        watch={watch}
        setValue={setValue}
        control={control}
        errors={errors}
        onSubmit={handleSubmit(onAddItem)}
        deviceDetails={deviceDetails}
        setDeviceDetails={setDeviceDetails}
      />
      
    </div>
  );
};

export default PurchasesDetails;
