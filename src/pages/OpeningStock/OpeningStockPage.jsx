import React from "react";
import { toast } from "sonner";
import { Download, Upload, CircleCheckBig, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  downloadOpeningStockTemplate,
  OPENING_STOCK_TEMPLATE_TYPES,
} from "@/hooks/Actions/OpeningStock/useOpeningStockImport";
import OpeningStockImportDialog from "./components/OpeningStockImportDialog";

const templateOptions = {
  [OPENING_STOCK_TEMPLATE_TYPES.mobile]: {
    label: "Mobile",
    downloadText: "Download Mobile Template",
    importText: "Import Mobile Excel",
  },
  [OPENING_STOCK_TEMPLATE_TYPES.quantity]: {
    label: "Accessories & Spare Parts",
    downloadText: "Download Accessories & Spare Parts Template",
    importText: "Import Accessories Excel",
  },
};

const OpeningStockPage = () => {
  const [importOpen, setImportOpen] = React.useState(false);
  const [completedTemplateTypes, setCompletedTemplateTypes] = React.useState([]);
  const [downloadingTemplateType, setDownloadingTemplateType] = React.useState(null);
  const [selectedTemplateType, setSelectedTemplateType] = React.useState(OPENING_STOCK_TEMPLATE_TYPES.mobile);
  const [latestSummary, setLatestSummary] = React.useState(null);

  const handleDownloadTemplate = async (templateType) => {
    try {
      setDownloadingTemplateType(templateType);
      await downloadOpeningStockTemplate(templateType);
      toast.success("Template downloaded successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Template download failed");
    } finally {
      setDownloadingTemplateType(null);
    }
  };

  const openImportDialog = (templateType) => {
    setSelectedTemplateType(templateType);
    setImportOpen(true);
  };

  const handleImportComplete = (summary) => {
    setLatestSummary(summary);
    setCompletedTemplateTypes((current) => (
      current.includes(selectedTemplateType) ? current : [...current, selectedTemplateType]
    ));
  };

  const handleImportError = (error) => {
    const errorData = error?.response?.data;
    const messages = [
      errorData?.message,
      ...(Array.isArray(errorData?.errors)
        ? errorData.errors.map((item) => item?.message)
        : []),
    ].filter(Boolean);

    if (messages.some((message) => message.toLowerCase().includes("already been completed"))) {
      setCompletedTemplateTypes((current) => (
        current.includes(selectedTemplateType) ? current : [...current, selectedTemplateType]
      ));
    }
  };

  const isTemplateCompleted = (templateType) => completedTemplateTypes.includes(templateType);
  const allTemplatesCompleted = Object.keys(templateOptions).every(isTemplateCompleted);

  const summaryCards = latestSummary
    ? [
        ["Total rows", latestSummary.total_rows],
        ["Quantity rows", latestSummary.quantity_rows],
        ["Serialized rows", latestSummary.serialized_rows],
        ["Quantity units", latestSummary.quantity_units],
        ["Serialized units", latestSummary.serialized_units],
        ["Stock movements", latestSummary.stock_movements],
      ]
    : [];

  return (
    <div>
      <header className="flex items-center justify-between text-neutral-950 mb-10">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Opening Stock</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Import initial inventory from an Excel file. This is a one-time operation.
          </p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Opening Stock</CardTitle>
            <CardDescription>
              Download the Excel template, fill in your initial inventory data, and import it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allTemplatesCompleted ? (
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-medium">Opening stock has been completed</p>
                  <p className="text-green-700 mt-1">Initial inventory has already been imported.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDownloadTemplate(OPENING_STOCK_TEMPLATE_TYPES.mobile)}
                  disabled={!!downloadingTemplateType}
                >
                  {downloadingTemplateType === OPENING_STOCK_TEMPLATE_TYPES.mobile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {downloadingTemplateType === OPENING_STOCK_TEMPLATE_TYPES.mobile ? "Downloading..." : templateOptions[OPENING_STOCK_TEMPLATE_TYPES.mobile].downloadText}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDownloadTemplate(OPENING_STOCK_TEMPLATE_TYPES.quantity)}
                  disabled={!!downloadingTemplateType}
                >
                  {downloadingTemplateType === OPENING_STOCK_TEMPLATE_TYPES.quantity ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {downloadingTemplateType === OPENING_STOCK_TEMPLATE_TYPES.quantity ? "Downloading..." : templateOptions[OPENING_STOCK_TEMPLATE_TYPES.quantity].downloadText}
                </Button>
                <Button
                  type="button"
                  onClick={() => openImportDialog(OPENING_STOCK_TEMPLATE_TYPES.mobile)}
                  disabled={isTemplateCompleted(OPENING_STOCK_TEMPLATE_TYPES.mobile)}
                >
                  <Upload className="h-4 w-4" />
                  {isTemplateCompleted(OPENING_STOCK_TEMPLATE_TYPES.mobile) ? "Mobile Completed" : templateOptions[OPENING_STOCK_TEMPLATE_TYPES.mobile].importText}
                </Button>
                <Button
                  type="button"
                  onClick={() => openImportDialog(OPENING_STOCK_TEMPLATE_TYPES.quantity)}
                  disabled={isTemplateCompleted(OPENING_STOCK_TEMPLATE_TYPES.quantity)}
                >
                  <Upload className="h-4 w-4" />
                  {isTemplateCompleted(OPENING_STOCK_TEMPLATE_TYPES.quantity) ? "Accessories Completed" : templateOptions[OPENING_STOCK_TEMPLATE_TYPES.quantity].importText}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
            <CardDescription>
              Opening stock can only be imported once.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              <Info className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="space-y-1">
                <p className="font-medium">Before you begin</p>
                <ul className="list-disc pl-4 text-blue-700 space-y-1">
                  <li>Make sure all products are already created in the system.</li>
                  <li>Use the template file to prepare your data.</li>
                  <li>Mobile products require serial numbers / IMEI.</li>
                  <li>Accessories and spare parts require quantities.</li>
                  <li>This operation cannot be undone.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {summaryCards.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Last Import Summary</CardTitle>
            <CardDescription>Opening stock import completed successfully.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {summaryCards.map(([label, value]) => (
                <div key={label} className="rounded-md border p-3">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <OpeningStockImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        templateType={selectedTemplateType}
        templateLabel={templateOptions[selectedTemplateType].label}
        onImportComplete={handleImportComplete}
        onImportError={handleImportError}
      />
    </div>
  );
};

export default OpeningStockPage;
