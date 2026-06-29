import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Tags, Smartphone, Users, X, ChevronUp, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { removeAuthToken } from "@/services/cookies";

const SidebarMobile = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const location = useLocation();
  const pathname = location.pathname;
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { key: "categories", href: "/categories", icon: Tags },
    { key: "products", href: "/products", icon: Smartphone },
    { key: "suppliers", href: "/suppliers", icon: Users },
  ];

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
          {t(`sidebar.${item.key}`)}
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
                    {t(`sidebar.${item.key}`)}
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
              {t("sidebar.more")}
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
            <h1 className="text-xl font-semibold">{t("sidebar.menu")}</h1>
            <button
              onClick={handleExpand}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto pb-4 px-4 space-y-2">
            {navItems.map(renderNavLink)}

            <button
              onClick={() => {
                removeAuthToken();
                window.location.href = "/auth/login";
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 w-full hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400"
            >
              <LogOut
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={1.5}
              />
              <span className="font-medium whitespace-nowrap">
                {t("sidebar.logout")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMobile;
