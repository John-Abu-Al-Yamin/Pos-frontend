import CustomHeader from "@/customs/CustomHeader";
import Loading from "@/customs/Loading";
import CustomPagination from "@/customs/CustomPagination";
import { useGetAllStock } from "@/hooks/Actions/stock/useCurdsStock";
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
import {
  MoreHorizontal,
  Pencil,
  Ban,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const conditionBadge = (condition) => {
  const styles = {
    excellent: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    good: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    fair: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    poor: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  };
  const labels = {
    excellent: "ممتاز",
    good: "جيد",
    fair: "متوسط",
    poor: "سيء",
  };
  return (
    <Badge variant="outline" className={styles[condition] || styles.fair}>
      {labels[condition] || condition}
    </Badge>
  );
};

const statusBadge = (status) => {
  const styles = {
    available: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    sold: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
    damaged: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    returned: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  };
  const labels = {
    available: "متوفر",
    sold: "تم البيع",
    damaged: "تالف",
    returned: "مرتجع",
  };
  return (
    <Badge variant="outline" className={styles[status] || styles.available}>
      {labels[status] || status}
    </Badge>
  );
};

const StockPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 20;

  const { data: stockData, isPending } = useGetAllStock(page, per_page);
  const stockItems = stockData?.data?.data ?? [];
  const pagination = stockData?.data?.pagination;

  if (isPending) {
    return <Loading />;
  }

  return (
    <div>
      <CustomHeader
        title="المخزون"
        description="قائمة عناصر المخزون"
        // buttonText="مخزون"
        // onButtonClick={() => navigate("/stock/add")}
      />

      <div className="rounded-md border bg-white shadow-sm mt-4 " dir="rtl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">المنتج</TableHead>
              <TableHead className="text-right">الرقم التسلسلي</TableHead>
              <TableHead className="text-right">سعر التكلفة</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الوضع</TableHead>
              <TableHead className="text-right">تاريخ الإنشاء</TableHead>
          
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockItems?.map((item) => (
  <TableRow
                key={item.id}
                onClick={() => navigate(`/stock/${item.id}`)}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >                <TableCell>{item.id}</TableCell>
                <TableCell>{item.product?.name}</TableCell>
                <TableCell dir="ltr" className="text-right">{item.serial_number}</TableCell>
                <TableCell>{item.cost_price}</TableCell>
                <TableCell>{conditionBadge(item.condition)}</TableCell>
                <TableCell>{statusBadge(item.status)}</TableCell>
                <TableCell>{formatDate(item.created_at)}</TableCell>
               
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

export default StockPage;
