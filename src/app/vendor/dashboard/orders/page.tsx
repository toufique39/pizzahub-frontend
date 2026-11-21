import type { Metadata } from "next";

import VendorOrders from "@/features/orders/components/vendor-orders";

export const metadata: Metadata = {
  title: "Vendor orders",
};

export default function VendorOrdersPage() {
  return <VendorOrders />;
}
