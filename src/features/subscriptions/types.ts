export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "cancelled";

export type BillingInterval = "monthly" | "yearly";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: BillingInterval;
  features: string[];
}

export interface Subscription {
  id: string;
  vendorId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
}
