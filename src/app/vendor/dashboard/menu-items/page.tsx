import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Menu items",
};

export default function VendorMenuItemsPage() {
  return (
    <PagePlaceholder
      title="Menu items"
      description="Manage availability, pricing, and categories for this vendor's menu."
    />
  );
}
