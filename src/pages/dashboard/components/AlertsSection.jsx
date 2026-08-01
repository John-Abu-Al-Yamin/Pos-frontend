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

const AlertItem = ({ config, alert }) => {
  const { icon: Icon, label } = config;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3 transition-all duration-200 hover:bg-accent hover:border-accent">
      <Icon className="h-5 w-5 shrink-0 text-foreground" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
        {alert.amount !== undefined && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatCurrency(alert.amount)}
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
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!alerts) return null;

  const activeAlerts = Object.entries(alertConfig)
    .map(([key, config]) => ({ config, alert: alerts[key] }))
    .filter(
      ({ alert }) =>
        alert &&
        (alert.count > 0 || (alert.amount !== undefined && alert.amount > 0))
    );

  if (activeAlerts.length === 0) return null;

  return (
    <Card className="mb-8 transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-foreground" />
          <CardTitle className="text-base">يتطلب انتباهك</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeAlerts.map(({ config, alert }) => (
            <AlertItem key={config.label} config={config} alert={alert} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsSection;
