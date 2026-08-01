import { cn } from "@/lib/utils";

const SectionTitle = ({ title, icon: Icon, subtitle, className }) => (
  <div
    className={cn(
      "mb-4 flex flex-wrap items-center justify-between gap-2",
      className
    )}
  >
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-5 w-5 text-foreground" />}
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
    </div>
    {subtitle && (
      <span className="text-xs text-muted-foreground">{subtitle}</span>
    )}
  </div>
);

export default SectionTitle;
