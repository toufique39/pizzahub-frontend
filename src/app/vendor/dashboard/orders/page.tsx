import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Vendor orders",
};

export default function VendorOrdersPage() {
  return (
    <PagePlaceholder
      title="Vendor orders"
      description="Incoming orders and status transitions will be implemented in features/orders."
    />
  );
}
