import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftFromLine, Search, X } from "lucide-react";

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
import { useGetAllReturnableSales } from "@/hooks/Actions/SalesReturnable/useCurdsSalesReturnable";
import { useGetAllCustomers } from "@/hooks/Actions/customers/useCurdsCustomers";
import { formatDateTime, formatCurrency } from "@/lib/utils";

const SalesReturnablePage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const [searchInput, setSearchInput] = React.useState("");
  const [activeSearch, setActiveSearch] = React.useState("");
  const [filterCustomer, setFilterCustomer] = React.useState("");
  const [filterDateFrom, setFilterDateFrom] = React.useState("");
  const [filterDateTo, setFilterDateTo] = React.useState("");

  const filters = {
    search: activeSearch || undefined,
    customer_id: filterCustomer || undefined,
    from_date: filterDateFrom || undefined,
    to_date: filterDateTo || undefined,
  };

  const { data, isPending } = useGetAllReturnableSales(page, per_page, filters);

  const { data: customersData } = useGetAllCustomers(1, 1000);
  const customers = customersData?.data?.data ?? [];

  React.useEffect(() => {
    setPage(1);
  }, [activeSearch, filterCustomer, filterDateFrom, filterDateTo]);

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
    setFilterCustomer("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setPage(1);
  };

  const hasActiveFilters =
    activeSearch || filterCustomer || filterDateFrom || filterDateTo;

  if (isPending) return <Loading />;

  const returnableSales = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div>
      <CustomHeader title="إنشاء مرتجع بيع" description="اختر فاتورة بيع لإرجاع أصناف منها" />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex items-end gap-2">
          <div className="relative w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث برقم الفاتورة أو اسم العميل..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pr-9"
            />
          </div>
        </div>

        <div className="w-44">
          <Select value={filterCustomer} onValueChange={setFilterCustomer}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="العميل" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={String(customer.id)}>
                  {customer.name}
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
              <TableHead className="text-right">رقم الفاتورة</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">عدد الأصناف</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
              <TableHead className="text-right">تاريخ الفاتورة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returnableSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">
                  {sale.invoice_number}
                </TableCell>
                <TableCell>{sale.customer?.name || "—"}</TableCell>
                <TableCell>{sale.items_count || 0}</TableCell>
                <TableCell>{formatCurrency(sale.total_amount)}</TableCell>
                <TableCell>{formatDateTime(sale.created_at)}</TableCell>
                <TableCell>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      navigate(`/sales-returnable/${sale.id}`)
                    }
                  >
                    <ArrowLeftFromLine className="h-4 w-4" />
                    اختيار
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {returnableSales.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  لا توجد فواتير قابلة للإرجاع
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

export default SalesReturnablePage;
