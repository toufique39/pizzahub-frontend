
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Pizza,
  PlusCircle,
  ShoppingBag,
  Crown,
  UserRound,
  LogOut,
  Menu,
  X,
  ChefHat,
} from "lucide-react";

import { signOut } from "@/lib/auth-client";

const navigation = [
  {
    label: "Overview",
    href: "/vendor/dashboard",
    icon: Home,
  },
  {
    label: "My Menu Items",
    href: "/vendor/dashboard/menu-items",
    icon: Pizza,
  },
  {
    label: "Add Menu Item",
    href: "/vendor/dashboard/add-menu-item",
    icon: PlusCircle,
  },
  {
    label: "Customer Orders",
    href: "/vendor/dashboard#customer-orders",
    icon: ShoppingBag,
  },
  {
    label: "Subscription",
    href: "/vendor/dashboard/subscription",
    icon: Crown,
  },
  {
    label: "Profile Settings",
    href: "/profile-settings",
    icon: UserRound,
  },
];

export default function VendorDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      router.replace("/sign-in");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const sidebarContent = (
    <>
      <Link
        href="/vendor/dashboard"
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-3 border-b border-white/10 px-6 py-6"
      >
        <div className="rounded-xl bg-orange-500 p-2">
          <ChefHat className="h-6 w-6 text-white" />
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-white">PizzaHub</h1>
          <p className="text-xs text-orange-300">Vendor Panel</p>
        </div>
      </Link>

      <div className="px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Main Menu
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const itemPath = item.href.split("#")[0];

            const isActive =
              !item.href.includes("#") &&
              (pathname === itemPath ||
                (itemPath !== "/vendor/dashboard" &&
                  pathname.startsWith(`${itemPath}/`)));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-white/10 p-4">
        <button
          type="button"
          disabled={loggingOut}
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      {/* Mobile top navigation */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <Link
          href="/vendor/dashboard"
          className="flex items-center gap-2 font-bold text-gray-900"
        >
          <ChefHat className="h-6 w-6 text-orange-600" />
          PizzaHub Vendor
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle dashboard menu"
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#231b18] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="min-h-[calc(100vh-60px)] lg:ml-64 lg:min-h-screen">
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
