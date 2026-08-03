import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Tags,
  Truck,
  Users,
  Bookmark,
  Package,
  ShoppingCart,
  Receipt,
  RotateCcw,
  Undo2,
  X,
  ChevronUp,
  LogOut,
  DollarSign,
  Wrench,
  BarChart3,
  Settings,
  Warehouse,
  LayoutDashboard,
  ScrollText,
} from "lucide-react";
import { removeAuthToken } from "@/services/cookies";
import { isAdminUser } from "@/services/authUser";

const isReportLink = (href) => href?.startsWith("/reports/");
const isAdminLink = (href) =>
  href === "/opening-stock" || href === "/audit-logs";

const labels = {
  dashboard: "لوحة القيادة",
  categories: "الفئات",
  suppliers: "الموردين",
  brands: "العلامات التجارية",
  products: "المنتجات",
  expenses: "المصروفات",
  pos: "نقطة البيع",
  "sales-headers": "فواتير المبيعات",
  "sales-returns": "مرتجعات المبيعات",
  "sales-returnable": "مرتجع المبيعات",
  customers: "العملاء",
  "reports-sales": "تقارير المبيعات",
  "reports-inventory": "تقارير المخزون",
  "purchase-headers": "فواتير المشتريات",
  "used-purchase-headers": "مشتريات مستخدمة",
  "purchase-returns": "مرتجعات المشتريات",
  "purchase-returnable": "مرتجع المشتريات",
  "reports-purchases": "تقارير المشتريات",
  "maintenance-tickets": "تذاكر الصيانة",
  "reports-maintenance": "تقارير الصيانة",
  "reports-expenses": "تقارير المصروفات",
  "reports-profit-loss": "تقارير الأرباح والخسائر",
  "reports-salaries": "تقارير الرواتب",
  "salary-assignments": "تعيينات الرواتب",
  "salary-payments": "مدفوعات الرواتب",
  "opening-stock": "المخزون الافتتاحي",
  settings: "الإعدادات",
  users: "المستخدمين",
  "audit-logs": "سجل النشاطات",
  more: "المزيد",
  menu: "القائمة",
  logout: "تسجيل الخروج",
};

