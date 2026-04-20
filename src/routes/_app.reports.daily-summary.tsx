import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";

export const Route = createFileRoute("/_app/reports/daily-summary")({
  component: () => <ComingSoonPage title="Daily summary" description="Visitors per day across all gates." />,
});
