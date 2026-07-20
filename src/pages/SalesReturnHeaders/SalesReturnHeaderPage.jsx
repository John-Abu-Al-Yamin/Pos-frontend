import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Search, X } from "lucide-react";

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
import { useGetAllSalesReturnHeaders } from "@/hooks/Actions/SalesReturnHeader/useCurdsSalesReturnHeaders";
import { formatDateTime, formatCurrency } from "@/lib/utils";

const statusConfig = {
  draft: { label: "مسودة", className: "bg-yellow-100 text-yellow-800" },
  completed: { label: "مكتملة", className: "bg-green-100 text-green-800" },
  cancelled: { label: "ملغية", className: "bg-red-100 text-red-800" },
};

const statusOptions = [
  { value: "draft", label: "مسودة" },
  { value: "completed", label: "مكتملة" },
  { value: "cancelled", label: "ملغية" },
];

const SalesReturnHeaderPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const [searchInput, setSearchInput] = React.useState("");
  const [activeSearch, setActiveSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [filterDateFrom, setFilterDateFrom] = React.useState("");
  const [filterDateTo, setFilterDateTo] = React.useState("");

  const filters = {
    search: activeSearch || undefined,
    status: filterStatus || undefined,
    from_date: filterDateFrom || undefined,
    to_date: filterDateTo || undefined,
  };

  const { data, isPending } = useGetAllSalesReturnHeaders(page, per_page, filters);

  React.useEffect(() => {
    setPage(1);
  }, [activeSearch, filterStatus, filterDateFrom, filterDateTo]);

  const handleSearchSubmit = () => {
    setActiveSearch(searchInput);
    setPage(1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setActiveSearch("");
    setFilterStatus("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setPage(1);
  };

  const hasActiveFilters =
    activeSearch || filterStatus || filterDateFrom || filterDateTo;

  if (isPending) return <Loading />;

  const salesReturns = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div>
      <CustomHeader title="مرتجعات البيع" description="قائمة مرتجعات البيع" />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex items-end gap-2">
          <div className="relative w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث برقم المرتجع أو رقم الفاتورة أو العميل..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pr-9"
            />
          </div>
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

        <div className="w-44">
          <Input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            placeholder="من تاريخ"
          />
        </div>

        <div className="w-44">
          <Input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            placeholder="إلى تاريخ"
          />
        </div>

        <Button onClick={handleSearchSubmit}>
          <Search className="h-4 w-4 ml-1" />
          بحث
        </Button>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={clearFilters}
            title="مسح الفلترة"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم المرتجع</TableHead>
              <TableHead className="text-right">فاتورة البيع</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">المبلغ المسترد</TableHead>
              <TableHead className="text-right">أنشئ بواسطة</TableHead>
              <TableHead className="text-right">تاريخ الإرجاع</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesReturns.map((header) => {
              const status = statusConfig[header.status] || statusConfig.draft;
              return (
                <TableRow key={header.id}>
                  <TableCell className="font-medium">
                    {header.return_number}
                  </TableCell>
                  <TableCell>
                    {header.sales_header?.invoice_number || header.salesHeader?.invoice_number || "—"}
                  </TableCell>
                  <TableCell>{header.customer?.name || "—"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(header.total_refund_amount)}</TableCell>
                  <TableCell>{header.user?.name || "—"}</TableCell>
                  <TableCell>{header.return_date ? formatDateTime(header.return_date) : "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/sales-returns/details/${header.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                        عرض
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {salesReturns.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  لا توجد مرتجعات بيع
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CustomPagination
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default SalesReturnHeaderPage;
