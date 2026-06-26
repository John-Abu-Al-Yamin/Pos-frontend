import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Undo2 } from "lucide-react";

import { useGetAllReturns } from "@/hooks/Actions/returns/useCurdsReturns";
import CustomHeader from "@/customs/CustomHeader";
import Loading from "@/customs/Loading";
import CustomPagination from "@/customs/CustomPagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const refundMethodLabels = {
  cash: "نقدي",
  card: "بطاقة",
  bank_transfer: "تحويل بنكي",
};

const ReturnsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const per_page = 10;

  const { data, isPending } = useGetAllReturns(page, per_page);
  const returns = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  if (isPending) return <Loading />;

  return (
    <div>
      <CustomHeader
        title="المرتجعات"
        description="قائمة عمليات الإرجاع والاسترداد"
        buttonText="عودة للمبيعات"
        onButtonClick={() => navigate("/sales")}
      />

      <div className="rounded-md border bg-white shadow-sm mt-4" dir="rtl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">كود المرجع</TableHead>
              <TableHead className="text-right">فاتورة البيع</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">المبلغ المسترد</TableHead>
              <TableHead className="text-right">طريقة الاسترداد</TableHead>
              <TableHead className="text-right">الأجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returns.map((ret) => (
              <TableRow key={ret.id}>
                <TableCell className="font-medium">{ret.id}</TableCell>
                <TableCell>{ret.reference_code}</TableCell>
                <TableCell>
                  {ret.sale?.reference_code ?? `#${ret.sale_id}`}
                </TableCell>
                <TableCell>{ret.customer?.name ?? "—"}</TableCell>
                <TableCell>{ret.return_date}</TableCell>
                <TableCell className="font-semibold">
                  {Number(ret.refund_total).toLocaleString("ar-EG")} ج.م
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {refundMethodLabels[ret.refund_method] ?? ret.refund_method}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/returns/${ret.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
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

export default ReturnsPage;
