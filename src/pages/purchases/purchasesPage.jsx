import CustomHeader from "@/customs/CustomHeader";
import Loading from "@/customs/Loading";
import CustomPagination from "@/customs/CustomPagination";
import { useGetAllPurchaseHeaders } from "@/hooks/Actions/PurchaseHeaders/useCurdsPurchaseHeaders";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { MoreHorizontal, Pencil, Ban, Eye, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TYPES = [
  { value: "purchase", label: "مشتريات" },
  { value: "opening_stock", label: "بضاعة بالمحل" },
];

const FILTER_DEBOUNCE = 300;

const purchasesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 10;
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [type, setType] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), FILTER_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [search]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, type]);

  const { data: purchaseHeaders, isPending } = useGetAllPurchaseHeaders({
    page,
    per_page,
    search: debouncedSearch || undefined,
    type: type || undefined,
  });

  const purchaseHeadersData = purchaseHeaders?.data?.data ?? [];
  const pagination = purchaseHeaders?.data?.pagination;

  const hasActiveFilters = debouncedSearch || type;

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setType("");
    setPage(1);
  };

  if (isPending) {
    return <Loading />;
  }

  return (
    <div>
      <CustomHeader
        title="الفوتير"
        description="قائمة الفوتير"
        buttonText=" فاتورة"
        onButtonClick={() => navigate("/purchases/add")}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            dir="rtl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بكود المرجع، المورد..."
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
          value={type || undefined}
          onValueChange={(v) => setType(v ?? "")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="النوع" />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
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
              <TableHead className="text-right">id</TableHead>
              <TableHead className="text-right">اسم المورد</TableHead>
              <TableHead className="text-right">رقم الهاتف</TableHead>
              <TableHead className="text-right">وصف الفاتورة</TableHead>
              <TableHead className="text-right">كود المرجع</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">المجموع</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">تاريخ الإنشاء</TableHead>
              <TableHead className="text-right">الأجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseHeadersData?.map((header) => (
              <TableRow key={header.id}>
                <TableCell>{header.id}</TableCell>
                <TableCell>{header.supplier?.name}</TableCell>
                <TableCell>{header.supplier?.phone}</TableCell>
                <TableCell>{header.reference}</TableCell>
                <TableCell>{header.reference_code}</TableCell>
                <TableCell>{header.date}</TableCell>
                <TableCell>{header.total}</TableCell>
                <TableCell>
                  <Badge
                    variant={header.type === "purchase" ? "default" : "outline"}
                    className={
                      header.type === "purchase"
                        ? "bg-amber-50 text-black border-amber-100 hover:bg-amber-100 "
                        : "bg-primary/5 text-primary border-primary/20 hover:bg-primary/15   "
                    }
                  >
                    {header.type === "purchase"
                      ? "مشتريات"
                      : header.type === "opening_stock"
                        ? "بضاعة بالمحل"
                        : header.type}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(header.created_at)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => navigate(`/purchases/${header.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        عرض التفاصيل واضافه والمشتريات
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate(`/purchases/edit/${header.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Ban className="h-4 w-4" />
                        ايقاف الفاتورة
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {purchaseHeadersData.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            لا توجد فواتير تطابق البحث.
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

export default purchasesPage;
