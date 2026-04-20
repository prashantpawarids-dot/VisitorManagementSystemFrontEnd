import idsLogo from "@/assets/ids-logo.jpeg";
import { cn } from "@/lib/utils";
import { config } from "@/lib/config";

export function BrandLogo({
  size = "md",
  showText = true,
  textTone = "default",
  className,
}: {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  textTone?: "default" | "light";
  className?: string;
}) {
  const sizes = {
    sm: { img: "h-8 w-8", title: "text-sm", sub: "text-[10px]" },
    md: { img: "h-10 w-10", title: "text-base", sub: "text-[11px]" },
    lg: { img: "h-14 w-14", title: "text-xl", sub: "text-xs" },
  } as const;
  const s = sizes[size];
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={idsLogo}
        alt="IDS Smarttech"
        className={cn(s.img, "rounded-xl object-cover ring-1 ring-border/60 shadow-sm")}
      />
      {showText && (
        <div className="min-w-0 leading-tight">
          <p
            className={cn(
              "font-semibold tracking-tight truncate",
              s.title,
              textTone === "light" ? "text-white" : "text-foreground",
            )}
          >
            {config.appName}
          </p>
          <p
            className={cn(
              "uppercase tracking-wider truncate",
              s.sub,
              textTone === "light" ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {config.companyName}
          </p>
        </div>
      )}
    </div>
  );
}
