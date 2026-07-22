import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Search, X } from "lucide-react";
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
  useGetAllMaintenanceTickets,
  useDeleteMaintenanceTickets,
} from "@/hooks/Actions/MaintenanceTickets/useCurdsMaintenanceTickets";
import { useGetAllCustomers } from "@/hooks/Actions/customers/useCurdsCustomers";
import useSearch from "@/hooks/useSearch/useSearch";
import { formatDateTime, formatCurrency } from "@/lib/utils";

const statusConfig = {
  pending: { label: "قيد الانتظار", className: "bg-yellow-100 text-yellow-800" },
  under_repair: { label: "قيد الإصلاح", className: "bg-blue-100 text-blue-800" },
  waiting_parts: { label: "بانتظار قطع الغيار", className: "bg-purple-100 text-purple-800" },
  repaired: { label: "تم الإصلاح", className: "bg-green-100 text-green-800" },
  delivered: { label: "تم التسليم", className: "bg-gray-100 text-gray-800" },
  cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
};

const statusOptions = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "under_repair", label: "قيد الإصلاح" },
  { value: "waiting_parts", label: "بانتظار قطع الغيار" },
  { value: "repaired", label: "تم الإصلاح" },
  { value: "delivered", label: "تم التسليم" },
  { value: "cancelled", label: "ملغي" },
];

const MaintenanceTicketsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const [filterStatus, setFilterStatus] = React.useState("");
  const [filterCustomer, setFilterCustomer] = React.useState("");
  const { debouncedSearch, search, handelSearch, setSearch } = useSearch("", 400);

  const filters = {
    search: debouncedSearch || undefined,
    status: filterStatus || undefined,
    customer_id: filterCustomer || undefined,
  };

  const { data, isPending, refetch } = useGetAllMaintenanceTickets(page, per_page, filters);
  const { data: customersData } = useGetAllCustomers(1, 100);
  const { mutate: deleteMutate } = useDeleteMaintenanceTickets();

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus, filterCustomer]);

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterCustomer("");
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || filterStatus || filterCustomer;

  const handleDelete = (id) => {
    toast("هل أنت متأكد من حذف تذكرة الصيانة؟", {
      action: {
        label: "نعم",
        onClick: () => deleteMutate({ id }, { onSuccess: () => refetch() }),
      },
      duration: Infinity,
    });
  };

  if (isPending) return <Loading />;

  const tickets = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const customers = customersData?.data?.data ?? [];

  return (
    <div>
      <CustomHeader
        title="تذاكر الصيانة"
        description="قائمة تذاكر صيانة الأجهزة"
        buttonText="تذكرة صيانة"
        onButtonClick={() => navigate("/maintenance-tickets/add")}
      />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="relative w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث برقم التذكرة أو العميل أو الرقم التسلسلي..."
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
              <TableHead className="text-right">رقم التذكرة</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">الجهاز</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">التكلفة</TableHead>
              <TableHead className="text-right">تاريخ الاستلام</TableHead>
              <TableHead className="text-right">أنشئ بواسطة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => {
              const status = statusConfig[ticket.status] || statusConfig.pending;
              return (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    {ticket.ticket_number}
                  </TableCell>
                  <TableCell>{ticket.customer?.name || "—"}</TableCell>
                  <TableCell>
                    {ticket.maintenance_device?.product?.name || "—"}
                    {ticket.maintenance_device?.serial_number ? ` (${ticket.maintenance_device.serial_number})` : ""}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(ticket.total_cost)}</TableCell>
                  <TableCell>{formatDateTime(ticket.received_date)}</TableCell>
                  <TableCell>{ticket.created_by?.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/maintenance-tickets/details/${ticket.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                        عرض
                      </Button>
                      {["pending", "under_repair", "waiting_parts"].includes(ticket.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/maintenance-tickets/update/${ticket.id}`)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                          تعديل
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {tickets.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  لا توجد تذاكر صيانة
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

export default MaintenanceTicketsPage;
