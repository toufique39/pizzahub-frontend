export const APP_NAME = "PizzaHub";

export const ROLES = {
  CUSTOMER: "customer",
  VENDOR: "vendor",
  ADMIN: "admin",
} as const;

/**
 * Single source of truth for in-app URLs.
 * Keep this in sync with the folder structure under `src/app`.
 */
export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  menu: "/menu",
  profileSettings: "/profile-settings",
  paymentSuccess: "/payment-success",
  paymentCancel: "/payment-cancel",
  customer: {
    dashboard: "/customer/dashboard",
    orders: "/customer/dashboard/orders",
  },
  vendor: {
    dashboard: "/vendor/dashboard",
    menuItems: "/vendor/dashboard/menu-items",
    addMenuItem: "/vendor/dashboard/add-menu-item",
    orders: "/vendor/dashboard/orders",
    subscription: "/vendor/dashboard/subscription",
  },
  admin: {
    dashboard: "/admin/dashboard",
    users: "/admin/dashboard/users",
    menuItems: "/admin/dashboard/menu-items",
    transactions: "/admin/dashboard/transactions",
  },
} as const;
