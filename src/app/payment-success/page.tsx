import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Payment successful",
};

export default function PaymentSuccessPage() {
  return (
    <PagePlaceholder
      title="Payment successful"
      description="Stripe redirects here after a completed checkout. Confirm the session and link back to the dashboard."
    />
  );
}
