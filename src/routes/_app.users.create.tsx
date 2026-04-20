import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";

export const Route = createFileRoute("/_app/users/create")({
  component: () => <ComingSoonPage title="Create user" description="Add a new Admin, Host, or Security user." />,
});
