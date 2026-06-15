import LanguageSwitcher from "@/_components/LanguageSwitcher";
import { LogOutIcon } from "lucide-react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      {/* Header */}
      {/* <header className="w-full border-b border-border bg-card shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <LogOutIcon className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">Auth</h1>
          </div>

          <LanguageSwitcher isSidebarOpen={true} />
        </div>
      </header> */}
      <div
        className={`flex items-center justify-center h-[90vh] bg-background dark:bg-background`}
      >
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
