import Link from "next/link";

import { ROUTES } from "@/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-6 text-sm text-muted-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4">
        <p>© PizzaHub. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href={ROUTES.menu} className="hover:text-foreground">
            Menu
          </Link>
          <Link href={ROUTES.profileSettings} className="hover:text-foreground">
            Profile settings
          </Link>
        </div>
      </div>
    </footer>
  );
}
