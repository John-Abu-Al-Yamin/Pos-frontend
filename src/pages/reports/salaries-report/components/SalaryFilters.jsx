import React from "react";
import { Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

const periodOptions = [
  { value: "today", label: "اليوم" },
  { value: "yesterday", label: "أمس" },
  { value: "this_week", label: "هذا الأسبوع" },
  { value: "last_week", label: "الأسبوع الماضي" },
  { value: "this_month", label: "هذا الشهر" },
  { value: "last_month", label: "الشهر الماضي" },
  { value: "this_year", label: "هذا العام" },
  { value: "all_time", label: "كل الفترات" },
  { value: "custom", label: "مخصص" },
];

const statusOptions = [
  { value: "all", label: "كل الحالات" },
  { value: "draft", label: "مسودة" },
  { value: "confirmed", label: "مؤكد" },
  { value: "cancelled", label: "ملغي" },
];

const groupByOptions = [
  { value: "default", label: "الشهر" },
  { value: "day", label: "يوم" },
  { value: "week", label: "أسبوع" },
  { value: "month", label: "شهر" },
  { value: "year", label: "سنة" },
];

const SalaryFilters = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
  hasActiveFilters,
}) => {
  const isCustom = filters.period === "custom";

  const { data: usersData } = useGetData({
    url: endPoints.users,
    params: { per_page: 1000 },
    queryKeys: [queryKeys.users],
  });

  const users = usersData?.data?.data ?? [];

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            تصفية التقرير
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">الفترة</Label>
            <Select
              value={filters.period || "this_month"}
              onValueChange={(v) => onFilterChange("period", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الفترة" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isCustom && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">من تاريخ</Label>
                <Input
                  type="date"
                  value={filters.date_from || ""}
                  onChange={(e) => onFilterChange("date_from", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">إلى تاريخ</Label>
                <Input
                  type="date"
                  value={filters.date_to || ""}
                  onChange={(e) => onFilterChange("date_to", e.target.value)}
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">الحالة</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(v) => onFilterChange("status", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="كل الحالات" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">الموظف</Label>
            <Select
              value={filters.created_by || ""}
              onValueChange={(v) => onFilterChange("created_by", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="كل الموظفين" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">تجميع حسب</Label>
            <Select
              value={filters.group_by || "default"}
              onValueChange={(v) => onFilterChange("group_by", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="الشهر" />
              </SelectTrigger>
              <SelectContent>
                {groupByOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button onClick={onApply} size="sm">
            <Search className="h-4 w-4 ml-1" />
            تطبيق الفلاتر
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onReset}>
              <X className="h-4 w-4 ml-1" />
              إعادة تعيين
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalaryFilters;
