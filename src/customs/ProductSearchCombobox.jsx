import React from "react";
import { Check, ChevronsUpDown, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchProducts } from "@/hooks/Actions/Product/useSearchProducts";

const ProductSearchCombobox = ({
  value,
  onSelect,
  placeholder = "اختر المنتج",
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const { products, isPending, isFetching } = useSearchProducts(
    search,
    open,
  );

  const selectedProduct = products.find(
    (p) => String(p.id) === String(value),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          {selectedProduct?.name || placeholder}
          <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="ابحث عن منتج..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isFetching && (
              <CommandLoading />
            )}
            {!isFetching && !isPending && products.length === 0 && (
              <CommandEmpty>لا توجد منتجات</CommandEmpty>
            )}
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={String(product.id)}
                  onSelect={() => {
                    onSelect?.(product);
                    setSearch("");
                    setOpen(false);
                  }}
                >
                  <Package className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1">{product.name}</span>
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === String(product.id)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProductSearchCombobox;
