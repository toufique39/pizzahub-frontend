import { requireRole } from "@/lib/server-auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";

// Allow this private route to block during authentication.
export const instant = false;

const customerNavItems = [
  { href: "/customer/dashboard", label: "Overview" },
  { href: "/customer/dashboard/orders", label: "My Orders" },
];

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("customer");

  return (
    <DashboardShell title="Customer Portal" items={customerNavItems}>
      {children}
    </DashboardShell>
  );
}
