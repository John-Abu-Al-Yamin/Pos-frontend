import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Search, X } from "lucide-react";

import CustomHeader from "@/customs/CustomHeader";
import CustomPagination from "@/customs/CustomPagination";
import Loading from "@/customs/Loading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useGetAllSalesHeaders } from "@/hooks/Actions/SalesHeaders/useCurdsSalesHeaders";
import useSearch from "@/hooks/useSearch/useSearch";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

const SalesHeaderPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const { debouncedSearch, search, handelSearch, setSearch } = useSearch("", 400);
  const [filterDateFrom, setFilterDateFrom] = React.useState("");
  const [filterDateTo, setFilterDateTo] = React.useState("");
  const [filterCreatedBy, setFilterCreatedBy] = React.useState("");

  const filters = {
    search: debouncedSearch || undefined,
    from_date: filterDateFrom || undefined,
    to_date: filterDateTo || undefined,
    created_by: filterCreatedBy || undefined,
  };

  const { data, isPending } = useGetAllSalesHeaders(page, per_page, filters);

  const { data: usersData } = useGetData({
    url: endPoints.users,
    params: {},
    queryKeys: [queryKeys.users],
  });

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterDateFrom, filterDateTo, filterCreatedBy]);

  const clearFilters = () => {
    setSearch("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterCreatedBy("");
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || filterDateFrom || filterDateTo || filterCreatedBy;

  if (isPending) return <Loading />;

  const salesHeaders = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const users = usersData?.data?.data ?? [];

  return (
    <div>
      <CustomHeader
        title="فواتير البيع"
        description="قائمة فواتير البيع"
      />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="relative w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث برقم الفاتورة أو اسم العميل..."
            value={search}
            onChange={handelSearch}
            className="pr-9"
          />
        </div>

        <div className="w-44">
          <Select value={filterCreatedBy} onValueChange={setFilterCreatedBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="أنشئ بواسطة" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={String(user.id)}>
                  {user.name}
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
              <TableHead className="text-right">رقم الفاتورة</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">المجموع الفرعي</TableHead>
              <TableHead className="text-right">قيمة الخصم</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
              <TableHead className="text-right">أنشئ بواسطة</TableHead>
              <TableHead className="text-right">تاريخ الإنشاء</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesHeaders.map((header) => (
              <TableRow key={header.id}>
                <TableCell className="font-medium">
                  {header.invoice_number}
                </TableCell>
                <TableCell>{header.customer?.name || "—"}</TableCell>
                <TableCell>{formatCurrency(header.subtotal)}</TableCell>
                <TableCell>{formatCurrency(header.discount_amount)}</TableCell>
                <TableCell>{formatCurrency(header.total_amount)}</TableCell>
                <TableCell>{header.created_by?.name || "—"}</TableCell>
                <TableCell>{formatDateTime(header.created_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/sales-headers/details/${header.id}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                      عرض
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {salesHeaders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  لا توجد فواتير بيع
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

export default SalesHeaderPage;
