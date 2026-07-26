import React from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppModalAdd from "@/customs/AppModalAdd";
import { useAddUser } from "@/hooks/Actions/users/useCurdsUsers";

const CreateUserModal = ({ open, onOpenChange, onSuccess }) => {
  const { mutate, isPending, isError, error } = useAddUser();

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (!open) {
      setForm({ name: "", email: "", password: "", password_confirmation: "" });
      setErrors({});
    }
  }, [open]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "الاسم مطلوب";
    if (!form.email.trim()) errs.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "البريد الإلكتروني غير صالح";
    if (!form.password) errs.password = "كلمة المرور مطلوبة";
    else if (form.password.length < 6)
      errs.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    if (!form.password_confirmation)
      errs.password_confirmation = "تأكيد كلمة المرور مطلوب";
    else if (form.password !== form.password_confirmation)
      errs.password_confirmation = "كلمة المرور غير متطابقة";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutate(
      {
        data: {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          password_confirmation: form.password_confirmation,
        },
      },
      {
        onSuccess: () => {
          // toast.success("تم إنشاء المستخدم بنجاح");
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
        onError: (err) => {
          const msg = err?.response?.data?.message || "حدث خطأ أثناء إنشاء المستخدم";
          toast.error(msg);
        },
      },
    );
  };

  const apiError = isError
    ? error?.response?.data?.message || "حدث خطأ أثناء إنشاء المستخدم"
    : null;

  return (
    <AppModalAdd
      open={open}
      onOpenChange={onOpenChange}
      title="إضافة مستخدم جديد"
      description="إنشاء حساب موظف جديد في النظام"
      onSubmit={handleSubmit}
      isLoading={isPending}
      submitText={isPending ? "جاري الإنشاء..." : "إنشاء المستخدم"}
      error={apiError}
      size="md"
    >
      <div className="space-y-4" dir="rtl">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">
            الاسم الكامل <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="أدخل الاسم الكامل"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            البريد الإلكتروني <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="example@domain.com"
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">
            كلمة المرور <span className="text-destructive">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="أدخل كلمة المرور"
            className={errors.password ? "border-destructive" : ""}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password_confirmation" className="text-sm font-medium">
            تأكيد كلمة المرور <span className="text-destructive">*</span>
          </Label>
          <Input
            id="password_confirmation"
            type="password"
            value={form.password_confirmation}
            onChange={handleChange("password_confirmation")}
            placeholder="أعد إدخال كلمة المرور"
            className={errors.password_confirmation ? "border-destructive" : ""}
          />
          {errors.password_confirmation && (
            <p className="text-xs text-destructive">{errors.password_confirmation}</p>
          )}
        </div>
      </div>
    </AppModalAdd>
  );
};

export default CreateUserModal;
