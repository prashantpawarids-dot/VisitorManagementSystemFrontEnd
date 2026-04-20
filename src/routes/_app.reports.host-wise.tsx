import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";

export const Route = createFileRoute("/_app/reports/host-wise")({
  component: () => <ComingSoonPage title="Host wise report" description="Visit volumes grouped by host." />,
});
