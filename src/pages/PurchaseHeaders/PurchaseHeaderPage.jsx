import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, CheckCheck, XCircle, Plus, Printer, Search, X } from "lucide-react";
import { toast } from "sonner";
import PrintInvoiceButton from "@/components/invoice/PrintInvoiceButton";

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
  useGetAllPurchaseHeaders,
  useCompletePurchaseHeaders,
  useCancelPurchaseHeaders,
} from "@/hooks/Actions/PurchaseHeader/useCurdsPurchaseHeader";
import { useGetAllSuppliers } from "@/hooks/Actions/suppliers/useCurdsSuppliers";
import useSearch from "@/hooks/useSearch/useSearch";
import endPoints from "@/hooks/EndPoints/endPoints";
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

const PurchaseHeaderPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 12;
  const [filterStatus, setFilterStatus] = React.useState("");
  const [filterSupplier, setFilterSupplier] = React.useState("");
  const { debouncedSearch, search, handelSearch, setSearch } = useSearch("", 400);

  const filters = {
    search: debouncedSearch || undefined,
    status: filterStatus || undefined,
    supplier_id: filterSupplier || undefined,
  };

  const { data, isPending } = useGetAllPurchaseHeaders(page, per_page, filters);
  const { data: suppliersData } = useGetAllSuppliers(1, 100);
  const { mutate: completeMutate } = useCompletePurchaseHeaders();
  const { mutate: cancelMutate } = useCancelPurchaseHeaders();

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus, filterSupplier]);

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterSupplier("");
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || filterStatus || filterSupplier;

  if (isPending) return <Loading />;

  const purchaseHeaders = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const suppliers = suppliersData?.data?.data ?? [];

  const handleComplete = (id) => {
    toast("هل أنت متأكد من إتمام الفاتورة؟", {
      action: { label: "نعم", onClick: () => completeMutate(id) },
      duration: Infinity,
    });
  };

  const handleCancel = (id) => {
    toast("هل أنت متأكد من إلغاء الفاتورة؟", {
      action: {
        label: "نعم",
        onClick: () => cancelMutate(id),
      },
      duration: Infinity,
    });
  };

  return (
    <div>
      <CustomHeader
        title="الفواتير"
        description="قائمة الفواتير الشرائية"
        buttonText="فاتوره شراء"
        onButtonClick={() => navigate("/purchase-headers/add")}
      />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="relative w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث برقم الفاتورة أو رقم فاتورة المورد..."
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
              <TableHead className="text-right">رقم فاتورة المورد</TableHead>
              <TableHead className="text-right">المورد</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">المبلغ الإجمالي</TableHead>
              <TableHead className="text-right">تاريخ الإنشاء</TableHead>
              <TableHead className="text-right">أنشئ بواسطة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseHeaders.map((header) => {
              const status = statusConfig[header.status] || statusConfig.draft;
              return (
                <TableRow key={header.id}>
                  <TableCell className="font-medium">
                    {header.purchaseHeader_number}
                  </TableCell>
                  <TableCell>{header.supplier_invoice_number || "—"}</TableCell>
                  <TableCell>{header.supplier?.name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(header.total_amount)}</TableCell>
                  <TableCell>{formatDateTime(header.created_at)}</TableCell>
                  <TableCell>{header.created_by?.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/purchase-headers/details/${header.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                        عرض
                      </Button>
                      {header.status === "completed" && (
                        <PrintInvoiceButton type="purchase" id={header.id} />
                      )}
                      {header.status === "draft" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/purchase-headers/update/${header.id}`)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                            تعديل
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            disabled={header.items_count <= 0}
                            title={header.items_count <= 0 ? "يجب إضافة أصناف للفاتورة أولاً" : ""}
                            onClick={() => handleComplete(header.id)}
                          >
                            <CheckCheck className="h-4 w-4" />
                            إتمام
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancel(header.id)}
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
            {purchaseHeaders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  لا توجد فواتير
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

export default PurchaseHeaderPage;
