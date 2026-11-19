export type UserRole = "customer" | "vendor" | "admin";

export function getDashboardPath(role: string): string {
  switch (role as UserRole) {
    case "customer":
      return "/customer/dashboard";

    case "vendor":
      return "/vendor/dashboard";

    case "admin":
      return "/admin/dashboard";

    default:
      return "/";
  }
}