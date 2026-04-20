import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";

export const Route = createFileRoute("/_app/reports/gate-wise")({
  component: () => <ComingSoonPage title="Gate wise report" description="Activity grouped by entry gate." />,
});
