export const moduleLabels = {
  brands: "العلامات التجارية",
  categories: "التصنيفات",
  customers: "العملاء",
  suppliers: "الموردين",
  products: "المنتجات",
  pricing: "التسعير",
  purchases: "المشتريات",
  purchase_returns: "مرتجعات الشراء",
  sales: "المبيعات",
  sales_returns: "مرتجعات البيع",
  inventory: "المخزون",
  expenses: "المصروفات",
  salaries: "الرواتب",
  maintenance: "الصيانة",
  users_roles: "المستخدمين والأدوار",
  auth: "المصادقة",
};

export const actionLabels = {
  created: "إنشاء",
  updated: "تعديل",
  deleted: "حذف",
  force_deleted: "حذف نهائي",
  login_success: "تسجيل دخول ناجح",
  login_failed: "فشل تسجيل الدخول",
  logout: "تسجيل خروج",
  user_created: "إنشاء مستخدم",
  role_changed: "تغيير الدور",
  sale_completed: "إتمام بيع",
  purchase_completed: "إتمام شراء",
  purchase_cancelled: "إلغاء شراء",
  purchase_deleted: "حذف شراء",
  used_device_purchase_deleted: "حذف مشتريات مستعملة",
  sales_return_created: "إنشاء مرتجع بيع",
  refund_processed: "معالجة استرداد",
  purchase_return_created: "إنشاء مرتجع شراء",
  stock_adjusted: "تسوية مخزون",
  stock_correction: "تصحيح مخزون",
  inventory_cost_changed: "تغيير تكلفة المخزون",
  opening_stock_imported: "استيراد مخزون افتتاحي",
  expense_created: "إنشاء مصروف",
  expense_updated: "تعديل مصروف",
  expense_deleted: "حذف مصروف",
  expense_paid: "دفع مصروف",
  expense_cancelled: "إلغاء مصروف",
  salary_payment_created: "إنشاء دفع راتب",
  salary_payment_confirmed: "تأكيد دفع راتب",
  salary_payment_cancelled: "إلغاء دفع راتب",
  maintenance_created: "إنشاء صيانة",
  maintenance_status_changed: "تغيير حالة صيانة",
  maintenance_deleted: "حذف صيانة",
  repair_completed: "إتمام إصلاح",
  spare_parts_used: "استخدام قطع غيار",
  spare_parts_updated: "تعديل قطع غيار",
  spare_parts_removed: "إزالة قطع غيار",
  product_price_changed: "تغيير سعر منتج",
  product_cost_changed: "تغيير تكلفة منتج",
  products_imported: "استيراد منتجات",
};

export const statusLabels = {
  success: "ناجح",
  failed: "فشل",
};

export const severityLabels = {
  info: "معلوماتي",
  warning: "تحذير",
  critical: "حرج",
};

export const statusVariant = {
  success: {
    label: "ناجح",
    className: "bg-green-100 text-green-800",
  },
  failed: {
    label: "فشل",
    className: "bg-red-100 text-red-800",
  },
};

export const severityVariant = {
  info: {
    label: "معلوماتي",
    className: "bg-blue-100 text-blue-800",
  },
  warning: {
    label: "تحذير",
    className: "bg-amber-100 text-amber-800",
  },
  critical: {
    label: "حرج",
    className: "bg-red-100 text-red-800",
  },
};

export const getModuleLabel = (module) => moduleLabels[module] || module || "—";
export const getActionLabel = (action) => actionLabels[action] || action || "—";
export const getStatusLabel = (status) => statusLabels[status] || status || "—";
export const getSeverityLabel = (severity) =>
  severityLabels[severity] || severity || "—";