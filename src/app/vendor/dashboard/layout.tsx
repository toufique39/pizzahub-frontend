import { requireRole } from "@/lib/server-auth";
import VendorDashboardShell from "@/components/layout/vendor-dashboard-shell";

export const instant = false;

export default async function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("vendor");

  return <VendorDashboardShell>{children}</VendorDashboardShell>;
}
