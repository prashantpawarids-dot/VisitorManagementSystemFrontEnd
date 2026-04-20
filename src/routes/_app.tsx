import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";

export const Route = createFileRoute("/_app")({
  component: () => <DashboardLayout />,
});

// Outlet is rendered inside DashboardLayout; this re-export keeps tree-shaker happy
export { Outlet };
