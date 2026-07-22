import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import AddEditHeader from "@/customs/AddEditHeader";
import Loading from "@/customs/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  useGetMaintenanceTicketById,
  useUpdateMaintenanceStatus,
} from "@/hooks/Actions/MaintenanceTickets/useCurdsMaintenanceTickets";

import MaintenanceHeaderInfo from "./components/MaintenanceHeaderInfo";
import MaintenanceOperationsTab from "./components/MaintenanceOperationsTab";
import MaintenancePartsTab from "./components/MaintenancePartsTab";
import MaintenanceSummary from "./components/MaintenanceSummary";
import MaintenancePaymentModal from "./components/MaintenancePaymentModal";

const statusConfig = {
  pending: { label: "قيد الانتظار" },
  under_repair: { label: "قيد الإصلاح" },
  waiting_parts: { label: "بانتظار قطع الغيار" },
  repaired: { label: "تم الإصلاح" },
  delivered: { label: "تم التسليم" },
  cancelled: { label: "ملغي" },
};

const statusTransitions = {
  pending: ["under_repair", "cancelled"],
  under_repair: ["waiting_parts", "repaired", "cancelled"],
  waiting_parts: ["under_repair", "cancelled"],
  repaired: ["cancelled"],
  delivered: [],
  cancelled: [],
};

const DetlaisMaintenanceTicket = () => {
  const { id } = useParams();

  const { data, isPending, refetch } = useGetMaintenanceTicketById(id);
  const { mutate: updateStatusMutate } = useUpdateMaintenanceStatus();

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);

  if (isPending) return <Loading />;

  const ticket = data?.data?.data;
  if (!ticket) return null;

  const allowedTransitions = statusTransitions[ticket.status] || [];
  const canMutate = !["delivered", "cancelled"].includes(ticket.status);

  const handleStatusChangeAttempt = (newStatus) => {
    if (newStatus === ticket.status) return;

    if (newStatus === 'cancelled') {
      setPendingStatusChange(newStatus);
      setIsCancelDialogOpen(true);
      return;
    }

    // Direct transition for non-cancelled
    executeStatusChange(newStatus);
  };

  const executeStatusChange = (newStatus) => {
    updateStatusMutate(id, newStatus, {
      onSuccess: () => {
        if (newStatus === 'cancelled') {
          toast.success("تم إلغاء التذكرة واسترجاع قطع الغيار إلى المخزون بنجاح.");
        } else {
          // toast.success("تم تحديث حالة التذكرة بنجاح.");
        }
        refetch();
        setIsCancelDialogOpen(false);
        setPendingStatusChange(null);
      },
      onError: () => {
        setIsCancelDialogOpen(false);
        setPendingStatusChange(null);
      }
    });
  };

  return (
    <div>
      <AddEditHeader
        title={`تذكرة صيانة رقم ${ticket.ticket_number}`}
        description={ticket.problem_description || "لا توجد ملاحظات"}
        backPath="/maintenance-tickets"
        backText="رجوع"
      />

      <div className="p-6 pb-2">
        {canMutate && (allowedTransitions.length > 0) && (
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              تغيير الحالة:
            </span>
            <div className="w-48">
              <Select value={ticket.status} onValueChange={handleStatusChangeAttempt}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[ticket.status, ...allowedTransitions].map((st) => (
                    <SelectItem key={st} value={st}>
                      {statusConfig[st]?.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <MaintenanceHeaderInfo 
        ticket={ticket} 
        statusTransitions={statusTransitions} 
        canMutate={canMutate}
        handleStatusChange={handleStatusChangeAttempt} 
      />

      <div className="space-y-8 px-6 pb-8">
        <MaintenanceOperationsTab 
          ticket={ticket} 
          headerId={id} 
          canMutate={canMutate} 
          refetchTicket={refetch} 
        />

        <MaintenancePartsTab 
          ticket={ticket} 
          headerId={id} 
          canMutate={canMutate} 
          refetchTicket={refetch} 
        />

        <MaintenanceSummary 
          ticket={ticket} 
          headerId={id} 
          canMutate={canMutate} 
          refetchTicket={refetch} 
          onPayAndDeliver={() => setIsPaymentModalOpen(true)}
        />
      </div>

      <MaintenancePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        ticket={ticket}
        headerId={id}
        refetchTicket={refetch}
      />

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">هل أنت متأكد من إلغاء تذكرة الصيانة؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم إلغاء التذكرة بشكل نهائي. 
              <br /><br />
              <span className="font-semibold text-foreground">تحذير:</span> سيتم إرجاع جميع قطع الغيار المستخدمة في هذه التذكرة تلقائياً إلى المخزون. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={isPending}>تراجع</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => executeStatusChange(pendingStatusChange)} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              تأكيد الإلغاء
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DetlaisMaintenanceTicket;
