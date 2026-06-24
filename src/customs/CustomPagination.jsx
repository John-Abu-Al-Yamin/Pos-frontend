import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CustomPagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.last_page <= 1) return null;

  const { current_page, last_page, total, from, to } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const rangeStart = Math.max(2, current_page - delta);
    const rangeEnd = Math.min(last_page - 1, current_page + delta);

    pages.push(1);

    if (rangeStart > 2) {
      pages.push("...");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < last_page - 1) {
      pages.push("...");
    }

    if (last_page > 1) {
      pages.push(last_page);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      <div className="text-sm text-muted-foreground">
        عرض {from} إلى {to} من {total} نتيجة
      </div>

      <div className="flex items-center gap-1" dir="ltr">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={current_page === 1}
          onClick={() => onPageChange(current_page - 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-sm text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={current_page === page ? "default" : "outline"}
              size="icon-sm"
              className={cn(
                current_page === page && "pointer-events-none"
              )}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon-sm"
          disabled={current_page === last_page}
          onClick={() => onPageChange(current_page + 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CustomPagination;
