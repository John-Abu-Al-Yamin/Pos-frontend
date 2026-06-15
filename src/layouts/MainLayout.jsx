import { useState } from "react";
import Sidebar from "@/_components/Sidebar/Sidebar";
import SidebarMobil from "@/_components/Sidebar/SidebarMobil";
import { useTranslation } from "next-i18next";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const marginClass =
    i18n?.language === "ar"
      ? sidebarOpen
        ? "mr-0 md:mr-56"
        : "mr-0 md:mr-[58px]"
      : sidebarOpen
        ? "ml-0 md:ml-56"
        : "ml-0 md:ml-[58px]";

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
        <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />
      </div>

      {/* Sidebar for mobile */}
      <div className="block md:hidden">
        <SidebarMobil />
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${marginClass}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
