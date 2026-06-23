const InfoCard = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
    <div
      className={`shrink-0 rounded-lg p-2 ${
        accent
          ? "bg-primary/10 text-primary"
          : "bg-neutral-100 text-neutral-500"
      }`}
    >
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0 flex-1" dir="rtl">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
        {value || "—"}
      </p>
    </div>
  </div>
);

export default InfoCard;
