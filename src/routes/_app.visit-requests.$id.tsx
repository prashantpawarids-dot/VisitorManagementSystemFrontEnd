import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";

export const Route = createFileRoute("/_app/visit-requests/$id")({
  component: () => (
    <ComingSoonPage title="Visit request details" description="Full visitor profile, status, and actions." />
  ),
});
