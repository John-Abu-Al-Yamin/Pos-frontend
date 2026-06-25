import { Plus, Package, Loader2, PackageOpen, Trash2, Pencil, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const InvoiceItemsSection = ({
  items,
  itemsPending,
  totalItems,
  grandTotal,
  deletePending,
  onDeleteItem,
  onAddItem,
  onEditItem,
  onViewItem,
}) => (
  <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
    <div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-border"
      dir="rtl"
    >
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
          <Package className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">
            أصناف الفاتورة
          </h2>
          <p className="text-xs text-muted-foreground">
            {totalItems} صنف · الإجمالي:{" "}
            <span className="font-semibold text-foreground">
              {grandTotal.toLocaleString("ar-EG")}
            </span>
          </p>
        </div>
      </div>

      <Button
        onClick={onAddItem}
        className="gap-2 self-start sm:self-center"
        size="sm"
      >
        <Plus className="h-4 w-4" />
        إضافة أصناف الفاتورة
      </Button>
    </div>

    {itemsPending ? (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    ) : items.length === 0 ? (
      <div
        className="flex flex-col items-center justify-center gap-3 py-16 text-center"
        dir="rtl"
      >
        <div className="rounded-full bg-neutral-100 p-4">
          <PackageOpen className="h-8 w-8 text-neutral-400" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          لا توجد أصناف في هذه الفاتورة بعد
        </p>
        <Button
          onClick={onAddItem}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          إضافة أصناف الفاتورة
        </Button>
      </div>
    ) : (
      <div dir="rtl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">المنتج</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الكمية</TableHead>
              <TableHead className="text-right">سعر الوحدة</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-muted-foreground text-sm">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="font-medium text-sm">
                      {item.product?.name ?? `منتج #${item.product_id}`}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {item.condition && (
                    <Badge
                      variant="outline"
                      className={
                        {
                          new: "bg-blue-50 text-blue-700 border-blue-200",
                          excellent:
                            "bg-green-50 text-green-700 border-green-200",
                          good: "bg-emerald-50 text-emerald-700 border-emerald-200",
                          fair: "bg-amber-50 text-amber-700 border-amber-200",
                        }[item.condition] ?? ""
                      }
                    >
                      {{
                        new: "جديد",
                        excellent: "ممتاز",
                        good: "جيد",
                        fair: "مقبول",
                      }[item.condition] ?? item.condition}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {Number(item.quantity).toLocaleString("ar-EG")}
                </TableCell>
                <TableCell>
                  {Number(item.unit_cost ?? item.unit_price).toLocaleString(
                    "ar-EG",
                  )}
                </TableCell>
                <TableCell className="font-semibold">
                  {(
                    Number(item.quantity) *
                    Number(item.unit_cost ?? item.unit_price)
                  ).toLocaleString("ar-EG")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-neutral-100"
                      onClick={() => onViewItem(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-neutral-100"
                      onClick={() => onEditItem(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={deletePending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent dir="rtl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف الصنف</AlertDialogTitle>
                        <AlertDialogDescription>
                          هل أنت متأكد من حذف هذا الصنف؟ لا يمكن التراجع عن هذا
                          الإجراء.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-row-reverse gap-2">
                        <AlertDialogAction
                          onClick={() => onDeleteItem(item.id)}
                          className="bg-destructive text-white hover:bg-destructive/90"
                        >
                          حذف
                        </AlertDialogAction>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div
          className="flex items-center justify-between px-5 py-3 border-t border-border bg-neutral-50"
          dir="rtl"
        >
          <span className="text-sm font-semibold text-muted-foreground">
            الإجمالي الكلي
          </span>
          <span className="text-base font-bold text-foreground">
            {grandTotal.toLocaleString("ar-EG")}
          </span>
        </div>
      </div>
    )}
  </div>
);

export default InvoiceItemsSection;
