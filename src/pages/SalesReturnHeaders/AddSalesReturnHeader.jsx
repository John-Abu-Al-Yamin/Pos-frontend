import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";

import AddEditHeader from "@/customs/AddEditHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useGetAllSalesHeaders } from "@/hooks/Actions/SalesHeaders/useCurdsSalesHeaders";
import { useAddSalesReturnHeaders } from "@/hooks/Actions/SalesReturnHeader/useCurdsSalesReturnHeaders";
import { salesReturnHeadersSchema } from "@/validation/salesReturnHeaders/salesReturnHeaders";

const AddSalesReturnHeader = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("sales_header_id");

  const [open, setOpen] = useState(false);
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(invoiceSearch);
    }, 400);
    return () => clearTimeout(timer);
  }, [invoiceSearch]);

  const { data: salesData } = useGetAllSalesHeaders(1, 100, { search: debouncedSearch || undefined });
  const { mutate: addMutate, isPending } = useAddSalesReturnHeaders();

  const salesHeaders = salesData?.data?.data ?? [];

  const form = useForm({
    resolver: zodResolver(salesReturnHeadersSchema),
    defaultValues: {
      sales_header_id: preselectedId || "",
      reason: "",
      return_date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (formData) => {
    addMutate(
      {
        data: {
          sales_header_id: Number(formData.sales_header_id),
          reason: formData.reason || undefined,
          return_date: formData.return_date || undefined,
        },
      },
      {
        onSuccess: (response) => {
          const returnId = response?.data?.data?.id;
          if (returnId) {
            navigate(`/sales-returns/details/${returnId}`);
          } else {
            navigate("/sales-returns");
          }
        },
      },
    );
  };

  return (
    <div>
      <AddEditHeader
        title="إنشاء مرتجع بيع"
        description="اختر فاتورة البيع المراد إرجاعها"
        backPath="/sales-headers"
        backText="رجوع"
      />

      <div className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="sales_header_id">فاتورة البيع</Label>
              <Controller
                name="sales_header_id"
                control={form.control}
                render={({ field }) => (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {field.value
                          ? salesHeaders.find((s) => String(s.id) === field.value)
                              ?.invoice_number
                          : "اختر فاتورة البيع"}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput
                          placeholder="بحث برقم الفاتورة أو اسم العميل..."
                          value={invoiceSearch}
                          onValueChange={setInvoiceSearch}
                        />
                        <CommandList>
                          <CommandEmpty>لا توجد نتائج</CommandEmpty>
                          <CommandGroup>
                            {salesHeaders.map((sale) => (
                              <CommandItem
                                key={sale.id}
                                value={`${sale.invoice_number} ${sale.customer?.name || ""}`}
                                onSelect={() => {
                                  field.onChange(String(sale.id));
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    field.value === String(sale.id)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{sale.invoice_number}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {sale.customer?.name || "—"} — {sale.total_amount}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {form.formState.errors.sales_header_id && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.sales_header_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="return_date">تاريخ الإرجاع</Label>
              <Input
                id="return_date"
                type="date"
                {...form.register("return_date")}
              />
              {form.formState.errors.return_date && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.return_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">سبب الإرجاع</Label>
            <Textarea id="reason" rows={4} {...form.register("reason")} />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/sales-headers")}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalesReturnHeader;
