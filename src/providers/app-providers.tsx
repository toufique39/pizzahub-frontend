"use client";

import type { ReactNode } from "react";

/**
 * Composes client-side providers for the whole app (auth, theme, data, ...).
 * Add providers here so the root layout stays declarative.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
