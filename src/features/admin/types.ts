export type TransactionStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Transaction {
  id: string;
  orderId?: string;
  userId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalVendors: number;
  totalOrders: number;
  revenue: number;
}
