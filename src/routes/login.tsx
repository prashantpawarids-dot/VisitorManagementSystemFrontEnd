import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/api/auth";
import { useAuth, getDefaultRouteForRole } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { BrandLogo } from "@/components/common/BrandLogo";
import { getErrorMessage } from "@/services/api/client";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "",
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const dest = search.redirect || getDefaultRouteForRole(user.roles);
    navigate({ to: dest as never, replace: true });
  }, [isAuthenticated, navigate, search.redirect, user]);

  const mutation = useMutation({
    mutationFn: () => authApi.login({ username: username.trim(), password }),
    onSuccess: (data) => {
      login(data);
      toast.success(`Welcome back, ${data.fullName}`);
      const dest = search.redirect || getDefaultRouteForRole(data.roles);
      navigate({ to: dest as never, replace: true });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Please enter username and password");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 -z-10 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white 0, transparent 30%)" }} />
        <BrandLogo size="lg" textTone="light" />
        <div className="relative">
          <h2 className="max-w-md text-3xl font-semibold leading-tight text-white">
            Secure, modern visitor management for the way you work today.
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/70">
            Approve visits, scan QR passes, and track every entry — all from one elegant dashboard.
          </p>
        </div>
        <p className="text-xs text-white/60">© {new Date().getFullYear()} IDSID PVT LTD</p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-[var(--gradient-subtle)] p-6 sm:p-10">
        <Card className="w-full max-w-md border-border/60 shadow-[var(--shadow-elevated)]">
          <CardContent className="p-6 sm:p-8">
            <div className="lg:hidden mb-6 flex justify-center">
              <BrandLogo size="md" />
            </div>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> Staff sign in
              </span>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to your account to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={mutation.isPending}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-gradient-to-r from-primary to-[var(--primary-glow)] shadow-[var(--shadow-glow)]"
                size="lg"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6 border-t border-border/60 pt-4 text-center text-sm text-muted-foreground">
              Visiting someone?{" "}
              <Link to="/visitor/request" className="font-medium text-primary hover:underline">
                Submit a visitor request
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
