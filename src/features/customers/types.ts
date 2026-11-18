export interface Address {
  id: string;
  label: string;
  line1: string;
  city: string;
  postalCode: string;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
}
