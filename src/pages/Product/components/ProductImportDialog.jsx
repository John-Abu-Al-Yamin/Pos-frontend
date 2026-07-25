import React from "react";
import { toast } from "sonner";
import { FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import AppModalAdd from "@/customs/AppModalAdd";
import { Button } from "@/components/ui/button";
import { useImportProducts } from "@/hooks/Actions/Product/useImportProducts";
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

const ProductImportDialog = ({ open, onOpenChange }) => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [validationMessage, setValidationMessage] = React.useState("");
  const [progress, setProgress] = React.useState(0);
  const [summary, setSummary] = React.useState(null);
  const inputRef = React.useRef(null);
  const importMutation = useImportProducts();

  const validateFile = (file) => {
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return "Please choose an xlsx, xls, or csv file.";
    }

    if (file.size > maxFileSize) {
      return "File size must be 5 MB or less.";
    }

    return "";
  };

  const chooseFile = (file) => {
    if (!file) return;

    const message = validateFile(file);
    setValidationMessage(message);
    setSummary(null);

    if (!message) {
      setSelectedFile(file);
      setProgress(0);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    importMutation.mutate(
      {
        file: selectedFile,
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      },
      {
        onSuccess: (response) => {
          setSummary(response.data.data);
          setSelectedFile(null);
          setProgress(100);
          toast.success(response.data.message || "Product import completed");
        },
        onError: (error) => {
          const message = error?.response?.data?.message || "Product import failed";
          toast.error(message);
        },
      },
    );
  };

  const resetFile = () => {
    setSelectedFile(null);
    setValidationMessage("");
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const errors = summary?.errors ?? [];
  const skippedRows = summary?.skipped_rows ?? [];

  return (
    <AppModalAdd
      open={open}
      onOpenChange={onOpenChange}
      title="Import Products"
      description="Upload product definitions only. Inventory stock is not created here."
      submitText="Upload"
      cancelText="Cancel"
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
          <p className="font-medium text-slate-800">Drop Excel file here</p>
          <p className="text-sm text-slate-500">xlsx, xls, csv up to 5 MB</p>
        </div>
        <Button type="button" variant="outline" onClick={(event) => { event.stopPropagation(); inputRef.current?.click(); }}>
          <Upload className="h-4 w-4" />
          Select Excel
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
            Uploading and processing...
          </p>
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Total rows", summary.total_rows],
            ["Created", summary.created],
            ["Skipped", summary.skipped],
            ["Failed", summary.failed],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border p-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      )}

      {errors.length > 0 && (
        <ResultTable title="Errors" rows={errors} columns={["row", "product", "field", "message"]} />
      )}

      {skippedRows.length > 0 && (
        <ResultTable title="Skipped Products" rows={skippedRows} columns={["row", "product", "reason"]} />
      )}
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
              <TableHead key={column}>{column}</TableHead>
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

export default ProductImportDialog;
