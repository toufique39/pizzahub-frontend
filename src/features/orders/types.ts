export type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

export interface OrderImage {
  url?: string;
}

export interface DeliveryAddress {
  addressLine: string;
  area: string;
  city: string;
  phone: string;
}

export interface CustomerOrder {
  _id: string;
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemImage?: string | OrderImage | null;

  vendorId: string;
  customerId: string;

  vendor?: {
    name?: string;
    businessName?: string;
    image?: string;
  } | null;

  deliveryDate: string;
  deliveryAddress: DeliveryAddress;
  message?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface VendorOrder {
  _id: string;
  itemId: string;
  customerId: string;

  customer?: {
    name?: string;
    email?: string;
    image?: string;
  } | null;

  item?: {
    itemName?: string;
    category?: string;
    price?: number;
    images?: (string | OrderImage)[];
  } | null;

  // Fallbacks stored on the order when the related menu item was deleted.
  itemName?: string;
  itemPrice?: number;
  itemImage?: string | null;

  deliveryDate?: string;
  deliveryAddress?: Partial<DeliveryAddress>;
  message?: string;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderSummary {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  cancelled: number;
}

export interface OrdersPagination {
  totalOrders: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface OrdersResponse<T> {
  success: boolean;
  count?: number;
  data: T[];
  pagination?: OrdersPagination;
}

export interface OrderSummaryResponse {
  success: boolean;
  data: OrderSummary;
}
