import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth, getDefaultRouteForRole } from "@/app/providers/AuthProvider";
import { Loader } from "@/components/common/Loader";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardRedirect,
});

function DashboardRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate({ to: getDefaultRouteForRole(user.roles) });
  }, [user, navigate]);
  return <Loader label="Loading your dashboard…" />;
}
