import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/services/api/client";
import { useAuth } from "@/app/providers/AuthProvider";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Loader } from "@/components/common/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, CheckCircle2, XCircle, Users, AlertCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/host/dashboard")({
  component: HostDashboard,
});

interface HostDashboardData {
  pendingRequests?: number;
  approvedToday?: number;
  rejectedToday?: number;
  totalVisitors?: number;
  [k: string]: unknown;
}

function HostDashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["host", "dashboard"],
    queryFn: async () => {
      const res = await apiClient.get<HostDashboardData>("/api/Host/dashboard");
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader
        title={`Hello, ${user?.fullName?.split(" ")[0] ?? "Host"}`}
        description="Approve visitor requests for your residence."
        actions={
          <Button asChild className="bg-gradient-to-r from-primary to-[var(--primary-glow)]">
            <Link to="/visit-requests/pending">
              View pending <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <Loader label="Loading dashboard…" />
      ) : error ? (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-destructive">Couldn't load dashboard</p>
            <p className="mt-1 text-xs text-destructive/80">{getErrorMessage(error)}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Pending requests" value={data?.pendingRequests ?? 0} icon={Inbox} tone="warning" />
            <StatCard label="Approved today" value={data?.approvedToday ?? 0} icon={CheckCircle2} tone="success" />
            <StatCard label="Rejected today" value={data?.rejectedToday ?? 0} icon={XCircle} tone="danger" />
            <StatCard label="Total visitors" value={data?.totalVisitors ?? 0} icon={Users} tone="primary" />
          </div>

          <Card className="mt-8 border-border/60 shadow-[var(--shadow-card)]">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Tip
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Open the <strong className="text-foreground">Pending</strong> tab to approve, reject,
                or ask a visitor to resubmit their request.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
