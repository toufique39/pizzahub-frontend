"use client";

import type { ReactNode } from "react";

import Navbar from "./navbar";
import {
  DashboardSidebar,
  type DashboardNavItem,
} from "./dashboard-sidebar";

interface DashboardShellProps {
  title: string;
  items: DashboardNavItem[];
  children: ReactNode;
}

/**
 * Shared layout for the customer, vendor, and admin dashboards.
 * SiteShell hides the marketing navbar on dashboard routes, so the
 * dashboard renders its own navbar plus a responsive side navigation.
 */
export function DashboardShell({
  title,
  items,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#fffaf3]">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-8">
        <div className="lg:sticky lg:top-24 lg:h-fit lg:w-52 lg:shrink-0">
          <DashboardSidebar title={title} items={items} />
        </div>

        <main className="min-w-0 flex-1 pb-4">{children}</main>
      </div>
    </div>
  );
}
