import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";

export const Route = createFileRoute("/_app/tracking/live-inside")({
  component: () => (
    <ComingSoonPage title="Live inside" description="Currently checked-in visitors across all gates." />
  ),
});
