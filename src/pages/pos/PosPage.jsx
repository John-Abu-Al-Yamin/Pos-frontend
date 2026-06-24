import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  useGetAvailableStock,
  useAddSale,
} from "@/hooks/Actions/sales/useCurdsSales";
import { useGetAllCustomers } from "@/hooks/Actions/customers/useCurdsCustomers";
import ProductPanel from "@/_components/pos/ProductPanel";
import CartPanel from "@/_components/pos/CartPanel";
import CustomerDialog from "@/_components/pos/CustomerDialog";
import PaymentDialog from "@/_components/pos/PaymentDialog";

const PosPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [cart, setCart] = React.useState([]);
  const [customerId, setCustomerId] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const [customerDialogOpen, setCustomerDialogOpen] = React.useState(false);
  const [payDialogOpen, setPayDialogOpen] = React.useState(false);

  const { data: stockRes, isPending: stockPending } = useGetAvailableStock({
    search,
    per_page: 200,
  });
  const stockItems = stockRes?.data?.data ?? [];

  const { data: customersRes } = useGetAllCustomers(1, 1000);
  const customers = customersRes?.data?.data ?? [];

  const { mutate: addSale, isPending: salePending } = useAddSale();

  const [addForm, setAddForm] = React.useState({});

  const groupedStock = React.useMemo(() => {
    const map = {};
    stockItems.forEach((item) => {
      const pid = item.product_id;
      if (!map[pid]) {
        map[pid] = { product: item.product, items: [] };
      }
      map[pid].items.push(item);
    });
    return Object.values(map);
  }, [stockItems]);

  const initForm = (productId, isSerialized, defaultPrice) => {
    setAddForm((prev) => {
      if (prev[productId]) return prev;
      return {
        ...prev,
        [productId]: {
          quantity: 1,
          unit_price: defaultPrice,
        },
      };
    });
  };

  const setFormValue = (productId, field, value) => {
    setAddForm((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const addNonSerialized = (group, price) => {
    const pid = group.product.id;
    const form = addForm[pid] || { quantity: 1, unit_price: price };
    const qty = parseInt(form.quantity, 10) || 1;
    const unitPrice = parseFloat(form.unit_price) || 0;

    if (qty < 1) {
      toast.error("الكمية يجب أن تكون 1 على الأقل");
      return;
    }
    if (unitPrice <= 0) {
      toast.error("يرجى إدخال سعر البيع");
      return;
    }

    setCart((prev) => {
      const existing = prev.find(
        (c) => !c.is_serialized && c.product_id === pid,
      );
      if (existing) {
        return prev.map((c) =>
          c.product_id === pid
            ? { ...c, quantity: c.quantity + qty, unit_price: unitPrice }
            : c,
        );
      }
      return [
        ...prev,
        {
          product_id: pid,
          product_name: group.product.name,
          is_serialized: false,
          stock_item_ids: [],
          quantity: qty,
          unit_price: unitPrice,
        },
      ];
    });
  };

  const addSerialized = (stockItem) => {
    const pid = stockItem.product_id;
    const form = addForm[`${pid}_${stockItem.id}`] || {
      unit_price: Number(stockItem.cost_price) || 0,
    };
    const unitPrice = parseFloat(form.unit_price) || 0;

    if (unitPrice <= 0) {
      toast.error("يرجى إدخال سعر البيع");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((c) => c.stock_item_ids?.[0] === stockItem.id);
      if (existing) {
        toast.error("هذا الهاتف مضاف بالفعل");
        return prev;
      }
      return [
        ...prev,
        {
          product_id: pid,
          product_name: stockItem.product?.name,
          is_serialized: true,
          stock_item_ids: [stockItem.id],
          serial_number: stockItem.serial_number,
          condition: stockItem.condition,
          quantity: 1,
          unit_price: unitPrice,
        },
      ];
    });
  };

  const updateQty = (index, delta) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const updateCartPrice = (index, price) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, unit_price: parseFloat(price) || 0 } : item,
      ),
    );
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const isSerializedInCart = (stockItemId) =>
    cart.some((c) => c.stock_item_ids?.[0] === stockItemId);

  const isNonSerializedInCart = (productId) =>
    cart.some((c) => !c.is_serialized && c.product_id === productId);

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0,
  );

  const handleCompleteSale = () => {
    const payload = {
      customer_id: customerId || null,
      payment_method: paymentMethod,
      items: cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        stock_item_ids: item.stock_item_ids,
      })),
    };

    addSale(
      { data: payload },
      {
        onSuccess: (res) => {
          const saleId = res?.data?.data?.id;
          // toast.success("تم إتمام البيع بنجاح");
          setCart([]);
          setAddForm({});
          setCustomerId("");
          setPaymentMethod("cash");
          setPayDialogOpen(false);
          if (saleId) navigate(`/sales/${saleId}`);
        },
        onError: () => {
          toast.error("فشل في إتمام البيع");
        },
      },
    );
  };

  const selectedCustomer = customers.find(
    (c) => String(c.id) === String(customerId),
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6rem)]">
      <ProductPanel
        search={search}
        onSearchChange={setSearch}
        stockPending={stockPending}
        groupedStock={groupedStock}
        addForm={addForm}
        onInitForm={initForm}
        onSetFormValue={setFormValue}
        onAddSerialized={addSerialized}
        onAddNonSerialized={addNonSerialized}
        isSerializedInCart={isSerializedInCart}
        isNonSerializedInCart={isNonSerializedInCart}
      />

      <CartPanel
        cart={cart}
        selectedCustomer={selectedCustomer}
        onOpenCustomerDialog={() => setCustomerDialogOpen(true)}
        onClearCustomer={() => setCustomerId("")}
        onUpdateQty={updateQty}
        onUpdateCartPrice={updateCartPrice}
        onRemoveFromCart={removeFromCart}
        total={total}
        onOpenPayDialog={() => setPayDialogOpen(true)}
      />

      <CustomerDialog
        open={customerDialogOpen}
        onOpenChange={setCustomerDialogOpen}
        customers={customers}
        customerId={customerId}
        onSelectCustomer={(id) => {
          setCustomerId(id);
          setCustomerDialogOpen(false);
        }}
        onClearCustomer={() => {
          setCustomerId("");
          setCustomerDialogOpen(false);
        }}
      />

      <PaymentDialog
        open={payDialogOpen}
        onOpenChange={setPayDialogOpen}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        cart={cart}
        total={total}
        salePending={salePending}
        onCompleteSale={handleCompleteSale}
      />
    </div>
  );
};

export default PosPage;
