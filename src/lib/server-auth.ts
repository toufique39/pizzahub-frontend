import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/utils/role-redirect";


type UserRole = "customer" | "vendor" | "admin";

export async function requireRole(requiredRole: UserRole) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Unauthenticated users
  if (!session) {
    redirect("/sign-in");
  }

  // Blocked users
  if (session.user.isBlocked) {
    redirect("/account-blocked");
  }

  const userRole = session.user.role;

  // Invalid role
  if (!["customer", "vendor", "admin"].includes(userRole)) {
    redirect("/sign-in");
  }

  // Prevent cross-role dashboard access
  if (userRole !== requiredRole) {
    redirect(getDashboardPath(userRole));
  }

  return session;
}