import React from "react";
import { Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const periodOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This week" },
  { value: "last_week", label: "Last week" },
  { value: "this_month", label: "This month" },
  { value: "last_month", label: "Last month" },
  { value: "this_year", label: "This year" },
  { value: "all_time", label: "All time" },
  { value: "custom", label: "Custom" },
];

const ProfitLossFilters = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
  hasActiveFilters,
}) => {
  const isCustom = filters.period === "custom";

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Report filters
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Period</Label>
            <Select
              value={filters.period || "this_month"}
              onValueChange={(v) => onFilterChange("period", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isCustom && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Date from</Label>
                <Input
                  type="date"
                  value={filters.date_from || ""}
                  onChange={(e) => onFilterChange("date_from", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Date to</Label>
                <Input
                  type="date"
                  value={filters.date_to || ""}
                  onChange={(e) => onFilterChange("date_to", e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button onClick={onApply} size="sm">
            <Search className="h-4 w-4 ml-1" />
            Apply filters
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onReset}>
              <X className="h-4 w-4 ml-1" />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitLossFilters;
