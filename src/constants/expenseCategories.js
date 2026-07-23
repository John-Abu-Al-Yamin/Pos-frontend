export const expenseCategoryNames = {
  electricity: "كهرباء",
  water: "مياه",
  internet: "إنترنت",
  rent: "إيجار",
  salary: "رواتب",
  cleaning: "نظافة",
  maintenance: "صيانة",
  phone_bills: "فواتير الهاتف",
  office_supplies: "لوازم مكتبية",
  equipment: "معدات",
  packaging: "تغليف",
  security_cameras: "كاميرات مراقبة",
  taxes: "ضرائب",
  other: "أخرى",
};

export const expenseCategories = Object.entries(expenseCategoryNames).map(([value, label]) => ({
  value,
  label,
}));
