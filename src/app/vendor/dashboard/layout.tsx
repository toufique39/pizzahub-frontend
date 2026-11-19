import { requireRole } from "@/lib/server-auth";

export default async function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("vendor");

  return <>{children}</>;
}