const SidebarMobile = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [isExpanded, setIsExpanded] = useState(false);
  const canViewReports = isAdminUser();

  const navItems = [
    { key: "products", href: "/products", icon: Package },
    { key: "expenses", href: "/expenses", icon: DollarSign },
    { key: "categories", href: "/categories", icon: Tags },
    { key: "suppliers", href: "/suppliers", icon: Users },
    { key: "brands", href: "/brands", icon: Bookmark },
  ];

  const navGroups = [
    {
      section: "الرئيسية",
      items: [
        { key: "dashboard", href: "/", icon: LayoutDashboard },
      ],
    },
    {
      section: "المبيعات",
      items: [
        { key: "pos", href: "/pos", icon: ShoppingCart },
        { key: "sales-headers", href: "/sales-headers", icon: Receipt },
        { key: "sales-returns", href: "/sales-returns", icon: RotateCcw },
        { key: "sales-returnable", href: "/sales-returnable", icon: Undo2 },
        { key: "customers", href: "/customers", icon: Users },
        { key: "reports-sales", href: "/reports/sales", icon: BarChart3 },
      ],
    },
    {
      section: "المشتريات",
      items: [
        { key: "suppliers", href: "/suppliers", icon: Truck },
        { key: "purchase-headers", href: "/purchase-headers", icon: Package },
        { key: "used-purchase-headers", href: "/used-purchase-headers", icon: Package },
        { key: "purchase-returns", href: "/purchase-returns", icon: RotateCcw },
        { key: "purchase-returnable", href: "/purchase-returnable", icon: Undo2 },
        { key: "reports-purchases", href: "/reports/purchases", icon: BarChart3 },
      ],
    },
    {
      section: "المخزون",
      items: [
        { key: "products", href: "/products", icon: Package },
        { key: "categories", href: "/categories", icon: Tags },
        { key: "brands", href: "/brands", icon: Bookmark },
        { key: "opening-stock", href: "/opening-stock", icon: Warehouse },
        { key: "reports-inventory", href: "/reports/inventory", icon: BarChart3 },
      ],
    },
    {
      section: "الخدمات",
      items: [
        { key: "maintenance-tickets", href: "/maintenance-tickets", icon: Wrench },
        { key: "reports-maintenance", href: "/reports/maintenance", icon: BarChart3 },
      ],
    },
    {
      section: "المالية",
      items: [
        { key: "expenses", href: "/expenses", icon: DollarSign },
        { key: "salary-assignments", href: "/salary-assignments", icon: DollarSign },
        { key: "salary-payments", href: "/salary-payments", icon: DollarSign },
        { key: "reports-profit-loss", href: "/reports/profit-loss", icon: BarChart3 },
        { key: "reports-expenses", href: "/reports/expenses", icon: BarChart3 },
        { key: "reports-salaries", href: "/reports/salaries", icon: BarChart3 },
      ],
    },
    {
      section: "الإعدادات",
      items: [
        { key: "settings", href: "/settings", icon: Settings },
        { key: "users", href: "/users", icon: Users },
        { key: "audit-logs", href: "/audit-logs", icon: ScrollText },
      ],
    },
  ];

  const visibleNavGroups = navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => canViewReports || (!isReportLink(item.href) && !isAdminLink(item.href) && item.href !== "/users" && item.href !== "/settings")),
  }));

  const handleExpand = () => setIsExpanded((prev) => !prev);

  const renderNavLink = (item) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;
    return (
      <NavLink
        key={item.href}
        to={item.href}
        onClick={() => setIsExpanded(false)}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300
          ${
            isActive
              ? "bg-black dark:bg-white text-white dark:text-black shadow-md scale-[1.02]"
              : "text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
        <span className="font-medium whitespace-nowrap">
          {labels[item.key]}
        </span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Bottom Bar */}
      <div
        className={`fixed bottom-2 left-2 right-2 flex justify-around items-center
        bg-white/20 dark:bg-black/20 backdrop-blur-xl shadow-2xl border border-white/40 dark:border-white/15
        rounded-2xl z-50 md:hidden max-w-[95%] mx-auto h-[68px]`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? "bg-black dark:bg-white text-white dark:text-black px-3"
                    : "text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              onClick={() => setIsExpanded(false)}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                {isActive && (
                  <span className="text-xs font-medium">
                    {labels[item.key]}
                  </span>
                )}
              </div>
            </NavLink>
          );
        })}

        {/* Expand Button */}
        <button
          onClick={handleExpand}
          className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300
            ${
              isExpanded
                ? "bg-black dark:bg-white text-white dark:text-black px-3"
                : "text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
        >
          <ChevronUp
            size={20}
            className={`${isExpanded ? "rotate-180" : ""} transition-transform`}
          />
          {isExpanded && (
            <span className="text-xs font-medium ml-2">
              {labels.more}
            </span>
          )}
        </button>
      </div>

      {/* Bottom Drawer Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-500
          ${isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleExpand}
        />

        <div
          className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1F1F23] rounded-t-3xl shadow-2xl border-t
            transition-transform duration-500 ${isExpanded ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-300 dark:border-gray-600">
            <h1 className="text-xl font-semibold">{labels.menu}</h1>
            <button
              onClick={handleExpand}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto pb-4 px-4">
            {visibleNavGroups.map((group) => (
              <div key={group.section} className="mb-2">
                <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {group.section}
                </p>
                {group.items.map(renderNavLink)}
              </div>
            ))}

            <button
              onClick={() => {
                removeAuthToken();
                localStorage.removeItem("user");
                window.location.href = "/auth/login";
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 w-full hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400"
            >
              <LogOut
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={1.5}
              />
              <span className="font-medium whitespace-nowrap">
                {labels.logout}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMobile;
