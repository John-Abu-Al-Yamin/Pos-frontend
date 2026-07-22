import React from "react";
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
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useDeleteMaintenanceOperations } from "@/hooks/Actions/MaintenanceOperations/useCurdsMaintenanceOperations";

const MaintenanceOperationsTab = ({ ticket, headerId, canMutate, refetchTicket }) => {
  const navigate = useNavigate();
  const { mutate: deleteOperationMutate } = useDeleteMaintenanceOperations(headerId);

  const confirmDeleteOperation = (operationId) => {
    toast("هل أنت متأكد من حذف هذه العملية؟", {
      action: {
        label: "نعم",
        onClick: () =>
          deleteOperationMutate(
            { operationId },
            { onSuccess: () => refetchTicket() }
          ),
      },
      duration: Infinity,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          عمليات الصيانة
        </h2>
        {canMutate && (
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate(`/maintenance-operations/add/${headerId}`)}
          >
            <Plus className="h-4 w-4" />
            إضافة عملية
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">العملية</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الفني</TableHead>
              <TableHead className="text-right">التكلفة</TableHead>
              <TableHead className="text-right">ملاحظات</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticket.operations?.map((op, index) => (
              <TableRow key={op.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{op.description}</TableCell>
                <TableCell>{op.operation_date ? formatDate(op.operation_date) : "—"}</TableCell>
                <TableCell>{op.technician || "—"}</TableCell>
                <TableCell>
                  {op.cost ? formatCurrency(op.cost) : "—"}
                </TableCell>
                <TableCell>{op.notes || "—"}</TableCell>
                <TableCell>
                  {canMutate && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/maintenance-operations/update/${op.id}`,
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
                        onClick={() => confirmDeleteOperation(op.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!ticket.operations || ticket.operations.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  لا توجد عمليات صيانة
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MaintenanceOperationsTab;
