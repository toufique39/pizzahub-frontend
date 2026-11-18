import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Users",
};

export default function AdminUsersPage() {
  return (
    <PagePlaceholder
      title="Users"
      description="Customer, vendor, and admin accounts will be managed here."
    />
  );
}
