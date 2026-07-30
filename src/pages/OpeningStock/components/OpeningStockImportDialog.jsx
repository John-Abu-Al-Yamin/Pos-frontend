import React from "react";
import { toast } from "sonner";
import { FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import AppModalAdd from "@/customs/AppModalAdd";
import { Button } from "@/components/ui/button";
import { useImportOpeningStock } from "@/hooks/Actions/OpeningStock/useOpeningStockImport";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const allowedExtensions = ["xlsx", "xls", "csv"];
const maxFileSize = 5 * 1024 * 1024;
const columnLabels = {
  row: "الصف",
  product: "المنتج",
  field: "الحقل",
  message: "الرسالة",
  reason: "السبب",
};

const OpeningStockImportDialog = ({ open, onOpenChange, templateType, templateLabel, onImportComplete, onImportError }) => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [validationMessage, setValidationMessage] = React.useState("");
  const [progress, setProgress] = React.useState(0);
  const [summary, setSummary] = React.useState(null);
  const [importErrors, setImportErrors] = React.useState([]);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const inputRef = React.useRef(null);
  const importMutation = useImportOpeningStock();

  const validateFile = (file) => {
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return "يرجى اختيار ملف xlsx أو xls أو csv.";
    }

    if (file.size > maxFileSize) {
      return "يجب ألا يتجاوز حجم الملف 5 ميجابايت.";
    }

    return "";
  };

  const chooseFile = (file) => {
    if (!file) return;

    const message = validateFile(file);
    setValidationMessage(message);
    setSummary(null);
    setImportErrors([]);

    if (message) {
      setSelectedFile(null);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (!message) {
      setSelectedFile(file);
      setProgress(0);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setConfirmOpen(true);
  };

  const confirmImport = () => {
    if (!selectedFile) return;

    setConfirmOpen(false);
    importMutation.mutate(
      {
        file: selectedFile,
        templateType,
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      },
      {
        onSuccess: (response) => {
          const importSummary = response.data.data;
          setSummary(importSummary);
          setSelectedFile(null);
          setProgress(100);
          setImportErrors([]);
          if (inputRef.current) inputRef.current.value = "";
          toast.success(response.data.message || "تم استيراد المخزون الافتتاحي بنجاح");
          if (typeof onImportComplete === "function") {
            onImportComplete(importSummary);
          }
        },
        onError: (error) => {
          const errorData = error?.response?.data;
          const backendErrors = errorData?.errors;

          if (Array.isArray(backendErrors) && backendErrors.length > 0) {
            setImportErrors(backendErrors);
          }

          const message = errorData?.message || "فشل استيراد المخزون الافتتاحي";
          toast.error(message);

          if (typeof onImportError === "function") {
            onImportError(error);
          }
        },
      },
    );
  };

  const resetFile = () => {
    setSelectedFile(null);
    setValidationMessage("");
    setProgress(0);
    setImportErrors([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const errors = summary?.errors ?? [];
  const skippedRows = summary?.skipped_rows ?? [];

  const summaryCards = summary
    ? [
        ["إجمالي الصفوف", summary.total_rows],
        ["صفوف الكميات", summary.quantity_rows],
        ["صفوف الجوالات", summary.serialized_rows],
        ["إجمالي الكميات", summary.quantity_units],
        ["إجمالي الجوالات", summary.serialized_units],
        ["حركات المخزون", summary.stock_movements],
      ]
    : [];

  return (
    <AppModalAdd
      open={open}
      onOpenChange={onOpenChange}
      title={`استيراد المخزون الافتتاحي - ${templateLabel}`}
      description={`ارفع قالب المخزون الافتتاحي الخاص بـ ${templateLabel}.`}
      submitText="رفع"
      cancelText="إلغاء"
      isLoading={importMutation.isPending}
      isDisabled={!selectedFile || !!validationMessage}
      onSubmit={handleUpload}
      size="4xl"
    >
      <div
        className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          chooseFile(event.dataTransfer.files?.[0]);
        }}
      >
        <FileSpreadsheet className="h-10 w-10 text-slate-500" />
        <div>
          <p className="font-medium text-slate-800">اسحب ملف Excel هنا</p>
          <p className="text-sm text-slate-500">xlsx أو xls أو csv حتى 5 ميجابايت</p>
        </div>
        <Button type="button" variant="outline" onClick={(event) => { event.stopPropagation(); inputRef.current?.click(); }}>
          <Upload className="h-4 w-4" />
          اختيار ملف Excel
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(event) => chooseFile(event.target.files?.[0])}
        />
      </div>

      {validationMessage && <p className="text-sm text-destructive">{validationMessage}</p>}

      {selectedFile && (
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <p className="font-medium">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">{Math.ceil(selectedFile.size / 1024)} KB</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={resetFile} disabled={importMutation.isPending}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {importMutation.isPending && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            جاري الرفع والمعالجة...
          </p>
        </div>
      )}

      {summary && summaryCards.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {summaryCards.map(([label, value]) => (
            <div key={label} className="rounded-md border p-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      )}

      {importErrors.length > 0 && (
        <ResultTable title="الأخطاء" rows={importErrors} columns={["row", "product", "field", "message"]} />
      )}

      {errors.length > 0 && (
        <ResultTable title="الأخطاء" rows={errors} columns={["row", "product", "field", "message"]} />
      )}

      {skippedRows.length > 0 && (
        <ResultTable title="الصفوف المتجاهلة" rows={skippedRows} columns={["row", "product", "reason"]} />
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد استيراد المخزون الافتتاحي</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم استيراد مخزون {templateLabel} الافتتاحي وإنشاء سجلات المخزون وحركات المخزون من الملف المحدد. لا يمكن التراجع عن هذه العملية.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel type="button" disabled={importMutation.isPending}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction type="button" onClick={confirmImport} disabled={importMutation.isPending}>
              {importMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              تأكيد الاستيراد
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppModalAdd>
  );
};

const ResultTable = ({ title, rows, columns }) => (
  <div className="space-y-2">
    <h3 className="text-base font-semibold">{title}</h3>
    <div className="max-h-64 overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{columnLabels[column] ?? column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`${row.row}-${index}`}>
              {columns.map((column) => (
                <TableCell key={column}>{row[column] ?? "-"}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default OpeningStockImportDialog;
