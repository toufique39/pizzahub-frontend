import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/providers/app-providers";

import "./globals.css";
import SiteShell from "@/components/layout/site-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PizzaHub",
    template: "%s | PizzaHub",
  },
  description: "Order from the best local pizza vendors.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <AppProviders>
          <Suspense fallback={<div className="min-h-dvh" />}>
            <SiteShell>{children}</SiteShell>
          </Suspense>
          <Toaster richColors position="top-right" />
        </AppProviders>
      </body>
    </html>
  );
}
