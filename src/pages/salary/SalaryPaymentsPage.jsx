import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCheck, XCircle, Plus, Search, X } from "lucide-react";
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
  useGetAllSalaryPayments,
  useConfirmSalaryPayment,
  useCancelSalaryPayment,
} from "@/hooks/Actions/Salary/useCurdsSalaryPayments";
import useSearch from "@/hooks/useSearch/useSearch";
import { formatDate, formatCurrency } from "@/lib/utils";

const statusConfig = {
  draft: { label: "مسودة", className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "مؤكد", className: "bg-green-100 text-green-800" },
  cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
};

const statusOptions = [
  { value: "draft", label: "مسودة" },
  { value: "confirmed", label: "مؤكد" },
  { value: "cancelled", label: "ملغي" },
];

const SalaryPaymentsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const [filterStatus, setFilterStatus] = React.useState("");
  const { debouncedSearch, search, handelSearch, setSearch } = useSearch("", 400);

  const filters = {
    search: debouncedSearch || undefined,
    status: filterStatus || undefined,
  };

  const { data, isPending, refetch } = useGetAllSalaryPayments(page, per_page, filters);
  const { mutate: confirmMutate } = useConfirmSalaryPayment();
  const { mutate: cancelMutate } = useCancelSalaryPayment();

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus]);

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("");
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || filterStatus;

  const handleConfirm = (id) => {
    toast("تأكيد هذه الدفعة يعني أن الموظف قد استلم الراتب. سيتم تعيين تاريخ الدفع تلقائياً.", {
      action: {
        label: "تأكيد",
        onClick: () => confirmMutate(id, { onSuccess: () => refetch() }),
      },
      duration: Infinity,
    });
  };

  const handleCancel = (id) => {
    toast("هل أنت متأكد من إلغاء الدفعة؟", {
      action: { label: "نعم", onClick: () => cancelMutate(id, { onSuccess: () => refetch() }) },
      duration: Infinity,
    });
  };

  if (isPending) return <Loading />;

  const payments = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div>
      <CustomHeader
        title="دفعات الرواتب"
        description="قائمة دفعات الرواتب"
        buttonText="دفعة"
        onButtonClick={() => navigate("/salary-payments/add")}
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

        <div className="w-44">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="الحالة" />
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
              <TableHead className="text-right">رقم الدفعة</TableHead>
              <TableHead className="text-right">الموظف</TableHead>
              <TableHead className="text-right">المبلغ الإجمالي</TableHead>
              <TableHead className="text-right">تاريخ الدفع</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment, index) => {
              const status = statusConfig[payment.status] || statusConfig.draft;
              return (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-mono text-xs">{payment.payment_number}</TableCell>
                  <TableCell>{payment.user?.name || "—"}</TableCell>
                  <TableCell>{formatCurrency(payment.total_amount)}</TableCell>
                  <TableCell>{payment.payment_date ? formatDate(payment.payment_date) : "—"}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/salary-payments/details/${payment.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        عرض
                      </Button>
                      {payment.status === "draft" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleConfirm(payment.id)}
                          >
                            <CheckCheck className="h-4 w-4" />
                            تأكيد
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancel(payment.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            إلغاء
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  لا توجد دفعات
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

export default SalaryPaymentsPage;
