import { Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const typeLabels = {
  mobile: "موبايل",
  accessory: "إكسسوار",
  spare_part: "قطعة غيار",
};

const typeColors = {
  mobile: "bg-blue-100 text-blue-800",
  accessory: "bg-green-100 text-green-800",
  spare_part: "bg-orange-100 text-orange-800",
};

const ProductCard = ({ product, categoryMap, brandMap, openEditModal, confirmDelete }) => (
  <div className="bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-gray-700">{product.name}</h3>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => openEditModal(product)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" onClick={() => confirmDelete(product.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>

    <div className="mt-3 space-y-2">
      <span
        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${typeColors[product.type] || "bg-gray-100 text-gray-800"}`}
      >
        {typeLabels[product.type] || product.type}
      </span>

      <div className="text-xs text-muted-foreground space-y-1">
        {categoryMap[String(product.category_id)] && (
          <p>التصنيف: {categoryMap[String(product.category_id)]}</p>
        )}
        {brandMap[String(product.brand_id)] && (
          <p>العلامة التجارية: {brandMap[String(product.brand_id)]}</p>
        )}
        <p>الحد الأدنى: {product.min_stock}</p>
      </div>

      <div className="text-xs text-muted-foreground/80 font-medium pt-1">
        {formatDate(product.created_at)}
      </div>
    </div>
  </div>
);

export default ProductCard;
