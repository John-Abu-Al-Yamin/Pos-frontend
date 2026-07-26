import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Plus, Minus, Equal, DollarSign } from "lucide-react";

const FormulaRow = ({ icon: Icon, label, value, accent }) => {
  const accentColors = {
    green: "text-green-600 bg-green-50 border-green-100",
    red: "text-red-600 bg-red-50 border-red-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    default: "text-foreground bg-muted/30 border-border",
  };

  const accentClass = accentColors[accent] || accentColors.default;

  return (
    <div className={`flex items-center justify-between rounded-lg border px-4 py-2.5 ${accentClass}`}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
};

const ProfitFormulaSection = ({ profitFormula, netProfit, isPending }) => {
  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profitFormula) return null;

  const rows = [
    {
      icon: DollarSign,
      label: "إيرادات المبيعات",
      value: formatCurrency(profitFormula.sales_revenue || 0),
      accent: "green",
    },
    {
      icon: Minus,
      label: "تكلفة البضاعة المباعة",
      value: formatCurrency(profitFormula.minus_cogs || 0),
      accent: "red",
    },
    {
      icon: Minus,
      label: "المصروفات",
      value: formatCurrency(profitFormula.minus_expenses || 0),
      accent: "red",
    },
    {
      icon: Minus,
      label: "الرواتب",
      value: formatCurrency(profitFormula.minus_salaries || 0),
      accent: "red",
    },
    {
      icon: Plus,
      label: "ربح الصيانة",
      value: formatCurrency(profitFormula.plus_maintenance_profit || 0),
      accent: "blue",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">معادلة حساب صافي الربح</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rows.map((row, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <div className="flex justify-center">
                  {row.icon === Plus ? (
                    <Plus className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
              <FormulaRow {...row} />
            </React.Fragment>
          ))}
          <div className="flex justify-center py-1">
            <Equal className="h-5 w-5 text-foreground" />
          </div>
          <div className="flex items-center justify-between rounded-lg border-2 border-primary/30 bg-primary/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">صافي الربح</span>
            </div>
            <span className="text-lg font-extrabold tabular-nums text-primary">
              {formatCurrency(netProfit ?? 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitFormulaSection;
