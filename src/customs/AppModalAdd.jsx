import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * AppModalAdd Component
 *
 * A reusable modal dialog component tailored for add/create operations,
 * styled to match Shadcn UI design patterns.
 * Supports loading states, custom triggers, responsive sizes, dynamic validation messages,
 * and prevent-close options.
 */
const AppModalAdd = ({
  // Control state
  open,
  onOpenChange,
  defaultOpen = false,
  trigger,

  // Content configuration
  title,
  description,
  children,

  // Action/Submission callbacks
  onSubmit,
  onCancel,
  submitText = "حفظ",
  cancelText = "إلغاء",
  submitVariant = "default",
  cancelVariant = "outline",

  // Loading & Disabled states
  isLoading = false,
  isDisabled = false,

  // Error feedback (validation & API)
  error,

  // Styling & Layout
  size = "lg",
  className,
  formClassName,

  // Behavior controls
  preventCloseOnOverlayClick = false,
  preventCloseOnEscape = false,
  showCloseButton = true,
  footer,
}) => {
  // Uncontrolled fallback state
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (val) => {
    // If loading, prevent closing the modal via default Radix interactions
    if (isLoading && !val) return;

    if (!isControlled) {
      setInternalOpen(val);
    }
    if (onOpenChange) {
      onOpenChange(val);
    }
  };

  // Size mapping classes for responsive layouts
  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-2xl max-h-[90vh] overflow-y-auto",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl max-h-[90vh] overflow-y-auto",
    "3xl": "sm:max-w-3xl",
    "4xl": "sm:max-w-4xl",
    "5xl": "sm:max-w-5xl",
    full: "sm:max-w-[95vw] sm:max-h-[95vh] flex flex-col justify-between",
  };

  // Wrapper tag depends on whether an onSubmit function is provided
  const ContentWrapper = onSubmit ? "form" : "div";
  const wrapperProps = onSubmit
    ? {
        onSubmit: (e) => {
          e.preventDefault();
          if (!isLoading && !isDisabled) {
            onSubmit(e);
          }
        },
        className: cn("flex flex-col h-full gap-4", formClassName),
      }
    : {
        className: cn("flex flex-col h-full gap-4", formClassName),
      };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        onPointerDownOutside={(e) => {
          if (preventCloseOnOverlayClick || isLoading) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (preventCloseOnEscape || isLoading) {
            e.preventDefault();
          }
        }}
        showCloseButton={showCloseButton && !isLoading}
        className={cn(
          "overflow-hidden p-6",
          sizeClasses[size] || sizeClasses.lg,
          className
        )}
      >
        <ContentWrapper {...wrapperProps}>
          {/* Header Section */}
          {(title || description) && (
            <DialogHeader className="text-start space-y-1.5 border-b border-border pb-4">
              {title && (
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription className="text-sm text-muted-foreground">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          )}

          {/* Body Content with custom scrolling */}
          <div className="flex-1 overflow-y-auto pr-1 py-1 space-y-4 max-h-[60vh] scrollbar-thin">
            {/* Global/Validation Error Callout */}
            {error && (
              <div
                dir="rtl"
                className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive dark:border-destructive/30 dark:bg-destructive/15 animate-in fade-in-50 duration-200"
              >
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                <div className="flex-1 leading-relaxed">
                  {typeof error === "string" ? (
                    <p className="font-semibold text-sm">{error}</p>
                  ) : Array.isArray(error) ? (
                    <ul className="list-inside list-disc space-y-1 font-semibold text-sm">
                      {error.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  ) : typeof error === "object" ? (
                    <div className="space-y-1">
                      {Object.entries(error).map(([key, val]) => (
                        <p key={key} className="text-xs font-semibold">
                          <strong>{key}:</strong> {String(val)}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* Custom Input Fields / Children */}
            <div className="space-y-4">{children}</div>
          </div>

          {/* Footer Section */}
          {footer ? (
            <div className="border-t border-border pt-4 mt-2">{footer}</div>
          ) : (
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end border-t border-border pt-4 mt-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant={cancelVariant}
                  disabled={isLoading}
                  onClick={onCancel}
                  className="w-full sm:w-auto"
                >
                  {cancelText}
                </Button>
              </DialogClose>
              <Button
                type={onSubmit ? "submit" : "button"}
                variant={submitVariant}
                disabled={isLoading || isDisabled}
                onClick={onSubmit ? undefined : onSubmit}
                className="w-full sm:w-auto min-w-20"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
                {submitText}
              </Button>
            </DialogFooter>
          )}
        </ContentWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default AppModalAdd;
