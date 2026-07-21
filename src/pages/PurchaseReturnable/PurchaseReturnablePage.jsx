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
import { useGetAllReturnablePurchases } from "@/hooks/Actions/PurchaseReturnable/useCurdsPurchaseReturnable";
import { useGetAllSuppliers } from "@/hooks/Actions/suppliers/useCurdsSuppliers";
import { formatDateTime, formatCurrency } from "@/lib/utils";

const PurchaseReturnablePage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const [searchInput, setSearchInput] = React.useState("");
  const [activeSearch, setActiveSearch] = React.useState("");
  const [filterSupplier, setFilterSupplier] = React.useState("");
  const [filterDateFrom, setFilterDateFrom] = React.useState("");
  const [filterDateTo, setFilterDateTo] = React.useState("");

  const filters = {
    search: activeSearch || undefined,
    supplier_id: filterSupplier || undefined,
    from_date: filterDateFrom || undefined,
    to_date: filterDateTo || undefined,
  };

  const { data, isPending } = useGetAllReturnablePurchases(page, per_page, filters);

  const { data: suppliersData } = useGetAllSuppliers(1, 1000);
  const suppliers = suppliersData?.data?.data ?? [];

  React.useEffect(() => {
    setPage(1);
  }, [activeSearch, filterSupplier, filterDateFrom, filterDateTo]);

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
    setFilterSupplier("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setPage(1);
  };

  const hasActiveFilters =
    activeSearch || filterSupplier || filterDateFrom || filterDateTo;

  if (isPending) return <Loading />;

  const returnablePurchases = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  return (
    <div>
      <CustomHeader title="إنشاء مرتجع شراء" description="اختر فاتورة شراء لإرجاع أصناف منها" />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex items-end gap-2">
          <div className="relative w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث برقم الفاتورة أو اسم المورد..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pr-9"
            />
          </div>
        </div>

        <div className="w-44">
          <Select value={filterSupplier} onValueChange={setFilterSupplier}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="المورد" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={String(supplier.id)}>
                  {supplier.name}
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
              <TableHead className="text-right">المورد</TableHead>
              <TableHead className="text-right">عدد الأصناف</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
              <TableHead className="text-right">تاريخ الفاتورة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returnablePurchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell className="font-medium">
                  {purchase.purchaseHeader_number}
                </TableCell>
                <TableCell>{purchase.supplier?.name || "—"}</TableCell>
                <TableCell>{purchase.items_count || 0}</TableCell>
                <TableCell>{formatCurrency(purchase.total_amount)}</TableCell>
                <TableCell>{formatDateTime(purchase.created_at)}</TableCell>
                <TableCell>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      navigate(`/purchase-returnable/${purchase.id}`)
                    }
                  >
                    <ArrowLeftFromLine className="h-4 w-4" />
                    اختيار
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {returnablePurchases.length === 0 && (
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

export default PurchaseReturnablePage;
