import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Transactions",
};

export default function AdminTransactionsPage() {
  return (
    <PagePlaceholder
      title="Transactions"
      description="Payment history and payouts will be implemented in features/admin."
    />
  );
}
