import { requireRole } from "@/lib/server-auth";

// Allow this private route to block during authentication.
export const instant = false;

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("customer");

  return <>{children}</>;
}