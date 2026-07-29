import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Wrench, ShoppingCart, DollarSign, Wallet } from "lucide-react";

const statusLabels = {
  pending: "قيد الانتظار",
  under_repair: "قيد الإصلاح",
  waiting_parts: "بانتظار القطع",
  delivered: "تم التسليم",
  repaired: "تم الإصلاح",
  cancelled: "ملغي",
};

const statusVariants = {
  pending: "secondary",
  under_repair: "default",
  waiting_parts: "outline",
  delivered: "secondary",
  repaired: "default",
  cancelled: "destructive",
};

const SectionSkeleton = () => (
  <Card>
    <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    </CardContent>
  </Card>
);

const StatBox = ({ label, value }) => (
  <div className="rounded-lg bg-muted p-3 border border-border text-center transition-all duration-200 hover:bg-accent hover:border-accent">
    <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
    <p className="text-lg font-bold text-foreground">{value ?? "—"}</p>
  </div>
);

const MaintenanceStatus = ({ maintenance }) => {
  if (!maintenance) return null;
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">حالة الصيانة</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(maintenance.status_counts || {}).map(([status, count]) => (
            <Badge key={status} variant={statusVariants[status] || "outline"}>
              {statusLabels[status] || status}: {count}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatBox label="قيد الانتظار" value={maintenance.pending ?? 0} />
          <StatBox label="قيد الإصلاح" value={maintenance.under_repair ?? 0} />
          <StatBox label="بانتظار القطع" value={maintenance.waiting_parts ?? 0} />
          <StatBox label="تم الإصلاح" value={maintenance.repaired_not_delivered ?? 0} />
          <StatBox label="مستلمة في الفترة" value={maintenance.received_in_period ?? 0} />
          <StatBox label="مسلمة في الفترة" value={maintenance.delivered_in_period ?? 0} />
        </div>
      </CardContent>
    </Card>
  );
};

const PurchaseStatus = ({ purchases }) => {
  if (!purchases) return null;
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">حالة المشتريات</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <StatBox label="مسودة" value={purchases.draft_count ?? 0} />
          <StatBox label="مكتملة في الفترة" value={purchases.completed_in_period ?? 0} />
        </div>
      </CardContent>
    </Card>
  );
};

const PendingExpenses = ({ expenses }) => {
  if (!expenses) return null;
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">المصروفات المعلقة</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <StatBox label="معلقة" value={expenses.pending_count ?? 0} />
          {expenses.pending_amount !== undefined && (
            <StatBox label="القيمة المعلقة" value={formatCurrency(expenses.pending_amount ?? 0)} />
          )}
          <StatBox label="مدفوعة في الفترة" value={expenses.paid_in_period ?? 0} />
        </div>
      </CardContent>
    </Card>
  );
};

const SalaryStatus = ({ salaries }) => {
  if (!salaries) return null;
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">حالة الرواتب</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <StatBox label="مسودة" value={salaries.draft_count ?? 0} />
      </CardContent>
    </Card>
  );
};

const OperationsSection = ({ operations, isPending }) => {
  if (isPending) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    );
  }

  if (!operations) return null;

  const sections = [
    <MaintenanceStatus key="maintenance" maintenance={operations.maintenance} />,
    <PurchaseStatus key="purchases" purchases={operations.purchases} />,
    <PendingExpenses key="expenses" expenses={operations.expenses} />,
    operations.salaries && <SalaryStatus key="salaries" salaries={operations.salaries} />,
  ].filter(Boolean);

  if (sections.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {sections}
    </div>
  );
};

export default OperationsSection;
