import CustomHeader from "@/customs/CustomHeader";
import Loading from "@/customs/Loading";
import CustomPagination from "@/customs/CustomPagination";
import { useGetAllStock } from "@/hooks/Actions/stock/useCurdsStock";
import { useGetAllCategories } from "@/hooks/Actions/Categories/useCurdsCategories";
import { useGetAllProducts } from "@/hooks/Actions/Product/useCurdsProduct";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const conditionBadge = (condition) => {
  const styles = {
    new: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    excellent: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    good: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    fair: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  };
  const labels = {
    new: "جديد",
    excellent: "ممتاز",
    good: "جيد",
    fair: "مقبول",
  };
  return (
    <Badge variant="outline" className={styles[condition] || styles.fair}>
      {labels[condition] || condition}
    </Badge>
  );
};

const statusBadge = (status) => {
  const styles = {
    available: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    sold: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
    damaged: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    returned: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    reserved: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    voided: "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100",
  };
  const labels = {
    available: "متوفر",
    sold: "تم البيع",
    damaged: "تالف",
    returned: "مرتجع",
    reserved: "محجوز",
    voided: "ملغي",
  };
  return (
    <Badge variant="outline" className={styles[status] || styles.available}>
      {labels[status] || status}
    </Badge>
  );
};

const FILTER_DEBOUNCE = 300;

const StockPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [productId, setProductId] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [condition, setCondition] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), FILTER_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [search]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId, productId, status, condition]);

  const { data: stockData, isPending } = useGetAllStock({
    page,
    per_page: 20,
    search: debouncedSearch || undefined,
    category_id: categoryId || undefined,
    product_id: productId || undefined,
    status: status || undefined,
    condition: condition || undefined,
  });
  const stockItems = stockData?.data?.data ?? [];
  const pagination = stockData?.data?.pagination;

  const { data: categoriesRes } = useGetAllCategories(1, 100);
  const categories = categoriesRes?.data?.data ?? [];

  const { data: productsRes } = useGetAllProducts(1, 500);
  const products = productsRes?.data?.data ?? [];

  const filteredProducts = categoryId
    ? products.filter((p) => String(p.category_id) === String(categoryId))
    : products;

  const hasActiveFilters = debouncedSearch || categoryId || productId || status || condition;

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategoryId("");
    setProductId("");
    setStatus("");
    setCondition("");
  };

  return (
    <div>
      <CustomHeader
        title="المخزون"
        description="قائمة عناصر المخزون"
      />

      <div className="space-y-4 mt-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن منتج أو رقم تسلسلي..."
              className="pr-10 text-right"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setProductId(""); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="كل التصنيفات" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value=" ">كل التصنيفات</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="كل المنتجات" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value=" ">كل المنتجات</SelectItem>
              {filteredProducts.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="كل الحالات" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value=" ">كل الحالات</SelectItem>
              <SelectItem value="available">متوفر</SelectItem>
              <SelectItem value="sold">تم البيع</SelectItem>
              <SelectItem value="damaged">تالف</SelectItem>
              <SelectItem value="returned">مرتجع</SelectItem>
              <SelectItem value="reserved">محجوز</SelectItem>
              <SelectItem value="voided">ملغي</SelectItem>
            </SelectContent>
          </Select>

          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="كل الحالات الفنية" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value=" ">كل الحالات الفنية</SelectItem>
              <SelectItem value="new">جديد</SelectItem>
              <SelectItem value="excellent">ممتاز</SelectItem>
              <SelectItem value="good">جيد</SelectItem>
              <SelectItem value="fair">مقبول</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-4 w-4" />
              مسح الكل
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm mt-4" dir="rtl">
        {isPending ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">#</TableHead>
                  <TableHead className="text-right">المنتج</TableHead>
                  <TableHead className="text-right">التصنيف</TableHead>
                  <TableHead className="text-right">الرقم التسلسلي</TableHead>
                  <TableHead className="text-right">سعر التكلفة</TableHead>
                  <TableHead className="text-right">الحالة الفنية</TableHead>
                  <TableHead className="text-right">الوضع</TableHead>
                  <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                      لا توجد عناصر مطابقة للبحث
                    </TableCell>
                  </TableRow>
                ) : (
                  stockItems.map((item) => (
                    <TableRow
                      key={item.id}
                      onClick={() => navigate(`/stock/${item.id}`)}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>{item.id}</TableCell>
                      <TableCell className="font-medium">{item.product?.name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {item.product?.category?.name}
                      </TableCell>
                      <TableCell dir="ltr" className="text-right font-mono text-xs">
                        {item.serial_number}
                      </TableCell>
                      <TableCell>{Number(item.cost_price).toLocaleString()}</TableCell>
                      <TableCell>{conditionBadge(item.condition)}</TableCell>
                      <TableCell>{statusBadge(item.status)}</TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <CustomPagination
              pagination={pagination}
              onPageChange={(p) => setPage(p)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default StockPage;
