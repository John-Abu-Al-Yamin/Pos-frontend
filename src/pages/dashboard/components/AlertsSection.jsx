import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, XCircle, Wrench, DollarSign, FileText } from "lucide-react";

const alertConfig = {
  low_stock: { icon: AlertTriangle, label: "مخزون منخفض" },
  out_of_stock: { icon: XCircle, label: "نفذ من المخزون" },
  maintenance_waiting_parts: { icon: Wrench, label: "صيانة بانتظار قطع" },
  pending_expenses: { icon: DollarSign, label: "مصروفات معلقة" },
  draft_purchases: { icon: FileText, label: "مشتريات مسودة" },
};

const AlertItem = ({ alertKey, alert }) => {
  const config = alertConfig[alertKey];
  if (!config || !alert) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3 transition-all duration-200 hover:bg-accent hover:border-accent">
      <config.icon className="h-5 w-5 text-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{config.label}</p>
        {alert.amount !== undefined ? (
          <p className="text-xs text-muted-foreground mt-0.5">
            {alert.count ?? 0} تنبيه - {formatCurrency(alert.amount)}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-0.5">
            {alert.count ?? 0} تنبيه
          </p>
        )}
      </div>
      <span className="text-lg font-bold text-foreground">
        {alert.count ?? 0}
      </span>
    </div>
  );
};

const AlertsSection = ({ alerts, isPending }) => {
  if (isPending) {
    return (
      <Card className="mb-6">
        <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!alerts) return null;

  const alertKeys = Object.keys(alertConfig);
  const hasAlerts = alertKeys.some((key) => alerts[key]);

  if (!hasAlerts) return null;

  return (
    <Card className="mb-6 transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-foreground" />
          <CardTitle className="text-base">التنبيهات</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alertKeys.map((key) => (
            <AlertItem key={key} alertKey={key} alert={alerts[key]} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsSection;
