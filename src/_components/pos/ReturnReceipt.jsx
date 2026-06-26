import React from "react";

const refundMethodArabic = {
  cash: "نقدي",
  card: "بطاقة",
  bank_transfer: "تحويل بنكي",
};

const conditionArabic = {
  new: "جديد",
  excellent: "ممتاز",
  good: "جيد",
  fair: "مقبول",
  damaged: "تالف",
};

const ReturnReceipt = ({ returnData }) => {
  if (!returnData) return null;

  return (
    <div
      dir="rtl"
      style={{
        width: "80mm",
        padding: "10px 5px",
        fontFamily: "monospace",
        fontSize: "12px",
        lineHeight: 1.5,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>
          إشعار مرتجع
        </h2>
        <p style={{ margin: "2px 0", fontSize: "11px", color: "#555" }}>
          {returnData.reference_code}
        </p>
      </div>

      <hr style={{ borderTop: "1px dashed #000" }} />

      <table style={{ width: "100%", fontSize: "11px", margin: "5px 0" }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold", padding: "1px 0" }}>رقم المرتجع:</td>
            <td style={{ textAlign: "left", padding: "1px 0" }}>#{returnData.id}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "1px 0" }}>فاتورة البيع:</td>
            <td style={{ textAlign: "left", padding: "1px 0" }}>{returnData.sale_reference}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "1px 0" }}>التاريخ:</td>
            <td style={{ textAlign: "left", padding: "1px 0" }}>{returnData.return_date}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "1px 0" }}>العميل:</td>
            <td style={{ textAlign: "left", padding: "1px 0" }}>
              {returnData.customer_name || "—"}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "1px 0" }}>طريقة الاسترداد:</td>
            <td style={{ textAlign: "left", padding: "1px 0" }}>
              {refundMethodArabic[returnData.refund_method] || returnData.refund_method}
            </td>
          </tr>
        </tbody>
      </table>

      <hr style={{ borderTop: "1px dashed #000" }} />

      <table style={{ width: "100%", fontSize: "11px", margin: "5px 0" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "right", borderBottom: "1px solid #000", padding: "2px 0" }}>
              المنتج
            </th>
            <th style={{ textAlign: "center", borderBottom: "1px solid #000", padding: "2px 0" }}>
              الكمية
            </th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #000", padding: "2px 0" }}>
              المسترد
            </th>
          </tr>
        </thead>
        <tbody>
          {(returnData.items || []).map((item, i) => (
            <tr key={i}>
              <td style={{ textAlign: "right", padding: "2px 0" }}>
                {item.product_name}
                {item.condition && (
                  <span style={{ fontSize: "10px", color: "#888" }}>
                    {" "}
                    ({conditionArabic[item.condition] || item.condition})
                  </span>
                )}
              </td>
              <td style={{ textAlign: "center", padding: "2px 0" }}>
                {Number(item.quantity).toLocaleString("ar-EG")}
              </td>
              <td style={{ textAlign: "left", padding: "2px 0" }}>
                {Number(item.refund_amount).toLocaleString("ar-EG")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ borderTop: "1px dashed #000" }} />

      <table style={{ width: "100%", fontSize: "11px", margin: "5px 0" }}>
        <tbody>
          {returnData.restocking_fee > 0 && (
            <tr>
              <td style={{ fontWeight: "bold", padding: "1px 0" }}>رسوم إعادة التخزين:</td>
              <td style={{ textAlign: "left", padding: "1px 0" }}>
                -{Number(returnData.restocking_fee).toLocaleString("ar-EG")}
              </td>
            </tr>
          )}
          <tr>
            <td style={{ fontWeight: "bold", fontSize: "13px", padding: "3px 0" }}>
              الإجمالي المسترد:
            </td>
            <td
              style={{
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "bold",
                padding: "3px 0",
              }}
            >
              {Number(returnData.refund_total).toLocaleString("ar-EG")} ج.م
            </td>
          </tr>
        </tbody>
      </table>

      <hr style={{ borderTop: "1px dashed #000" }} />

      <div style={{ textAlign: "center", marginTop: "10px", fontSize: "10px", color: "#555" }}>
        <p style={{ margin: 0 }}>تمت عملية الإرجاع بنجاح</p>
        <p style={{ margin: 0 }}>شكراً لتعاملكم معنا</p>
      </div>
    </div>
  );
};

export default ReturnReceipt;
