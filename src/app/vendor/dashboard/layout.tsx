import { requireRole } from "@/lib/server-auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import VendorDashboardShell from "@/components/layout/vendor-dashboard-shell";

export const instant = false;

const vendorNavItems = [
  { href: "/vendor/dashboard", label: "Overview" },
  { href: "/vendor/dashboard/menu-items", label: "My Menu Items" },
  { href: "/vendor/dashboard/add-menu-item", label: "Add Menu Item" },
  { href: "/vendor/dashboard/orders", label: "Orders" },
  { href: "/vendor/dashboard/subscription", label: "Subscription" },
];

export default async function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("vendor");

  return (
        <VendorDashboardShell>
      {children}
        </VendorDashboardShell>

  );
}
