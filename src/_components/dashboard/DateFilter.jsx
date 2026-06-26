import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const periods = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
  { key: "custom", label: "Custom" },
];

export default function DateFilter({ period, onPeriodChange, customDate, onCustomDateChange }) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {periods.map((p) => (
        <Button
          key={p.key}
          variant={period === p.key ? "default" : "outline"}
          size="sm"
          onClick={() => onPeriodChange(p.key)}
        >
          {p.label}
        </Button>
      ))}
      {period === "custom" && (
        <div className="flex items-center gap-2 ml-2">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={customDate.from || ""}
              onChange={(e) => onCustomDateChange({ ...customDate, from: e.target.value })}
              className={cn(
                "border rounded-md px-2 py-1 text-sm",
                "bg-background text-foreground"
              )}
            />
          </div>
          <span className="text-sm text-muted-foreground">to</span>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={customDate.to || ""}
              onChange={(e) => onCustomDateChange({ ...customDate, to: e.target.value })}
              className={cn(
                "border rounded-md px-2 py-1 text-sm",
                "bg-background text-foreground"
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
