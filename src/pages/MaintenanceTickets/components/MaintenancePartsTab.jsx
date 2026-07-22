import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import ProductSearchCombobox from "@/customs/ProductSearchCombobox";
import { useAddMaintenanceUsedParts, useDeleteMaintenanceUsedParts } from "@/hooks/Actions/MaintenanceSpareParts/useCurdsMaintenanceSpareParts";

const MaintenancePartsTab = ({ ticket, headerId, canMutate, refetchTicket }) => {
  const navigate = useNavigate();
  const { mutate: addUsedPartMutate } = useAddMaintenanceUsedParts();
  const { mutate: deleteUsedPartMutate } = useDeleteMaintenanceUsedParts(headerId);

  const [showAddPart, setShowAddPart] = useState(false);
  const [newPartProduct, setNewPartProduct] = useState(null);
  const [newPartQty, setNewPartQty] = useState("1");

  const confirmDeleteUsedPart = (partId) => {
    toast(
      "هل أنت متأكد من حذف قطعة الغيار هذه؟ سيتم إعادة الكمية إلى المخزون.",
      {
        action: {
          label: "نعم",
          onClick: () =>
            deleteUsedPartMutate(
              { partId },
              { onSuccess: () => refetchTicket() }
            ),
        },
        duration: Infinity,
      }
    );
  };

  const handleAddPart = () => {
    if (!newPartProduct || !newPartQty || Number(newPartQty) <= 0) {
      toast.error("يرجى اختيار قطعة الغيار وإدخال كمية صحيحة");
      return;
    }

    addUsedPartMutate(
      {
        headerId: Number(headerId),
        data: {
          product_id: Number(newPartProduct.id),
          quantity: Number(newPartQty),
        },
      },
      {
        onSuccess: () => {
          setNewPartProduct(null);
          setNewPartQty("1");
          setShowAddPart(false);
          refetchTicket(); // Ensures total_cost is refetched
        },
      }
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Package className="h-5 w-5" />
          قطع الغيار المستخدمة
        </h2>
        {canMutate && (
          <div className="flex items-center gap-2">
            {!showAddPart && (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setShowAddPart(true);
                  setNewPartProduct(null);
                  setNewPartQty("1");
                }}
              >
                <Plus className="h-4 w-4" />
                إضافة قطعة غيار
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/maintenance-used-parts/add/${headerId}`)}
            >
              <Package className="h-4 w-4" />
              إضافة (قائمة كاملة)
            </Button>
          </div>
        )}
      </div>

      {canMutate && showAddPart && (
        <div className="mb-4 rounded-lg border bg-muted/30 p-4">
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 space-y-1">
              <Label>قطعة الغيار</Label>
              <ProductSearchCombobox
                value={newPartProduct?.id}
                onSelect={(product) => setNewPartProduct(product)}
                placeholder="اختر قطعة الغيار..."
                productType="spare_part"
              />
            </div>
            <div className="w-24 space-y-1">
              <Label>الكمية</Label>
              <Input
                type="number"
                min="1"
                step="any"
                value={newPartQty}
                onChange={(e) => setNewPartQty(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleAddPart}>
                إضافة
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowAddPart(false);
                  setNewPartProduct(null);
                  setNewPartQty("1");
                }}
              >
                إلغاء
              </Button>
            </div>
          </div>
          {newPartProduct && (
            <p className="mt-2 text-xs text-muted-foreground">
              سيتم احتساب السعر تلقائياً عند الإضافة وتحديث الإجمالي
            </p>
          )}
        </div>
      )}

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">قطعة الغيار</TableHead>
              <TableHead className="text-right">الكمية</TableHead>
              <TableHead className="text-right">سعر الوحدة</TableHead>
              <TableHead className="text-right">الإجمالي</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticket.used_parts?.map((part, index) => (
              <TableRow key={part.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{part.product?.name || "—"}</TableCell>
                <TableCell>{part.quantity}</TableCell>
                <TableCell>{formatCurrency(part.unit_price)}</TableCell>
                <TableCell>{formatCurrency(part.total_price)}</TableCell>
                <TableCell>
                  {canMutate && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/maintenance-used-parts/update/${part.id}`,
                            { state: { headerId } }
                          )
                        }
                      >
                        <Pencil className="h-4 w-4" />
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDeleteUsedPart(part.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!ticket.used_parts || ticket.used_parts.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  لا توجد قطع غيار
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MaintenancePartsTab;
