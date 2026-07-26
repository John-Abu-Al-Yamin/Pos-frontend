import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Undo2 } from "lucide-react";

const SalesReturnsSummary = ({ data, isPending }) => {
  if (isPending) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Undo2 className="h-4 w-4 text-red-500" />
          <CardTitle className="text-base">ملخص المرتجعات</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-red-50 p-4 border border-red-100">
            <p className="text-xs font-medium text-red-600 mb-1">إجمالي الكمية المرتجعة</p>
            <p className="text-xl font-bold text-red-700">
              {data.total_returned_quantity ?? 0}
            </p>
          </div>
          <div className="rounded-lg bg-orange-50 p-4 border border-orange-100">
            <p className="text-xs font-medium text-orange-600 mb-1">إجمالي المبالغ المستردة</p>
            <p className="text-xl font-bold text-orange-700">
              {formatCurrency(data.total_refund || 0)}
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4 border border-amber-100">
            <p className="text-xs font-medium text-amber-600 mb-1">عدد معاملات الإرجاع</p>
            <p className="text-xl font-bold text-amber-700">
              {data.return_transaction_count ?? 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesReturnsSummary;
