import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";
import useFetchInvoice from "@/hooks/Actions/Invoices/useFetchInvoice";

/**
 * Reusable print-invoice button.
 *
 * On click:
 *  1. Fetches the invoice data from the backend.
 *  2. Renders <InvoiceDocument> into #invoice-print-root via a React portal.
 *  3. Calls window.print() so only the invoice is visible (via @media print CSS).
 *
 * @param {"purchase"|"sale"} type
 * @param {number|string} id
 */
const PrintInvoiceButton = ({ type, id }) => {
  const { fetchInvoice, invoiceData, isPending, error } = useFetchInvoice(
    type,
    id,
  );

  // Track whether we are in the "printing" lifecycle (data fetched, waiting for print)
  const printTriggered = useRef(false);

  // After invoiceData is set and the portal has rendered, call window.print()
  useEffect(() => {
    if (invoiceData && printTriggered.current) {
      // Small timeout ensures the portal content is flushed to the DOM
      const timer = setTimeout(() => {
        window.print();
        printTriggered.current = false;
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [invoiceData]);

  // Show toast if an error occurred
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleClick = async () => {
    printTriggered.current = true;
    await fetchInvoice();
  };

  const printRoot = document.getElementById("invoice-print-root");

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Printer className="h-4 w-4" />
        )}
        {isPending ? "جارٍ التحميل..." : "طباعة الفاتورة"}
      </Button>

      {/* Portal: renders the invoice into #invoice-print-root (outside #root).
          The @media print CSS in index.css hides the rest of the page and
          makes only #invoice-print-root visible during printing. */}
      {invoiceData &&
        printRoot &&
        createPortal(<InvoiceDocument data={invoiceData} />, printRoot)}
    </>
  );
};

export default PrintInvoiceButton;
