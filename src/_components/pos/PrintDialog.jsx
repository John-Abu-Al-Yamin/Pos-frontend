import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Receipt from "./Receipt";

const PrintDialog = ({ sale, onPrint, onSkip }) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <Receipt sale={sale} />
      </div>
      <div className="border-t border-gray-200 p-4 flex gap-3 justify-center no-print">
        <Button variant="outline" onClick={onSkip}>
          تخطي
        </Button>
        <Button onClick={onPrint} className="gap-2">
          <Printer className="h-4 w-4" />
          طباعة الفاتورة
        </Button>
      </div>
    </div>
  </div>
);

export default PrintDialog;
