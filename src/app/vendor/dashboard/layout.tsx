import {
  DashboardSidebar,
  type DashboardNavItem,
} from "@/components/layout/dashboard-sidebar";
import { ROUTES } from "@/constants";

const navItems: DashboardNavItem[] = [
  { href: ROUTES.vendor.dashboard, label: "Overview" },
  { href: ROUTES.vendor.menuItems, label: "Menu items" },
  { href: ROUTES.vendor.addMenuItem, label: "Add menu item" },
  { href: ROUTES.vendor.orders, label: "Orders" },
  { href: ROUTES.vendor.subscription, label: "Subscription" },
];

export default function VendorDashboardLayout({
  children,
}: LayoutProps<"/vendor/dashboard">) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:flex-row md:gap-10">
      <DashboardSidebar title="Vendor" items={navItems} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
