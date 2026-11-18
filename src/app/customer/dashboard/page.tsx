import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Customer dashboard",
};

export default function CustomerDashboardPage() {
  return (
    <PagePlaceholder
      title="Customer dashboard"
      description="Recent orders, favourites, and delivery status will live in features/customers."
    />
  );
}
