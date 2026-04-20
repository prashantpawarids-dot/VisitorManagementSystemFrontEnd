import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Construction } from "lucide-react";

export function ComingSoonPage({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={Construction}
        title="This module is coming next"
        description="This page is part of the next build phase. The layout, auth, and API plumbing are all wired and ready."
      />
    </div>
  );
}
