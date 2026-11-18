import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default function AdminDashboardPage() {
  return (
    <PagePlaceholder
      title="Admin dashboard"
      description="Platform stats (users, vendors, orders, revenue) will live in features/admin."
    />
  );
}
