import { requireRole } from "@/lib/server-auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const instant = false;

const adminNavItems = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/dashboard/menu-items", label: "Menu Items" },
  { href: "/admin/dashboard/users", label: "Users" },
  { href: "/admin/dashboard/transactions", label: "Transactions" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");

  return (
    <DashboardShell title="Admin Console" items={adminNavItems}>
      {children}
    </DashboardShell>
  );
}
