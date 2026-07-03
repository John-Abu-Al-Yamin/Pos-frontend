import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

const typeLabels = {
  mobile: "موبايل",
  accessory: "إكسسوار",
  spare_part: "قطعة غيار",
};

const ProductFormFields = ({ formInstance, categories, brands, prefix = "" }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor={`${prefix}name`}>اسم المنتج</Label>
      <Input id={`${prefix}name`} {...formInstance.register("name")} />
      {formInstance.formState.errors.name && (
        <p className="text-sm text-destructive">{formInstance.formState.errors.name.message}</p>
      )}
    </div>

    <div className="space-y-2">
      <Label htmlFor={`${prefix}category_id`}>التصنيف</Label>
      <Controller
        name="category_id"
        control={formInstance.control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر التصنيف" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {formInstance.formState.errors.category_id && (
        <p className="text-sm text-destructive">{formInstance.formState.errors.category_id.message}</p>
      )}
    </div>

    <div className="space-y-2">
      <Label htmlFor={`${prefix}brand_id`}>العلامة التجارية</Label>
      <Controller
        name="brand_id"
        control={formInstance.control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر العلامة التجارية" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={String(brand.id)}>{brand.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {formInstance.formState.errors.brand_id && (
        <p className="text-sm text-destructive">{formInstance.formState.errors.brand_id.message}</p>
      )}
    </div>

    <div className="space-y-2">
      <Label htmlFor={`${prefix}type`}>النوع</Label>
      <Controller
        name="type"
        control={formInstance.control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(typeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {formInstance.formState.errors.type && (
        <p className="text-sm text-destructive">{formInstance.formState.errors.type.message}</p>
      )}
    </div>

    <div className="space-y-2">
      <Label htmlFor={`${prefix}min_stock`}>الحد الأدنى للمخزون</Label>
      <Input id={`${prefix}min_stock`} type="number" min="0" {...formInstance.register("min_stock")} />
      {formInstance.formState.errors.min_stock && (
        <p className="text-sm text-destructive">{formInstance.formState.errors.min_stock.message}</p>
      )}
    </div>
  </div>
);

export default ProductFormFields;
