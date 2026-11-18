import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: ROUTES.menu, label: "Browse menu" },
  { href: ROUTES.customer.dashboard, label: "Customer dashboard" },
  { href: ROUTES.vendor.dashboard, label: "Vendor dashboard" },
  { href: ROUTES.admin.dashboard, label: "Admin dashboard" },
] as const;

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-10 px-4 py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Multi-vendor pizza marketplace
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Order pizza from the best local vendors.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          PizzaHub connects customers, vendors, and admins in one place — from
          browsing the menu to managing orders and subscriptions.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={ROUTES.menu}
          className={cn(buttonVariants({ size: "lg" }), "px-4")}
        >
          Browse menu
        </Link>
        <Link
          href={ROUTES.signUp}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "px-4"
          )}
        >
          Create an account
        </Link>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {quickLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 text-sm transition-colors hover:bg-muted"
            >
              {link.label}
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
