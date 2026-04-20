import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/services/api/client";
import { useAuth } from "@/app/providers/AuthProvider";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LogIn, LogOut, Activity, AlertCircle, ScanLine } from "lucide-react";

export const Route = createFileRoute("/_app/security/dashboard")({
  component: SecurityDashboard,
});

interface SecurityDashboardData {
  approvedReady?: number;
  checkedInToday?: number;
  checkedOutToday?: number;
  insideVisitors?: number;
  [k: string]: unknown;
}

function SecurityDashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["security", "dashboard"],
    queryFn: async () => {
      const res = await apiClient.get<SecurityDashboardData>("/api/Security/dashboard");
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader
        title={`Gate console — ${user?.fullName ?? "Security"}`}
        description="Scan visitor passes for entry and exit."
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/security/check-out">
                <LogOut className="mr-1 h-4 w-4" /> Scan exit
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-[var(--primary-glow)]">
              <Link to="/security/check-in">
                <ScanLine className="mr-1 h-4 w-4" /> Scan entry
              </Link>
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <Loader label="Loading…" />
      ) : error ? (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-destructive">Couldn't load dashboard</p>
            <p className="mt-1 text-xs text-destructive/80">{getErrorMessage(error)}</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Approved & ready" value={data?.approvedReady ?? 0} icon={CheckCircle2} tone="success" />
          <StatCard label="Checked in today" value={data?.checkedInToday ?? 0} icon={LogIn} tone="info" />
          <StatCard label="Checked out today" value={data?.checkedOutToday ?? 0} icon={LogOut} tone="neutral" />
          <StatCard label="Inside now" value={data?.insideVisitors ?? 0} icon={Activity} tone="primary" />
        </div>
      )}
    </div>
  );
}
