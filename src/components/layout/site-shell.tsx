"use client";

import { usePathname } from "next/navigation";

import Navbar from "./navbar";
import Footer from "./footer";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDashboard =
    pathname.startsWith("/customer/dashboard") ||
    pathname.startsWith("/vendor/dashboard") ||
    pathname.startsWith("/admin/dashboard");

  const isAuthCallback = pathname === "/auth/callback";

  if (isDashboard || isAuthCallback) {
    return <div className="flex min-h-dvh flex-col">{children}</div>;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
