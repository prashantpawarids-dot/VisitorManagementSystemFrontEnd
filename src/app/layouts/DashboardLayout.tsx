import { Link, useLocation, useNavigate, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { getNavForRoles } from "./nav-config";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login", search: { redirect: location.pathname } as never });
    }
  }, [user, isLoading, navigate, location.pathname]);

  // close mobile drawer on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const groups = getNavForRoles(user.roles);
  const primaryRole = user.roles[0] ?? "USER";

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-5 pb-4 border-b border-border/60">
        <BrandLogo size="md" />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = location.pathname === item.to;
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", active ? "" : "text-muted-foreground group-hover:text-foreground")} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-border/60 p-3">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[var(--primary-glow)] text-primary-foreground text-sm font-semibold">
            {user.fullName?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{user.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--gradient-subtle)]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border/60 bg-card lg:block">
        {SidebarContent}
      </aside>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-card/80 px-4 backdrop-blur sm:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              {SidebarContent}
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 lg:hidden">
            <BrandLogo size="sm" showText={false} />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-foreground sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              {primaryRole}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-transparent px-1 py-1 transition-colors hover:border-border hover:bg-muted">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[var(--primary-glow)] text-xs font-semibold text-primary-foreground">
                    {user.fullName?.[0]?.toUpperCase() ?? "U"}
                  </span>
                  <span className="hidden text-sm font-medium text-foreground sm:inline">{user.fullName}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-semibold">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
