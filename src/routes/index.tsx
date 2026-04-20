import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth, getDefaultRouteForRole } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ShieldCheck, ScanLine, ClipboardList, ArrowRight, LogOut, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { user, logout } = useAuth();
  const dashboardPath = user ? getDefaultRouteForRole(user.roles) : "/login";

  return (
    <div className="min-h-screen bg-[var(--gradient-subtle)]">
      <header className="border-b border-border/60 bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandLogo size="md" />
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to={dashboardPath}>
                    <LayoutDashboard className="mr-1 h-4 w-4" /> Go to dashboard
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="mr-1 h-4 w-4" /> Sign out
                </Button>
              </>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link to="/login" search={{ redirect: "" }}>Sign in</Link>
              </Button>
            )}
            <Button asChild size="sm" className="bg-gradient-to-r from-primary to-[var(--primary-glow)]">
              <Link to="/visitor/request">
                Request visit <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, var(--primary) 0, transparent 40%), radial-gradient(circle at 80% 30%, var(--accent) 0, transparent 40%)" }} />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Enterprise Visitor Management — by IDSID PVT LTD
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Modern access control for <span className="bg-gradient-to-r from-primary to-[var(--primary-glow)] bg-clip-text text-transparent">townships & offices</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Frictionless visitor requests, host approvals, and gate scanning. Built for security teams,
            residents, and administrators.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-[var(--primary-glow)] shadow-[var(--shadow-glow)]">
              <Link to="/visitor/request">
                Request a visit <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login" search={{ redirect: "" }}>Staff sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: ClipboardList, title: "Public visitor form", desc: "Visitors submit a clean request — no login needed." },
            { icon: ShieldCheck, title: "Host approvals", desc: "Residents approve, reject, or request resubmission." },
            { icon: ScanLine, title: "QR gate scanning", desc: "Security checks visitors in and out with one scan." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-transparent text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} IDSID PVT LTD. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
