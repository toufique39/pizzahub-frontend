import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "All menu items",
};

export default function AdminMenuItemsPage() {
  return (
    <PagePlaceholder
      title="All menu items"
      description="Cross-vendor menu moderation will be implemented in features/menu."
    />
  );
}
