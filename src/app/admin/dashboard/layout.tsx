import {
  DashboardSidebar,
  type DashboardNavItem,
} from "@/components/layout/dashboard-sidebar";
import { ROUTES } from "@/constants";

const navItems: DashboardNavItem[] = [
  { href: ROUTES.admin.dashboard, label: "Overview" },
  { href: ROUTES.admin.users, label: "Users" },
  { href: ROUTES.admin.menuItems, label: "Menu items" },
  { href: ROUTES.admin.transactions, label: "Transactions" },
];

export default function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin/dashboard">) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:flex-row md:gap-10">
      <DashboardSidebar title="Admin" items={navItems} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
