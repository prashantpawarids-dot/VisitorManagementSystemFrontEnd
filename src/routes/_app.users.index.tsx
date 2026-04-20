import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";

export const Route = createFileRoute("/_app/users/")({
  component: () => (
    <ComingSoonPage title="Users" description="Manage staff accounts (Admin, Host, Security)." />
  ),
});
