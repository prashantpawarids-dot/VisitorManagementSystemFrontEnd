import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";

export const Route = createFileRoute("/_app/security/qr-validate")({
  component: () => (
    <ComingSoonPage title="QR validate" description="Quickly verify a visitor pass without checking in." />
  ),
});
