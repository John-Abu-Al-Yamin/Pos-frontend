import { useState } from "react";
import { request } from "@/services/clientService";
import endPoints from "@/hooks/EndPoints/endPoints";

/**
 * Imperative invoice fetching hook.
 * Fires a single GET request on demand (not on mount).
 * Returns { fetchInvoice, invoiceData, isPending, error }.
 *
 * @param {"purchase"|"sale"} type
 * @param {number|string} id
 */
const useFetchInvoice = (type, id) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const endpoint =
    type === "purchase"
      ? `${endPoints.invoicePurchase}/${id}`
      : `${endPoints.invoiceSale}/${id}`;

  const fetchInvoice = async () => {
    setIsPending(true);
    setError(null);
    setInvoiceData(null);

    try {
      const res = await request({ method: "GET", url: endpoint });
      setInvoiceData(res.data?.data ?? null);
    } catch (err) {
      setError(err?.response?.data?.message ?? "حدث خطأ أثناء تحميل الفاتورة");
    } finally {
      setIsPending(false);
    }
  };

  return { fetchInvoice, invoiceData, isPending, error };
};

export default useFetchInvoice;
