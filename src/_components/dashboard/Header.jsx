import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useTranslation } from "next-i18next";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
    
    const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-yellow-400 to-yellow-500 p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        {/* العنوان */}
        <h1 className="text-xl font-bold text-gray-900">
          {t("dashboard.welcomeBack")} Anas
        </h1>

        {/* اليمين Buttons */}
        <div className="flex gap-x-4">
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full bg-white/90 hover:bg-white"
          >
            <Bell className="h-5 w-5 text-gray-700" />
          </Button>

          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src="/professional-man.jpg" />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              A
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Header;
