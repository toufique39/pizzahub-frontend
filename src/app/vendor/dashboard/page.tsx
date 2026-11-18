import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Vendor dashboard",
};

export default function VendorDashboardPage() {
  return (
    <PagePlaceholder
      title="Vendor dashboard"
      description="Sales, orders, and menu performance will live in features/vendors."
    />
  );
}
