import React from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

import CustomHeader from "@/customs/CustomHeader";
import CustomPagination from "@/customs/CustomPagination";
import Loading from "@/customs/Loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  useGetAllSalaryAssignments,
  useDeleteSalaryAssignment,
} from "@/hooks/Actions/Salary/useCurdsSalaryAssignments";
import useSearch from "@/hooks/useSearch/useSearch";
import { formatDate, formatCurrency } from "@/lib/utils";

const SalaryAssignmentsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const { debouncedSearch, search, handelSearch, setSearch } = useSearch("", 400);

  const filters = {
    search: debouncedSearch || undefined,
  };

  const { data, isPending, refetch } = useGetAllSalaryAssignments(page, per_page, filters);
  const { mutate: deleteMutate } = useDeleteSalaryAssignment();

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const clearFilters = () => {
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch;

  const confirmDelete = (id) => {
    toast("هل أنت متأكد من الحذف؟", {
      action: { label: "نعم", onClick: () => deleteMutate({ id }, { onSuccess: () => refetch() }) },
      duration: Infinity,
    });
  };

  if (isPending) return <Loading />;

  const assignments = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div>
      <CustomHeader
        title="تخصيصات الرواتب"
        description="قائمة تخصيصات الرواتب"
        buttonText="تخصيص"
        onButtonClick={() => navigate("/salary-assignments/add")}
      />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="relative w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث باسم الموظف..."
            value={search}
            onChange={handelSearch}
            className="pr-9"
          />
        </div>

        {hasActiveFilters && (
          <Button variant="outline" size="icon" onClick={clearFilters} title="مسح الفلترة">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">الموظف</TableHead>
              <TableHead className="text-right">الراتب الأساسي</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((item, index) => {
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.user?.name || "—"}</TableCell>
                  <TableCell>{item.base_salary ? formatCurrency(item.base_salary) : "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/salary-assignments/update/${item.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {assignments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  لا توجد تخصيصات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CustomPagination pagination={pagination} onPageChange={(p) => setPage(p)} />
    </div>
  );
};

export default SalaryAssignmentsPage;
