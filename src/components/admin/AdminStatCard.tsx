import { AppIcon, type IconName } from "@/components/icons";

export function AdminStatCard({
  label,
  value,
  sub,
  icon,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: IconName;
  accent?: "primary" | "secondary" | "destructive";
}) {
  const accentClass =
    accent === "secondary"
      ? "text-secondary border-secondary/30 bg-secondary/10"
      : accent === "destructive"
        ? "text-destructive border-destructive/30 bg-destructive/10"
        : "text-primary border-primary/30 bg-primary/10";

  return (
    <div className="footer-glass rounded-2xl border border-border p-5 transition-all hover:border-primary/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-headline text-3xl font-extrabold text-foreground">
            {value}
          </p>
          {sub ? (
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
          ) : null}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${accentClass}`}
        >
          <AppIcon name={icon} size="lg" active />
        </div>
      </div>
    </div>
  );
}

