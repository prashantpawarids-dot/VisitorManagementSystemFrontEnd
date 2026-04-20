import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

const tones: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "from-primary/15 to-primary/0 text-primary",
  success: "from-success/15 to-success/0 text-success",
  warning: "from-warning/20 to-warning/0 text-warning-foreground",
  danger: "from-destructive/15 to-destructive/0 text-destructive",
  info: "from-info/15 to-info/0 text-info",
  neutral: "from-muted to-transparent text-muted-foreground",
};

export function StatCard({ label, value, icon: Icon, trend, tone = "primary", className }: StatCardProps) {
  return (
    <Card className={cn("border-border/60 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elevated)]", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
            {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
          </div>
          {Icon && (
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br", tones[tone])}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
