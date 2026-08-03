import React from "react";
import {
  Eye,
  Search,
  X,
  ScrollText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";

import CustomHeader from "@/customs/CustomHeader";
import CustomPagination from "@/customs/CustomPagination";
import Loading from "@/customs/Loading";
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
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  useGetAllAuditLogs,
  useGetAuditLogById,
  useGetAuditLogStats,
  useGetAuditLogFilters,
  useGetAuditLogRelated,
} from "@/hooks/Actions/auditLogs/useCurdsAuditLogs";
import useSearch from "@/hooks/useSearch/useSearch";
import { formatDateTime } from "@/lib/utils";
import {
  moduleLabels,
  actionLabels,
  statusLabels,
  severityLabels,
  statusVariant,
  severityVariant,
  getModuleLabel,
  getActionLabel,
} from "@/constants/auditLogs";

const prettyJson = (value) => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
};

const AuditLogsPage = () => {
  const [page, setPage] = React.useState(1);
  const per_page = 25;
  const [filterModule, setFilterModule] = React.useState("");
  const [filterAction, setFilterAction] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [filterSeverity, setFilterSeverity] = React.useState("");
  const [filterFrom, setFilterFrom] = React.useState("");
  const [filterTo, setFilterTo] = React.useState("");
  const [appliedFrom, setAppliedFrom] = React.useState("");
  const [appliedTo, setAppliedTo] = React.useState("");
  const [dateError, setDateError] = React.useState("");
  const [detailsId, setDetailsId] = React.useState(null);
  const { debouncedSearch, search, handelSearch, setSearch } = useSearch("", 400);

  const filters = {
    search: debouncedSearch || undefined,
    module: filterModule || undefined,
    action: filterAction || undefined,
    status: filterStatus || undefined,
    severity: filterSeverity || undefined,
    from: appliedFrom || undefined,
    to: appliedTo || undefined,
  };

  const { data, isPending } = useGetAllAuditLogs(page, per_page, filters);
  const { data: statsData } = useGetAuditLogStats(filters);
  const { data: filtersData } = useGetAuditLogFilters();
  const { data: detailsData, isPending: detailsPending } = useGetAuditLogById(detailsId);
  const { data: relatedData } = useGetAuditLogRelated(detailsId);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterModule, filterAction, filterStatus, filterSeverity, appliedFrom, appliedTo]);

  const handleApplyFilters = () => {
    const hasFrom = !!filterFrom;
    const hasTo = !!filterTo;
    if (hasFrom !== hasTo) {
      setDateError("يرجى تحديد تاريخ البداية وتاريخ النهاية معًا لتطبيق فلتر التاريخ");
      return;
    }
    setDateError("");
    setAppliedFrom(filterFrom);
    setAppliedTo(filterTo);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setFilterModule("");
    setFilterAction("");
    setFilterStatus("");
    setFilterSeverity("");
    setFilterFrom("");
    setFilterTo("");
    setAppliedFrom("");
    setAppliedTo("");
    setDateError("");
    setPage(1);
  };

  const hasActiveFilters =
    debouncedSearch ||
    filterModule ||
    filterAction ||
    filterStatus ||
    filterSeverity ||
    appliedFrom ||
    appliedTo;

  if (isPending) return <Loading />;

  const items = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const selectedItem = detailsData?.data?.data;
  const relatedItems = relatedData?.data?.data ?? [];

  const modules = filtersData?.data?.data?.modules ?? Object.keys(moduleLabels);
  const actions = filtersData?.data?.data?.actions ?? Object.keys(actionLabels);
  const statuses = filtersData?.data?.data?.statuses ?? ["success", "failed"];
  const severities = filtersData?.data?.data?.severities ?? ["info", "warning", "critical"];

  return (
    <div>
      <CustomHeader
        title="سجل النشاطات"
        description="سجل تدقيق شامل لجميع العمليات والإجراءات داخل النظام"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <ScrollText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statsData?.data?.data?.total ?? "—"}</p>
              <p className="text-sm text-muted-foreground">إجمالي النشاطات</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statsData?.data?.data?.critical ?? "—"}</p>
              <p className="text-sm text-muted-foreground">نشاطات حرجة</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statsData?.data?.data?.failed ?? "—"}</p>
              <p className="text-sm text-muted-foreground">نشاطات فاشلة</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <XCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {(statsData?.data?.data?.total ?? 0) - (statsData?.data?.data?.failed ?? 0)}
              </p>
              <p className="text-sm text-muted-foreground">نشاطات ناجحة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="relative w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث باسم المستخدم أو البريد أو الرقم..."
            value={search}
            onChange={handelSearch}
            className="pr-9"
          />
        </div>

        <div className="w-44">
          <Select value={filterModule} onValueChange={setFilterModule}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="الوحدة" />
            </SelectTrigger>
            <SelectContent>
              {modules.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {moduleLabels[opt] || opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-44">
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="الإجراء" />
            </SelectTrigger>
            <SelectContent>
              {actions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {actionLabels[opt] || opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-40">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {statusLabels[opt] || opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-40">
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="الخطورة" />
            </SelectTrigger>
            <SelectContent>
              {severities.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {severityLabels[opt] || opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-40">
          <label className="mb-1 block text-xs text-muted-foreground">من تاريخ</label>
          <Input type="date" value={filterFrom} onChange={(e) => { setFilterFrom(e.target.value); setDateError(""); }} />
        </div>

        <div className="w-40">
          <label className="mb-1 block text-xs text-muted-foreground">إلى تاريخ</label>
          <Input type="date" value={filterTo} onChange={(e) => { setFilterTo(e.target.value); setDateError(""); }} />
        </div>

        <Button variant="default" onClick={handleApplyFilters} title="تطبيق الفلاتر">
          <Filter className="h-4 w-4" />
          تطبيق الفلاتر
        </Button>

        {hasActiveFilters && (
          <Button variant="outline" size="icon" onClick={clearFilters} title="مسح الفلترة">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {dateError && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {dateError}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">المستخدم</TableHead>
              <TableHead className="text-right">الوحدة</TableHead>
              <TableHead className="text-right">الإجراء</TableHead>
              <TableHead className="text-right">الكيان</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الخطورة</TableHead>
              <TableHead className="text-right">عنوان IP</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => {
              const status = statusVariant[item.status] || statusVariant.success;
              const severity = severityVariant[item.severity] || severityVariant.info;
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium">{item.user_name || "—"}</div>
                    <div className="text-muted-foreground/70">{item.user_email || ""}</div>
                  </TableCell>
                  <TableCell className="text-xs">{getModuleLabel(item.module)}</TableCell>
                  <TableCell className="text-xs">{getActionLabel(item.action)}</TableCell>
                  <TableCell className="text-xs">
                    {item.auditable_label || "—"}
                    {item.auditable_id && <span className="text-muted-foreground/60"> #{item.auditable_id}</span>}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${severity.className}`}>
                      {severity.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{item.ip_address || "—"}</TableCell>
                  <TableCell className="text-xs">{formatDateTime(item.occurred_at)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setDetailsId(item.id)}>
                      <Eye className="h-4 w-4" />
                      عرض
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                  لا توجد سجلات نشاط
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CustomPagination pagination={pagination} onPageChange={(p) => setPage(p)} />

      {/* Details Dialog */}
      <Dialog open={!!detailsId} onOpenChange={(open) => { if (!open) setDetailsId(null); }}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-start border-b border-border pb-4">
            <DialogTitle className="text-xl font-bold">تفاصيل سجل النشاط</DialogTitle>
            <DialogDescription>عرض تفاصيل السجل والمرتبط به</DialogDescription>
          </DialogHeader>

          {detailsPending ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground animate-pulse">جاري التحميل...</div>
            </div>
          ) : selectedItem ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الوحدة</p>
                  <p className="text-sm font-medium">{getModuleLabel(selectedItem.module)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الإجراء</p>
                  <p className="text-sm font-medium">{getActionLabel(selectedItem.action)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">المستخدم</p>
                  <p className="text-sm font-medium">
                    {selectedItem.user_name || "—"}
                    {selectedItem.user_email && <span className="text-muted-foreground"> ({selectedItem.user_email})</span>}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الدور</p>
                  <p className="text-sm font-medium">{selectedItem.user_role || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الكيان</p>
                  <p className="text-sm font-medium">
                    <span className="font-mono text-xs">{selectedItem.auditable_type?.split("\\").pop() || "—"}</span>
                    {selectedItem.auditable_id && <span className="text-muted-foreground"> #{selectedItem.auditable_id}</span>}
                    {selectedItem.auditable_label && <span> — {selectedItem.auditable_label}</span>}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الحالة / الخطورة</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${(statusVariant[selectedItem.status] || statusVariant.success).className}`}>
                      {(statusVariant[selectedItem.status] || statusVariant.success).label}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${(severityVariant[selectedItem.severity] || severityVariant.info).className}`}>
                      {(severityVariant[selectedItem.severity] || severityVariant.info).label}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">تاريخ الحدوث</p>
                  <p className="text-sm font-medium">{formatDateTime(selectedItem.occurred_at)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">مسار الطلب</p>
                  <p className="text-sm font-medium font-mono text-xs break-all">
                    {selectedItem.method} {selectedItem.route || selectedItem.url || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">عنوان IP</p>
                  <p className="text-sm font-medium font-mono">{selectedItem.ip_address || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الجهاز / المنصة / المتصفح</p>
                  <p className="text-sm font-medium">
                    [{[selectedItem.device, selectedItem.platform, selectedItem.browser].filter(Boolean).join(" • ") || "—"}]
                  </p>
                </div>
              </div>

              {(selectedItem.old_values && Object.keys(selectedItem.old_values).length > 0) && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">القيم القديمة</p>
                  <pre className="rounded-lg bg-muted/30 p-3 text-xs overflow-x-auto whitespace-pre-wrap">
                    {prettyJson(selectedItem.old_values)}
                  </pre>
                </div>
              )}

              {(selectedItem.new_values && Object.keys(selectedItem.new_values).length > 0) && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">القيم الجديدة</p>
                  <pre className="rounded-lg bg-muted/30 p-3 text-xs overflow-x-auto whitespace-pre-wrap">
                    {prettyJson(selectedItem.new_values)}
                  </pre>
                </div>
              )}

              {(selectedItem.changed_fields && selectedItem.changed_fields.length > 0) && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">الحقول المتغيرة</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.changed_fields.map((field) => (
                      <span key={field} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.metadata && Object.keys(selectedItem.metadata).length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">بيانات إضافية</p>
                  <pre className="overflow-x-auto bg-muted/30 p-3 text-xs whitespace-pre-wrap">
                    {prettyJson(selectedItem.metadata)}
                  </pre>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  النشاطات المرتبطة ({relatedItems.length})
                </p>
                {relatedItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">لا توجد نشاطات مرتبطة</p>
                ) : (
                  <div className="max-h-56 overflow-y-auto rounded-md border">
                    <Table>
                      <TableBody>
                        {relatedItems
                          .filter((rel) => rel.id !== selectedItem.id)
                          .map((rel) => (
                            <TableRow key={rel.id} className="cursor-pointer" onClick={() => setDetailsId(rel.id)}>
                              <TableCell className="text-xs">{getModuleLabel(rel.module)}</TableCell>
                              <TableCell className="text-xs">{getActionLabel(rel.action)}</TableCell>
                              <TableCell className="text-xs">{rel.user_name || "—"}</TableCell>
                              <TableCell className="text-xs">{formatDateTime(rel.occurred_at)}</TableCell>
                            </TableRow>
                          ))}
                        {relatedItems.filter((rel) => rel.id !== selectedItem.id).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="h-12 text-center text-muted-foreground">
                              لا توجد نشاطات مرتبطة
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">لم يتم العثور على البيانات</div>
          )}

          <div className="flex justify-end border-t border-border pt-4 mt-2">
            <DialogClose asChild>
              <Button variant="outline">إغلاق</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogsPage;