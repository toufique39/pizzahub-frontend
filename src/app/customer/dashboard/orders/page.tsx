import type { Metadata } from "next";

import CustomerOrders from "@/features/orders/components/customer-orders";

export const metadata: Metadata = {
  title: "My orders",
};

export default function CustomerOrdersPage() {
  return <CustomerOrders />;
}
