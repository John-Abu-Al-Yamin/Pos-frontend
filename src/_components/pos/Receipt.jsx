const paymentLabels = {
  cash: "نقدي",
  card: "بطاقة",
  transfer: "تحويل",
  installment: "تقسيط",
};

const STORE = {
  name: "متجر الأجهزة الإلكترونية",
  address: "القاهرة، مصر",
  phone: "0123456789",
  taxNumber: "123-456-789",
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatCurrency = (value) => Number(value).toLocaleString("ar-EG");

const printStyles = `
  @media print {
    @page { margin: 0; size: 80mm auto; }
    * { visibility: hidden !important; }
    .receipt-root, .receipt-root * { visibility: visible !important; }
    .receipt-root {
      position: fixed; top: 0; left: 0; right: 0;
      width: 80mm; margin: 0 auto; padding: 3mm;
      background: #fff; color: #000 !important;
    }
    .receipt-root .sm\:flex-row { flex-direction: row !important; }
    .receipt-root .sm\:text-left { text-align: left !important; }
    .receipt-root .sm\:text-right { text-align: right !important; }
    .receipt-root .shadow-sm { box-shadow: none !important; }
    .receipt-root .rounded-xl { border-radius: 0 !important; }
    .receipt-root .border-border { border-color: #ccc !important; }
    .receipt-root .bg-card, .receipt-root .bg-white { background: #fff !important; }
    .receipt-root .bg-muted\/50 { background: #f5f5f5 !important; }
    .receipt-root h2 { font-size: 14px !important; margin: 0 0 2px !important; }
    .receipt-root .text-muted-foreground { color: #555 !important; }
    .receipt-root .text-sm { font-size: 10px !important; }
    .receipt-root .text-xs { font-size: 9px !important; }
    .receipt-root .text-lg { font-size: 12px !important; }
    .receipt-root .gap-4 { gap: 4px !important; }
    .receipt-root .gap-3 { gap: 3px !important; }
    .receipt-root .gap-2 { gap: 2px !important; }
    .receipt-root .p-6 { padding: 0 !important; }
    .receipt-root .p-4 { padding: 3mm 0 !important; }
    .receipt-root .p-3 { padding: 2mm 0 !important; }
    .receipt-root .px-4 { padding-left: 0 !important; padding-right: 0 !important; }
    .receipt-root .py-3 { padding-top: 2mm !important; padding-bottom: 2mm !important; }
    .receipt-root .mb-4 { margin-bottom: 3mm !important; }
    .receipt-root .mb-3 { margin-bottom: 2mm !important; }
    .no-print { display: none !important; }
  }
`;

const Receipt = ({ sale }) => (
  <>
    <style>{printStyles}</style>
    <div className="receipt-root" dir="rtl">
      {/* ── Header: Store + Invoice Meta ── */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="text-center sm:text-right">
          <h2 className="text-lg font-bold text-foreground">{STORE.name}</h2>
          <p className="text-xs text-muted-foreground">{STORE.address}</p>
          <p className="text-xs text-muted-foreground">{STORE.phone}</p>
          <p className="text-xs text-muted-foreground">
            الرقم الضريبي: {STORE.taxNumber}
          </p>
        </div>
        <div className="text-center sm:text-left space-y-1">
          <p className="text-sm font-bold text-foreground">فاتورة بيع</p>
          <p className="text-xs text-muted-foreground">
            #<span dir="ltr">{sale.id}</span>
          </p>
          {sale.reference_code && (
            <p className="text-xs text-muted-foreground">
              الكود: <span dir="ltr">{sale.reference_code}</span>
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            التاريخ: {formatDate(sale.date)}
          </p>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-border mb-3" />

      {/* ── Customer & Payment ── */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-3">
        {sale.customer_name && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">العميل:</span>
            <span className="text-sm font-semibold text-foreground">
              {sale.customer_name}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">طريقة الدفع:</span>
          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 border-green-200">
            {paymentLabels[sale.payment_method] || sale.payment_method}
          </span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-border mb-3" />

      {/* ── Items Table ── */}
      <div className="w-full mb-3">
        {/* Table Header */}
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg text-xs font-bold text-muted-foreground mb-1">
          <span className="w-8 shrink-0 text-center">#</span>
          <span className="flex-1">المنتج</span>
          <span className="w-16 shrink-0 text-center">الكمية</span>
          <span className="w-20 shrink-0 text-center">سعر الوحدة</span>
          <span className="w-20 shrink-0 text-center">الإجمالي</span>
        </div>

        {/* Table Rows */}
        {sale.items.map((item, i) => (
          <div key={i}>
            <div className="flex items-center gap-2 px-3 py-2 text-sm">
              <span className="w-8 shrink-0 text-center text-muted-foreground">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-foreground">
                  {item.product_name}
                </p>
                {item.serial_number && (
                  <p
                    className="text-xs text-muted-foreground font-mono truncate"
                    dir="ltr"
                  >
                    {item.serial_number}
                  </p>
                )}
              </div>
              <span className="w-16 shrink-0 text-center text-foreground">
                {item.quantity}
              </span>
              <span className="w-20 shrink-0 text-center text-foreground">
                {formatCurrency(item.unit_price)}
              </span>
              <span className="w-20 shrink-0 text-center font-semibold text-foreground">
                {formatCurrency(item.quantity * item.unit_price)}
              </span>
            </div>
            {i < sale.items.length - 1 && (
              <div className="border-t border-border mx-3" />
            )}
          </div>
        ))}
      </div>

      {/* ── Total ── */}
      <div className="border-t border-border pt-3 mb-3">
        <div className="flex items-center justify-between px-3 py-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-bold text-foreground">الإجمالي</span>
          <span className="text-lg font-bold text-foreground">
            {formatCurrency(sale.total)} ج.م
          </span>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="text-center text-xs text-muted-foreground border-t border-border pt-3">
        <p>شكراً لتعاملکم معنا</p>
      </div>
    </div>
  </>
);

export default Receipt;
