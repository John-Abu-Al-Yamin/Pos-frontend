import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useLogin from "@/hooks/Actions/auth/useLogin";

const loginText = {
  title: "مرحبًا بعودتك",
  description: "أدخل بيانات حسابك لتسجيل الدخول",
  email: "البريد الإلكتروني",
  emailPlaceholder: "أدخل البريد الإلكتروني",
  password: "كلمة المرور",
  passwordPlaceholder: "أدخل كلمة المرور",
  invalidEmail: "البريد الإلكتروني غير صالح",
  passwordLength: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
  signIn: "تسجيل الدخول",
  signingIn: "جاري تسجيل الدخول...",
  loginError: "تعذر تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مرة أخرى.",
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending, isError, setErrorMsg } = useLogin();

  const LoginSchema = z.object({
    email: z.string().email({
      message: loginText.invalidEmail,
    }),
    password: z.string().min(6, {
      message: loginText.passwordLength,
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
    setErrorMsg(null);
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
    <div
      dir="rtl"
      className="w-full h-full flex flex-col justify-center max-w-md mx-auto bg-transparent rounded-2xl p-6 dark:bg-card"
    >
      {/* Header */}
      <div className="space-y-1 text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-primary dark:bg-primary rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary-foreground dark:text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground dark:text-foreground">
          {loginText.title}
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground">
          {loginText.description}
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
            {loginText.email}
          </Label>
          <div className="relative">
            <Mail className="absolute top-3 right-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder={loginText.emailPlaceholder}
              {...register("email")}
              className="bg-background dark:bg-background border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground text-right pr-10 pl-3"
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
            {loginText.password}
          </Label>
          <div className="relative">
            <Lock className="absolute top-3 right-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={loginText.passwordPlaceholder}
              {...register("password")}
              className="bg-background dark:bg-background border-border dark:border-border text-foreground placeholder:text-muted-foreground text-right pr-10 pl-3"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 left-3 text-muted-foreground hover:text-foreground"
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

        {isError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {loginText.loginError}
          </p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isPending}
        >
          {isPending ? loginText.signingIn : loginText.signIn}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
