import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useLogin from "@/hooks/Actions/auth/useLogin";

const LoginForm = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending, isError, errorMsg, setErrorMsg } = useLogin();

  const LoginSchema = z.object({
    email: z.string().email({
      message: isRtl ? "البريد الإلكتروني غير صالح" : "Invalid email address",
    }),
    password: z.string().min(8, {
      message: isRtl
        ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
        : "Password must be at least 8 characters",
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data) => {
    mutate(
      { data: data },
      {
        onSuccess: () => {
          navigate("/");
        },
      },
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-center  max-w-md mx-auto bg-transparent rounded-2xl p-6 dark:bg-card">
      {/* Header */}
      <div className="space-y-1 text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-primary dark:bg-primary rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary-foreground dark:text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground dark:text-foreground">
          {t("login.welcomeBack")}
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground">
          {t("login.enterCredentials")}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-foreground dark:text-foreground"
          >
            {t("login.email")}
          </Label>
          <div className="relative">
            <Mail
              className={`absolute top-3 h-4 w-4 text-muted-foreground ${
                isRtl ? "right-3" : "left-3"
              }`}
            />
            <Input
              id="email"
              type="email"
              placeholder={t("login.emailPlaceholder")}
              {...register("email")}
              className={`bg-background dark:bg-background border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground
                ${isRtl ? "pr-10 pl-3" : "pl-10 pr-3"}`}
            />
          </div>
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-foreground dark:text-foreground"
          >
            {t("login.password")}
          </Label>
          <div className="relative">
            <Lock
              className={`absolute top-3 h-4 w-4 text-muted-foreground ${
                isRtl ? "right-3" : "left-3"
              }`}
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("login.passwordPlaceholder")}
              {...register("password")}
              className={`bg-background dark:bg-background border-border dark:border-border text-foreground placeholder:text-muted-foreground
                ${isRtl ? "pr-10 pl-3" : "pl-10 pr-3"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-3 text-muted-foreground hover:text-foreground ${
                isRtl ? "left-3" : "right-3"
              }`}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border dark:border-border"
            />
            <span className="text-muted-foreground">
              {t("login.rememberMe")}
            </span>
          </label>

          <Link
            to="/auth/forgot-password"
            className="text-foreground hover:underline"
          >
            {t("login.forgotPassword")}
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isPending}
        >
          {isPending ? t("login.signingIn") : t("login.signIn")}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
