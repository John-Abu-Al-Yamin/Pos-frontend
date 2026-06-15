import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({
  errorCode = "404",
  title = "الصفحة غير موجودة",
  message = "عذرًا، الصفحة التي تبحث عنها غير متاحة أو تم نقلها.",
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background flex items-center justify-center px-4"
    >
      <div className="max-w-2xl w-full text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-foreground mb-4">
            {errorCode}
          </h1>
          <div className="h-1 w-32 bg-primary mx-auto rounded-full" />
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row-reverse gap-4 justify-center">
          <Button onClick={handleGoHome} className="w-48 py-6">
            الصفحة الرئيسية
          </Button>

          <Button
            variant="outline"
            onClick={handleGoBack}
            className="w-40 py-6"
          >
            رجوع
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;