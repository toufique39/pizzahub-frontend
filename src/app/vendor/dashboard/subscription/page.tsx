import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Subscription",
};

export default function VendorSubscriptionPage() {
  return (
    <PagePlaceholder
      title="Subscription"
      description="Plan selection and Stripe checkout will be implemented in features/subscriptions."
    />
  );
}
