import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Smartphone, Hash, Search, X } from "lucide-react";

import { useGetAllSales } from "@/hooks/Actions/sales/useCurdsSales";
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

const PAYMENT_METHODS = [
  { value: "cash", label: "نقدي" },
  { value: "card", label: "بطاقة" },
  { value: "transfer", label: "تحويل" },
  { value: "installment", label: "تقسيط" },
];

const FILTER_DEBOUNCE = 300;

const SalesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 10;
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), FILTER_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [search]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, paymentMethod]);

  const { data, isPending } = useGetAllSales({
    page,
    per_page,
    search: debouncedSearch || undefined,
    payment_method: paymentMethod || undefined,
  });

  const sales = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  const hasActiveFilters = debouncedSearch || paymentMethod;

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setPaymentMethod("");
    setPage(1);
  };

  if (isPending) return <Loading />;

  return (
    <div>
      <CustomHeader
        title="المبيعات"
        description="قائمة فواتير المبيعات"
        buttonText="بيع جديد"
        onButtonClick={() => navigate("/pos")}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            dir="rtl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بكود المرجع، العميل، المنتج، الرقم التسلسلي..."
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
          value={paymentMethod || undefined}
          onValueChange={(v) => setPaymentMethod(v ?? "")}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="الكل" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_METHODS.map((m) => (
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
              <TableHead className="text-right">المنتجات</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
              <TableHead className="text-right">طريقة الدفع</TableHead>
              <TableHead className="text-right">الأجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.id}</TableCell>
                <TableCell className="text-xs">{sale.reference_code}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {(sale.sale_items ?? []).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <Smartphone className="h-3 w-3 shrink-0 text-primary" />
                        <span className="font-medium">
                          {item.product?.name}
                        </span>
                        {item.stock_items?.map((si) => (
                          <span
                            key={si.id}
                            className="text-muted-foreground"
                            dir="ltr"
                          >
                            <Hash className="h-2.5 w-2.5 inline" />
                            {si.serial_number}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{sale.customer?.name ?? "—"}</TableCell>
                <TableCell className="text-xs">{sale.date}</TableCell>
                <TableCell className="font-semibold text-sm">
                  {Number(sale.total).toLocaleString("ar-EG")}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {PAYMENT_METHODS.find(
                      (m) => m.value === sale.payment_method,
                    )?.label ?? sale.payment_method}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/sales/${sale.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {sales.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            لا توجد مبيعات تطابق البحث.
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

export default SalesPage;
