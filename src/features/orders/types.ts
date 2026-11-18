export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  deliveryAddress: string;
  createdAt: string;
}
