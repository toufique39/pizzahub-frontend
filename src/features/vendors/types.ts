export type VendorStatus = "pending" | "approved" | "suspended";

export interface Vendor {
  id: string;
  ownerId: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  status: VendorStatus;
  createdAt: string;
}
