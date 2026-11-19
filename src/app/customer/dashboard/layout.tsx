import { requireRole } from "@/lib/server-auth";


export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("customer");

  return <>{children}</>;
}