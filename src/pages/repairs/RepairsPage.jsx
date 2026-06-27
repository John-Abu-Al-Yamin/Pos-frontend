import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Search,
  X,
  Wrench,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  CreditCard,
} from "lucide-react";

import { useGetAllRepairs } from "@/hooks/Actions/repairs/useCurdsRepairs";
import CustomHeader from "@/customs/CustomHeader";
import Loading from "@/customs/Loading";
import CustomPagination from "@/customs/CustomPagination";
import { Badge } from "@/components/ui/badge";
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
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const STATUS_OPTIONS = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "in_progress", label: "قيد الإصلاح" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

const STATUS_BADGE = {
  pending: {
    variant: "outline",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  in_progress: {
    variant: "outline",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  completed: {
    variant: "outline",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: {
    variant: "outline",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

const PAYMENT_STATUS_BADGE = {
  pending: { variant: "outline", className: "bg-red-50 text-red-700 border-red-200" },
  partial: { variant: "outline", className: "bg-amber-50 text-amber-700 border-amber-200" },
  paid: { variant: "outline", className: "bg-green-50 text-green-700 border-green-200" },
};

const STATUS_ICON = {
  pending: Clock,
  in_progress: Loader2,
  completed: CheckCircle,
  cancelled: XCircle,
};

const FILTER_DEBOUNCE = 300;

const RepairsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 10;
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), FILTER_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [search]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const { data, isPending } = useGetAllRepairs({
    page,
    per_page,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
  });

  const repairs = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  const hasActiveFilters = debouncedSearch || statusFilter;

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
    setPage(1);
  };

  if (isPending) return <Loading />;

  return (
    <div>
      <CustomHeader
        title="أوامر الإصلاح"
        description="قائمة بجميع أوامر الإصلاح"
        buttonText="أمر إصلاح"
        onButtonClick={() => navigate("/repairs/add")}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            dir="rtl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بكود المرجع، الجهاز، العميل..."
            className="w-full pr-9 pl-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Select
          value={statusFilter || undefined}
          onValueChange={(v) => setStatusFilter(v ?? "")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
            مسح الكل
          </button>
        )}
      </div>

      <div className="rounded-md border bg-white shadow-sm mt-4" dir="rtl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">كود المرجع</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">الجهاز</TableHead>
              <TableHead className="text-right">التكلفة التقديرية</TableHead>
              <TableHead className="text-right">المدفوع</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">تاريخ التسليم</TableHead>
              <TableHead className="text-right">الأجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repairs.map((repair) => {
              const StatusIcon = STATUS_ICON[repair.status] || Clock;
              const badge = STATUS_BADGE[repair.status] || STATUS_BADGE.pending;
              return (
                <TableRow key={repair.id}>
                  <TableCell className="font-medium">{repair.id}</TableCell>
                  <TableCell className="text-xs font-mono">
                    {repair.reference_code}
                  </TableCell>
                  <TableCell>
                    {repair.customer_name || repair.customer?.name || "—"}
                  </TableCell>
                  <TableCell>{repair.device_type}</TableCell>
                  <TableCell className="font-semibold">
                    {Number(repair.estimated_cost).toLocaleString("ar-EG")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {Number(repair.deposit) > 0 ? (
                        <>
                          <span className="text-xs text-muted-foreground">مدفوع: {Number(repair.deposit).toLocaleString("ar-EG")}</span>
                          {repair.status !== "cancelled" && (
                            <span className={`text-xs font-semibold ${(Number(repair.estimated_cost) - Number(repair.deposit)) > 0 ? "text-destructive" : "text-green-600"}`}>
                              باقي: {(Number(repair.estimated_cost) - Number(repair.deposit)).toLocaleString("ar-EG")}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant="outline"
                        className={`gap-1 ${badge.className}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {STATUS_OPTIONS.find((s) => s.value === repair.status)
                          ?.label || repair.status}
                      </Badge>
                      {repair.status === "completed" && repair.payment_status && repair.payment_status !== "paid" && (
                        <Badge
                          variant="outline"
                          className={`gap-1 text-xs ${PAYMENT_STATUS_BADGE[repair.payment_status]?.className || ""}`}
                        >
                          <CreditCard className="h-3 w-3" />
                          {repair.payment_status === "pending" ? "غير مدفوع" : "مدفوع جزئياً"}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {repair.expected_delivery_date || "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/repairs/${repair.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {repairs.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            لا توجد أوامر إصلاح تطابق البحث.
          </div>
        )}

        <CustomPagination
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default RepairsPage;
