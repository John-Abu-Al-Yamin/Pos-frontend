import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const typeLabels = {
  mobile: "موبايل",
  accessory: "إكسسوار",
  spare_part: "قطعة غيار",
};

const ProductFilterBar = ({
  search,
  handelSearch,
  filterCategory,
  setFilterCategory,
  filterBrand,
  setFilterBrand,
  filterType,
  setFilterType,
  categories,
  brands,
  hasActiveFilters,
  clearFilters,
}) => (
  <div className="mb-6 flex flex-wrap items-end gap-3">
    <div className="relative w-72">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="بحث عن منتج..."
        value={search}
        onChange={handelSearch}
        className="pr-9"
      />
    </div>

    <div className="w-48">
      <Select value={filterCategory} onValueChange={setFilterCategory}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="التصنيف" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="w-48">
      <Select value={filterBrand} onValueChange={setFilterBrand}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="العلامة التجارية" />
        </SelectTrigger>
        <SelectContent>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={String(brand.id)}>{brand.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="w-48">
      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="النوع" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(typeLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {hasActiveFilters && (
      <Button variant="outline" size="icon" onClick={clearFilters} title="مسح الفلترة">
        <X className="h-4 w-4" />
      </Button>
    )}
  </div>
);

export default ProductFilterBar;
