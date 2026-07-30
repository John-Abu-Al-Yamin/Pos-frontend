import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";

/**
 * Printable invoice layout.
 * Receives the raw API response object `data` from GET /api/invoices/purchases/{id}
 * or GET /api/invoices/sales/{id}.
 *
 * This component is purely presentational. It is mounted through a React portal
 * into #invoice-print-root and becomes visible through the @media print CSS rule.
 */
const InvoiceDocument = ({ data }) => {
  if (!data) return null;

  const { invoice, party, items = [], totals } = data;
  const isSale = data.type === "sale";
  const invoiceTitle = isSale ? "فاتورة مبيعات" : "فاتورة مشتريات";
  const partyLabel = isSale ? "العميل" : "المورد";

  const statusConfig = {
    completed: {
      label: "مكتملة",
      className:
        "border-green-200 bg-green-50 text-green-700 print:border-green-700 print:bg-white print:text-green-800",
    },
    draft: {
      label: "مسودة",
      className:
        "border-yellow-200 bg-yellow-50 text-yellow-700 print:border-yellow-700 print:bg-white print:text-yellow-800",
    },
    cancelled: {
      label: "ملغية",
      className:
        "border-red-200 bg-red-50 text-red-700 print:border-red-700 print:bg-white print:text-red-800",
    },
  };

  const status = statusConfig[invoice?.status] ?? {
    label: invoice?.status ?? "غير محددة",
    className: "border-border bg-secondary text-secondary-foreground",
  };

  const valueOrDash = (value) =>
    value === null || value === undefined || value === "" ? "—" : value;

  const money = (value) => formatCurrency(Number(value) || 0);

  const displayCreatedBy =
    typeof invoice?.created_by === "object"
      ? invoice?.created_by?.name
      : invoice?.created_by;

  const details = [
    { label: "رقم الفاتورة", value: invoice?.number },
    {
      label: "التاريخ",
      value: invoice?.transaction_date
        ? formatDateTime(invoice.transaction_date)
        : null,
    },
    { label: "أنشئت بواسطة", value: displayCreatedBy },
    {
      label: "رقم فاتورة المورد",
      value: invoice?.supplier_invoice_number,
      hidden: !invoice?.supplier_invoice_number,
    },
  ].filter((item) => !item.hidden);

  const hasDiscount = Number(totals?.discount_amount) > 0;
  const totalQuantity = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );

  return (
    <>
      <style>
        {`
          @page {
            size: A4;
            margin: 12mm;
          }

          @media print {
            #invoice-print-root {
              overflow: visible;
            }

            .invoice-document {
              width: 100% !important;
              min-height: auto !important;
              margin: 0 auto !important;
              padding: 0 !important;
              border: 0 !important;
              box-shadow: none !important;
            }

            .invoice-avoid-break {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .invoice-items-table thead {
              display: table-header-group;
            }

            .invoice-items-table tr {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}
      </style>

      <article
        className="invoice-document mx-auto hidden min-h-screen max-w-4xl bg-background p-4 text-foreground shadow-sm sm:p-6 print:block print:bg-white"
        dir="rtl"
      >
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
          <header className="invoice-avoid-break border-b border-border pb-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-lg font-extrabold text-primary-foreground">
                    POS
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      نظام نقطة البيع
                    </p>
                    <h1 className="text-2xl font-extrabold tracking-normal text-foreground">
                      {invoiceTitle}
                    </h1>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn("rounded-md px-2.5 py-1", status.className)}
                >
                  {status.label}
                </Badge>
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm sm:min-w-72 print:bg-white">
                <div className="space-y-2">
                  {details.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex items-start justify-between gap-4"
                    >
                      <span className="text-muted-foreground">
                        {detail.label}
                      </span>
                      <span className="text-left font-semibold text-foreground">
                        {valueOrDash(detail.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <section className="invoice-avoid-break grid gap-4 py-6 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-white p-4 print:bg-white">
              <p className="text-xs font-medium text-muted-foreground">
                {partyLabel}
              </p>
              <p className="mt-1 text-base font-bold">
                {valueOrDash(party?.name)}
              </p>
              {party?.phone && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {party.phone}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-border bg-white p-4 print:bg-white">
              <p className="text-xs font-medium text-muted-foreground">
                عدد الأصناف
              </p>
              <p className="mt-1 text-base font-bold">{items.length}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                إجمالي الكمية: {totalQuantity}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-primary p-4 text-primary-foreground print:bg-white print:text-foreground">
              <p className="text-xs font-medium opacity-80">إجمالي الفاتورة</p>
              <p className="mt-1 text-xl font-extrabold">
                {money(totals?.total_amount)}
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-border">
            <table className="invoice-items-table w-full caption-bottom text-sm">
              <thead className="bg-muted/60 print:bg-white">
                <tr className="border-b border-border">
                  <th className="h-11 w-12 px-3 text-right align-middle text-xs font-semibold text-muted-foreground">
                    #
                  </th>
                  <th className="h-11 px-3 text-right align-middle text-xs font-semibold text-muted-foreground">
                    المنتج
                  </th>
                  {isSale && (
                    <th className="h-11 px-3 text-right align-middle text-xs font-semibold text-muted-foreground">
                      الرقم التسلسلي
                    </th>
                  )}
                  <th className="h-11 px-3 text-right align-middle text-xs font-semibold text-muted-foreground">
                    الكمية
                  </th>
                  <th className="h-11 px-3 text-right align-middle text-xs font-semibold text-muted-foreground">
                    سعر الوحدة
                  </th>
                  <th className="h-11 px-3 text-left align-middle text-xs font-semibold text-muted-foreground">
                    الإجمالي
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isSale ? 6 : 5}
                      className="h-24 px-3 text-center text-muted-foreground"
                    >
                      لا توجد أصناف
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    const lineTotal =
                      item.total_amount ??
                      item.total_price ??
                      (Number(item.quantity) || 0) *
                        (Number(item.unit_price) || 0);

                    return (
                      <tr
                        key={item.id ?? index}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-3 py-3 align-top font-medium">
                          {index + 1}
                        </td>
                        <td className="px-3 py-3 align-top">
                          <p className="font-semibold text-foreground">
                            {valueOrDash(item.product_name)}
                          </p>
                        </td>
                        {isSale && (
                          <td className="px-3 py-3 align-top text-muted-foreground">
                            {valueOrDash(item.serial_number)}
                          </td>
                        )}
                        <td className="px-3 py-3 align-top">
                          {valueOrDash(item.quantity)}
                        </td>
                        <td className="px-3 py-3 align-top">
                          {money(item.unit_price)}
                        </td>
                        <td className="px-3 py-3 text-left align-top font-bold">
                          {money(lineTotal)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </section>

          <section className="invoice-avoid-break mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="rounded-lg border border-border bg-muted/30 p-4 print:bg-white">
              <p className="text-sm font-bold">ملاحظات</p>
              <p className="mt-2 min-h-10 text-sm leading-6 text-muted-foreground">
                {valueOrDash(invoice?.notes)}
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-white">
              <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="font-semibold">{money(totals?.subtotal)}</span>
              </div>
              {hasDiscount && (
                <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm">
                  <span className="text-muted-foreground">الخصم</span>
                  <span className="font-semibold text-destructive">
                    - {money(totals.discount_amount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between bg-primary px-4 py-4 text-base font-extrabold text-primary-foreground print:border-t print:border-border print:bg-white print:text-foreground">
                <span>الإجمالي</span>
                <span>{money(totals?.total_amount)}</span>
              </div>
            </div>
          </section>

          <footer className="invoice-avoid-break mt-8 border-t border-border pt-4 text-center text-xs leading-6 text-muted-foreground">
            <p className="font-medium text-foreground">
              شكراً لتعاملكم معنا
            </p>
            <p>
              تم إنشاء هذه الفاتورة بتاريخ{" "}
              {invoice?.generated_at ? formatDateTime(invoice.generated_at) : "—"}
            </p>
          </footer>
        </div>
      </article>
    </>
  );
};

export default InvoiceDocument;
