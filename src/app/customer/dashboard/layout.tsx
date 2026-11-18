import {
  DashboardSidebar,
  type DashboardNavItem,
} from "@/components/layout/dashboard-sidebar";
import { ROUTES } from "@/constants";

const navItems: DashboardNavItem[] = [
  { href: ROUTES.customer.dashboard, label: "Overview" },
  { href: ROUTES.customer.orders, label: "My orders" },
  { href: ROUTES.profileSettings, label: "Profile settings" },
];

export default function CustomerDashboardLayout({
  children,
}: LayoutProps<"/customer/dashboard">) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:flex-row md:gap-10">
      <DashboardSidebar title="Customer" items={navItems} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
