import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/services/api/client";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Loader } from "@/components/common/Loader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  CalendarCheck,
  Inbox,
  CheckCircle2,
  XCircle,
  LogIn,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";

export const Route = createFileRoute("/_app/admin/dashboard")({
  component: AdminDashboard,
});

interface AdminDashboardData {
  totalVisitors?: number;
  todayVisitors?: number;
  pendingRequests?: number;
  approvedRequests?: number;
  rejectedRequests?: number;
  checkedIn?: number;
  checkedOut?: number;
  [k: string]: unknown;
}

function AdminDashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await apiClient.get<AdminDashboardData>("/api/Admin/dashboard");
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.fullName?.split(" ")[0] ?? "Admin"}`}
        description="Real-time overview of visitors, approvals, and gate activity."
      />

      {isLoading ? (
        <Loader label="Loading dashboard…" />
      ) : error ? (
        <ErrorBanner message={getErrorMessage(error)} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total visitors" value={data?.totalVisitors ?? 0} icon={Users} tone="primary" />
            <StatCard label="Today" value={data?.todayVisitors ?? 0} icon={CalendarCheck} tone="info" />
            <StatCard label="Pending" value={data?.pendingRequests ?? 0} icon={Inbox} tone="warning" />
            <StatCard label="Approved" value={data?.approvedRequests ?? 0} icon={CheckCircle2} tone="success" />
            <StatCard label="Rejected" value={data?.rejectedRequests ?? 0} icon={XCircle} tone="danger" />
            <StatCard label="Checked in" value={data?.checkedIn ?? 0} icon={LogIn} tone="info" />
            <StatCard label="Checked out" value={data?.checkedOut ?? 0} icon={LogOut} tone="neutral" />
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Card className="border-border/60 shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  System summary
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Visit requests, approvals, and gate scans are streaming live from your IDS server.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick actions
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>• Review pending visit requests</li>
                  <li>• Manage users and roles</li>
                  <li>• Export daily summary report</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
      <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
      <div>
        <p className="text-sm font-semibold text-destructive">Couldn't load dashboard</p>
        <p className="mt-1 text-xs text-destructive/80">{message}</p>
      </div>
    </div>
  );
}
