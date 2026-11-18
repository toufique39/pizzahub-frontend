import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Payment cancelled",
};

export default function PaymentCancelPage() {
  return (
    <PagePlaceholder
      title="Payment cancelled"
      description="Stripe redirects here when checkout is abandoned. Offer a retry path back to the subscription page."
    />
  );
}
