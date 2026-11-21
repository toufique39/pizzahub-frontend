"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  UserRound,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getDashboardPath } from "@/utils/role-redirect";
import Image from "next/image";


const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const user = session?.user;
  const dashboardPath = user
    ? getDashboardPath(user.role || "customer")
    : "/sign-in";

  // Prevent the page behind the mobile drawer from scrolling.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();

      setProfileMenuOpen(false);
      setMobileMenuOpen(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex min-w-0 items-center gap-2"
        >
          <span className="text-2xl sm:text-3xl">🍕</span>

          <span className="truncate text-xl font-extrabold tracking-tight text-[#321b16] sm:text-2xl">
            Pizza<span className="text-orange-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition ${
                  active
                    ? "text-orange-600"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-orange-100" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setProfileMenuOpen((previous) => !previous)
                }
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-orange-100 px-3 py-2 transition hover:bg-orange-50"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="size-8 rounded-full object-cover"
          
                  />
                ) : (
                  <span className="flex size-8 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                    <UserRound size={18} />
                  </span>
                )}

                <span className="max-w-28 truncate text-sm font-semibold text-[#321b16] lg:max-w-32">
                  {user.name}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setProfileMenuOpen(false)}
                  />

                  <div className="absolute right-0 z-50 mt-3 w-60 rounded-2xl border border-orange-100 bg-white p-2 shadow-xl">
                    <div className="border-b border-orange-100 px-3 py-3">
                      <p className="truncate font-bold text-[#321b16]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                      <p className="mt-2 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold capitalize text-orange-700">
                        {user.role}
                      </p>
                    </div>

                    <Link
                      href={dashboardPath}
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50"
                    >
                      <LayoutDashboard size={17} />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile-settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50"
                    >
                      <Settings size={17} />
                      Profile Settings
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-[#321b16] transition hover:bg-orange-50"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-orange-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          className="rounded-lg p-2 text-[#321b16] transition hover:bg-orange-50 md:hidden"
        >
          {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-orange-100 bg-white px-4 py-5 shadow-lg sm:max-h-[calc(100dvh-5rem)] sm:px-6 md:hidden"
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                {link.label}
              </Link>
            ))}

            {!isPending && user && (
              <>
                <div className="my-2 border-t border-orange-100" />

                <div className="px-3 py-2">
                  <p className="truncate font-bold text-[#321b16]">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {user.email}
                  </p>
                  <p className="mt-1 text-xs capitalize text-orange-600">
                    {user.role}
                  </p>
                </div>

                <Link
                  href={dashboardPath}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-orange-50"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link
                  href="/profile-settings"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-orange-50"
                >
                  <Settings size={18} />
                  Profile Settings
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}

            {!isPending && !user && (
              <>
                <div className="my-2 border-t border-orange-100" />

                <Link
                  href="/sign-in"
                  onClick={closeMobileMenu}
                  className="rounded-full border border-orange-200 px-5 py-3 text-center text-sm font-semibold text-[#321b16]"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMobileMenu}
                  className="rounded-full bg-orange-600 px-5 py-3 text-center text-sm font-bold text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}