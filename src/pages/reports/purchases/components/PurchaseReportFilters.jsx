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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SearchableSelect = ({
  items,
  value,
  onSelect,
  placeholder,
  searchPlaceholder,
  emptyText,
  getLabel,
  getValue,
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!search) return items;
    return items.filter((item) =>
      getLabel(item).toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search, getLabel]);

  const selectedLabel = items.find(
    (item) => String(getValue(item)) === String(value),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {selectedLabel ? getLabel(selectedLabel) : placeholder}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {filtered.length === 0 && (
              <CommandEmpty>{emptyText}</CommandEmpty>
            )}
            <CommandGroup>
              {filtered.map((item) => (
                <CommandItem
                  key={getValue(item)}
                  value={String(getValue(item))}
                  onSelect={() => {
                    onSelect(
                      String(getValue(item)) === String(value) ? "" : String(getValue(item)),
                    );
                    setSearch("");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      String(getValue(item)) === String(value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <span className="flex-1">{getLabel(item)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const periodOptions = [
  { value: "today", label: "اليوم" },
  { value: "yesterday", label: "أمس" },
  { value: "this_week", label: "هذا الأسبوع" },
  { value: "last_week", label: "الأسبوع الماضي" },
  { value: "this_month", label: "هذا الشهر" },
  { value: "last_month", label: "الشهر الماضي" },
  { value: "this_year", label: "هذه السنة" },
  { value: "all_time", label: "كل الوقت" },
  { value: "custom", label: "مخصص" },
];

const PurchaseReportFilters = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
  suppliers,
  products,
  users,
  hasActiveFilters,
}) => {
  const isCustom = filters.period === "custom";

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            تصفية التقرير
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">الفترة</Label>
            <Select
              value={filters.period || "this_month"}
              onValueChange={(v) => onFilterChange("period", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الفترة" />
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
                <Label className="text-xs">من تاريخ</Label>
                <Input
                  type="date"
                  value={filters.date_from || ""}
                  onChange={(e) => onFilterChange("date_from", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">إلى تاريخ</Label>
                <Input
                  type="date"
                  value={filters.date_to || ""}
                  onChange={(e) => onFilterChange("date_to", e.target.value)}
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">المورد</Label>
            <SearchableSelect
              items={suppliers}
              value={filters.supplier_id}
              onSelect={(v) => onFilterChange("supplier_id", v)}
              placeholder="كل الموردين"
              searchPlaceholder="ابحث عن مورد..."
              emptyText="لا يوجد موردين"
              getLabel={(item) => item.name}
              getValue={(item) => item.id}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">المنتج</Label>
            <SearchableSelect
              items={products}
              value={filters.product_id}
              onSelect={(v) => onFilterChange("product_id", v)}
              placeholder="كل المنتجات"
              searchPlaceholder="ابحث عن منتج..."
              emptyText="لا يوجد منتجات"
              getLabel={(item) => item.name}
              getValue={(item) => item.id}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">المستخدم</Label>
            <SearchableSelect
              items={users}
              value={filters.created_by}
              onSelect={(v) => onFilterChange("created_by", v)}
              placeholder="كل المستخدمين"
              searchPlaceholder="ابحث عن مستخدم..."
              emptyText="لا يوجد مستخدمين"
              getLabel={(item) => item.name}
              getValue={(item) => item.id}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button onClick={onApply} size="sm">
            <Search className="h-4 w-4 ml-1" />
            تطبيق الفلترة
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onReset}>
              <X className="h-4 w-4 ml-1" />
              إعادة تعيين
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { SearchableSelect };
export default PurchaseReportFilters;
