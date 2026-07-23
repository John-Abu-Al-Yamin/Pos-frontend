import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AddEditHeader from "@/customs/AddEditHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Loading from "@/customs/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import endPoints from "@/hooks/EndPoints/endPoints";
import {
  useGetSalaryAssignmentById,
  useUpdateSalaryAssignment,
} from "@/hooks/Actions/Salary/useCurdsSalaryAssignments";
import { useGetAllUsers } from "@/hooks/Actions/users/useCurdsUsers";
import { salaryAssignmentSchema } from "@/validation/salaryAssignment/salaryAssignment";

const UpdateSalaryAssignment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: assignmentData, isPending: isFetching } = useGetSalaryAssignmentById(id);
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateSalaryAssignment();
  const { data: usersData } = useGetAllUsers(1, 500, { role: "employee" });

  const assignment = assignmentData?.data?.data;
  const users = usersData?.data?.data ?? [];

  const form = useForm({
    resolver: zodResolver(salaryAssignmentSchema),
    defaultValues: {
      user_id: "",
      base_salary: "",
      reason: "",
    },
  });

  React.useEffect(() => {
    if (assignment) {
      form.reset({
        user_id: String(assignment.user_id),
        base_salary: assignment.base_salary ? String(assignment.base_salary) : "",
        reason: assignment.reason || "",
      });
    }
  }, [assignment, form]);

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      user_id: Number(formData.user_id),
      base_salary: formData.base_salary ? Number(formData.base_salary) : undefined,
      reason: formData.reason || undefined,
    };

    updateMutate(
      { data: payload, url: `${endPoints.salaryAssignments}/${id}` },
      { onSuccess: () => navigate("/salary-assignments") },
    );
  };

  if (isFetching) return <Loading />;

  return (
    <div>
      <AddEditHeader
        title="تعديل تخصيص الراتب"
        description="تحديث بيانات تخصيص الراتب"
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
                  <Select onValueChange={field.onChange} value={field.value} key={field.value}>
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
            <Label htmlFor="reason">السبب</Label>
            <Textarea id="reason" rows={3} {...form.register("reason")} />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "جاري التحديث..." : "تحديث"}
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

export default UpdateSalaryAssignment;
