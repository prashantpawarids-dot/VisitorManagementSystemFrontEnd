import { cn } from "@/lib/utils";

type Status =
  | "pending"
  | "approved"
  | "rejected"
  | "checked-in"
  | "checked-out"
  | "expired"
  | "info"
  | "success"
  | "warning"
  | "danger";

const styles: Record<Status, string> = {
  pending: "bg-warning/15 text-warning-foreground border border-warning/30",
  approved: "bg-success/15 text-success border border-success/30",
  rejected: "bg-destructive/15 text-destructive border border-destructive/30",
  "checked-in": "bg-info/15 text-info border border-info/30",
  "checked-out": "bg-muted text-muted-foreground border border-border",
  expired: "bg-destructive/10 text-destructive border border-destructive/30",
  info: "bg-info/15 text-info border border-info/30",
  success: "bg-success/15 text-success border border-success/30",
  warning: "bg-warning/15 text-warning-foreground border border-warning/30",
  danger: "bg-destructive/15 text-destructive border border-destructive/30",
};

export function StatusBadge({
  status,
  children,
  className,
}: {
  status: Status;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        styles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
