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
import { MoreHorizontal, Pencil, Ban, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const purchasesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 10;

  const { data: purchaseHeaders, isPending } = useGetAllPurchaseHeaders(
    page,
    per_page,
  );
  const purchaseHeadersData = purchaseHeaders?.data?.data ?? [];
  const pagination = purchaseHeaders?.data?.pagination;

  console.log(purchaseHeadersData, pagination);

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

        <CustomPagination
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default purchasesPage;
