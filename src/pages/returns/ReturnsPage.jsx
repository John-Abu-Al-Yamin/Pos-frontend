import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Search, X, Package, CheckCircle2, AlertTriangle } from "lucide-react";

import { useGetAllReturns } from "@/hooks/Actions/returns/useCurdsReturns";
import CustomHeader from "@/customs/CustomHeader";
import Loading from "@/customs/Loading";
import CustomPagination from "@/customs/CustomPagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const REFUND_METHODS = [
  { value: "cash", label: "نقدي" },
  { value: "card", label: "بطاقة" },
  { value: "bank_transfer", label: "تحويل بنكي" },
];

const CONDITION_LABELS = {
  new: { label: "جديد", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  fair: { label: "مقبول", color: "bg-amber-50 text-amber-700 border-amber-200" },
  damaged: { label: "تالف", color: "bg-red-50 text-red-700 border-red-200" },
};

const CONDITION_ICONS = {
  new: CheckCircle2,
  fair: AlertTriangle,
  damaged: AlertTriangle,
};

const FILTER_DEBOUNCE = 300;

const ReturnsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 10;
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [refundMethod, setRefundMethod] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), FILTER_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [search]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, refundMethod]);

  const { data, isPending } = useGetAllReturns({
    page,
    per_page,
    search: debouncedSearch || undefined,
    refund_method: refundMethod || undefined,
  });

  const returns = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  const hasActiveFilters = debouncedSearch || refundMethod;

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setRefundMethod("");
    setPage(1);
  };

  if (isPending) return <Loading />;

  return (
    <div>
      <CustomHeader
        title="المرتجعات"
        description="قائمة عمليات الإرجاع والاسترداد"
        buttonText="عودة للمبيعات"
        onButtonClick={() => navigate("/sales")}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            dir="rtl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بكود المرجع، العميل، المنتج..."
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
          value={refundMethod || undefined}
          onValueChange={(v) => setRefundMethod(v ?? "")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="طريقة الاسترداد" />
          </SelectTrigger>
          <SelectContent>
            {REFUND_METHODS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
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
              <TableHead className="text-right">فاتورة البيع</TableHead>
              <TableHead className="text-right">المنتجات</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">المبلغ المسترد</TableHead>
              <TableHead className="text-right">طريقة الاسترداد</TableHead>
              <TableHead className="text-right">الأجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returns.map((ret) => (
              <TableRow key={ret.id}>
                <TableCell className="font-medium">{ret.id}</TableCell>
                <TableCell>{ret.reference_code}</TableCell>
                <TableCell>
                  {ret.sale?.reference_code ?? `#${ret.sale_id}`}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    {(ret.return_items ?? []).map((item) => {
                      const condition = CONDITION_LABELS[item.condition_after_inspection];
                      const ConditionIcon = CONDITION_ICONS[item.condition_after_inspection] ?? AlertTriangle;
                      return (
                        <div key={item.id} className="flex items-start gap-2 text-xs">
                          <Package className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-foreground">
                              {item.product?.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                الكمية: {item.quantity}
                              </span>
                              <span className="text-muted-foreground">·</span>
                              <span className="text-muted-foreground">
                                المبلغ: {Number(item.refund_amount).toLocaleString("ar-EG")} ج.م
                              </span>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-medium w-fit ${condition?.color ?? "bg-gray-50 text-gray-700 border-gray-200"}`}>
                              <ConditionIcon className="h-2.5 w-2.5" />
                              {condition?.label ?? item.condition_after_inspection}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TableCell>
                <TableCell>{ret.customer?.name ?? "—"}</TableCell>
                <TableCell>{ret.return_date}</TableCell>
                <TableCell className="font-semibold">
                  {Number(ret.refund_total).toLocaleString("ar-EG")} ج.م
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {REFUND_METHODS.find((m) => m.value === ret.refund_method)?.label ?? ret.refund_method}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/returns/${ret.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {returns.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            لا توجد مرتجعات تطابق البحث.
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

export default ReturnsPage;
