import { requireRole } from "@/lib/server-auth";
export const instant = false;
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");

  return <>{children}</>;
}