import Link from "next/link";

import { ROLES, ROUTES } from "@/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: ROUTES.menu, label: "Menu" },
  { href: ROUTES.customer.dashboard, label: "Customer" },
  { href: ROUTES.vendor.dashboard, label: "Vendor" },
  { href: ROUTES.admin.dashboard, label: "Admin" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-border/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href={ROUTES.home}
          className="font-heading text-lg font-semibold tracking-tight"
        >
          PizzaHub
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.signIn}
            className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href={ROUTES.signUp}
            className={cn(buttonVariants({ size: "sm" }), "px-3")}
          >
            Sign up
          </Link>
        </div>
      </div>
      <p className="sr-only">Roles: {Object.values(ROLES).join(", ")}</p>
    </header>
  );
}
