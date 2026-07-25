import React from "react";
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
  Menu,
  Settings,
  LogOut,
  ChevronDown,
  Percent,
  Wrench,
  DollarSign,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { removeAuthToken } from "@/services/cookies";

const settingsItems = [
  { key: "الربح", href: "/settings", icon: Percent },
];

const SidebarSettingsDropdown = ({ isOpen }) => {
  const [expanded, setExpanded] = React.useState(false);
  const location = useLocation();
  const isActive = location.pathname.startsWith("/settings");
  const hasActiveChild = settingsItems.some(
    (item) => location.pathname === item.href,
  );

  const toggle = () => setExpanded((prev) => !prev);

  React.useEffect(() => {
    if (hasActiveChild) {
      setExpanded(true);
    }
  }, [hasActiveChild]);

  return (
    <div>
      <button
        onClick={toggle}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium w-full cursor-pointer transition-all duration-300 ease-in-out ${
          isActive || expanded
            ? "bg-black text-white"
            : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
        }`}
      >
        <Settings
          className={`h-[18px] w-[18px] shrink-0 transition-transform duration-300 ease-in-out ${
            expanded ? "scale-110" : ""
          }`}
          strokeWidth={1.5}
        />
        <span
          className={`flex items-center justify-between flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
          }`}
        >
          <span>الاعدادات</span>
          <ChevronDown
            className={`h-4 w-4 transition-all duration-300 ease-in-out ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded && isOpen
            ? "grid-rows-[1fr] opacity-100 mt-1"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mr-5 border-r-2 border-gray-200 dark:border-gray-700 pr-3 space-y-1 py-0.5">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
                      isActive
                        ? "bg-black/10 dark:bg-white/10 text-black dark:text-white shadow-sm"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`
                  }
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-all duration-200 ${
                      hasActiveChild ? "opacity-70" : ""
                    }`}
                    strokeWidth={1.5}
                  />
                  <span>{item.key}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onToggle }) => {
  const { i18n } = useTranslation();

  const navGroups = [
    {
      section: "المبيعات",
      items: [
        { key: "نقطة البيع", href: "/pos", icon: ShoppingCart },
        { key: "فواتير البيع", href: "/sales-headers", icon: Receipt },
        { key: "مرتجعات البيع", href: "/sales-returns", icon: RotateCcw },
        { key: "إنشاء مرتجع بيع", href: "/sales-returnable", icon: Undo2 },
        { key: "العملاء", href: "/customers", icon: Users },
      ],
    },
    {
      section: "المخزون",
      items: [
        { key: "المنتجات", href: "/products", icon: Package },
        { key: "التصنيفات", href: "/categories", icon: Tags },
        { key: "العلامات التجارية", href: "/brands", icon: Bookmark },
      ],
    },
    {
      section: "المشتريات",
      items: [
        { key: "الموردين", href: "/suppliers", icon: Truck },
        { key: "المشتريات", href: "/purchase-headers", icon: Package },
        { key: "مشتريات المستعمل", href: "/used-purchase-headers", icon: Package },
        { key: "مرتجعات الشراء", href: "/purchase-returns", icon: RotateCcw },
        { key: "إنشاء مرتجع شراء", href: "/purchase-returnable", icon: Undo2 },
      ],
    },
    {
      section: "الخدمات",
      items: [
        { key: "الصيانة", href: "/maintenance-tickets", icon: Wrench },
      ],
    },
    {
      section: "المالية",
      items: [
        { key: "المصروفات", href: "/expenses", icon: DollarSign },
        { key: "تخصيصات الرواتب", href: "/salary-assignments", icon: DollarSign },
        { key: "دفعات الرواتب", href: "/salary-payments", icon: DollarSign },
      ],
    },
  ];
  return (
    <div
      className={`fixed top-0 h-screen dark:bg-[#1F1F23] flex flex-col transition-all duration-300 bg-sidebar 
    ${isOpen ? "md:w-56" : "md:w-[58px]"}
    
    ${i18n?.language === "ar" ? "right-0 border-l" : "left-0 border-r"}`}
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between px-4 pt-6">
        {isOpen && (
          <h1 className="text-xl font-semibold tracking-tight text-sidebar-foreground dark:text-sidebar-foreground">
            POS
            <span className="inline-block w-8 border-b-2 border-sidebar-foreground dark:border-sidebar-foreground mx-1"></span>
            System
          </h1>
        )}

        <button className="p-1" onClick={() => onToggle((prev) => !prev)}>
          <Menu className="text-gray-700 dark:text-gray-200" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.section}>
            {isOpen && (
              <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {group.section}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.key}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-black text-white"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`
                  }
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                  <span
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
                    }`}
                  >
                    {item.key}
                  </span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Settings + Language */}
      <div className="px-2 mb-4 flex flex-col gap-2">
        <SidebarSettingsDropdown isOpen={isOpen} />

        <button
          onClick={() => {
            removeAuthToken();
            window.location.href = "/auth/login";
          }}
          className={`flex items-center gap-3 bg-red-50 cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 w-full hover:bg-red-100 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400`}
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.5} />
          <span
            className={`transition-all duration-300 text-start ${
              isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
            }`}
          >
            تسجيل الخروج
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
