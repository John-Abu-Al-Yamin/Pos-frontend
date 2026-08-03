import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AddEditHeader from "@/customs/AddEditHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllUsers,
} from "@/hooks/Actions/users/useCurdsUsers";
import { useAddSalaryAssignment } from "@/hooks/Actions/Salary/useCurdsSalaryAssignments";
import { salaryAssignmentSchema } from "@/validation/salaryAssignment/salaryAssignment";

const AddSalaryAssignment = () => {
  const navigate = useNavigate();

  const { mutate: addMutate, isPending } = useAddSalaryAssignment();
  const { data: usersData } = useGetAllUsers(1, 500, { role: "employee" });

  const users = usersData?.data?.data ?? [];

  const form = useForm({
    resolver: zodResolver(salaryAssignmentSchema),
    defaultValues: {
      user_id: "",
      base_salary: "",
      reason: "",
    },
  });

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      user_id: Number(formData.user_id),
      base_salary: formData.base_salary ? Number(formData.base_salary) : undefined,
      reason: formData.reason || undefined,
    };

    addMutate(
      { data: payload },
      { onSuccess: () => navigate("/salary-assignments") },
    );
  };

  return (
    <div>
      <AddEditHeader
        title="إضافة تخصيص راتب"
        description="أدخل بيانات تخصيص الراتب"
        backPath="/salary-assignments"
        backText="رجوع"
      />

      <div className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user_id">الموظف</Label>
              <Controller
                name="user_id"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر الموظف" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.user_id && (
                <p className="text-sm text-destructive">{form.formState.errors.user_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="base_salary">الراتب الأساسي</Label>
              <Input
                id="base_salary"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...form.register("base_salary")}
              />
              {form.formState.errors.base_salary && (
                <p className="text-sm text-destructive">{form.formState.errors.base_salary.message}</p>
              )}
            </div>

          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">الوصف</Label>
            <Textarea id="reason" rows={3} {...form.register("reason")} />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/salary-assignments")}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalaryAssignment;
