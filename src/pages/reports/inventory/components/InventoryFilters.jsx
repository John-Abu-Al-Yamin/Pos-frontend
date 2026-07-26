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
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

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

const movementTypeOptions = [
  { value: "purchase", label: "Purchase" },
  { value: "sale", label: "Sale" },
  { value: "sale_return", label: "Sale return" },
  { value: "purchase_return", label: "Purchase return" },
  { value: "adjustment", label: "Adjustment" },
  { value: "maintenance_usage", label: "Maintenance usage" },
];

const InventoryFilters = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
  hasActiveFilters,
}) => {
  const isCustom = filters.period === "custom";

  const { data: categoriesData } = useGetData({
    url: endPoints.categories,
    params: { per_page: 1000 },
    queryKeys: [queryKeys.categories],
  });

  const { data: brandsData } = useGetData({
    url: endPoints.brands,
    params: { per_page: 1000 },
    queryKeys: [queryKeys.brands],
  });

  const categories = categoriesData?.data?.data ?? [];
  const brands = brandsData?.data?.data ?? [];

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

          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <Select
              value={filters.category_id || ""}
              onValueChange={(v) => onFilterChange("category_id", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Brand</Label>
            <Select
              value={filters.brand_id || ""}
              onValueChange={(v) => onFilterChange("brand_id", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All brands" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={String(brand.id)}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Movement type</Label>
            <Select
              value={filters.movement_type || ""}
              onValueChange={(v) => onFilterChange("movement_type", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All movements" />
              </SelectTrigger>
              <SelectContent>
                {movementTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Movement date from</Label>
            <Input
              type="date"
              value={filters.movement_date_from || ""}
              onChange={(e) => onFilterChange("movement_date_from", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Movement date to</Label>
            <Input
              type="date"
              value={filters.movement_date_to || ""}
              onChange={(e) => onFilterChange("movement_date_to", e.target.value)}
            />
          </div>
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

export default InventoryFilters;
