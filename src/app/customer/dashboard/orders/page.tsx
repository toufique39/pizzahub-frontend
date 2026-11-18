import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "My orders",
};

export default function CustomerOrdersPage() {
  return (
    <PagePlaceholder
      title="My orders"
      description="Order history and live tracking will be implemented in features/orders."
    />
  );
}
