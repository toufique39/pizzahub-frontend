"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export interface DashboardNavItem {
  href: string;
  label: string;
}

interface DashboardSidebarProps {
  title: string;
  items: DashboardNavItem[];
}

export function DashboardSidebar({ title, items }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0">
      <p className="px-2.5 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== items[0]?.href &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors hover:bg-orange-50 hover:text-orange-700",
                isActive
                  ? "bg-orange-50 font-semibold text-orange-700"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
