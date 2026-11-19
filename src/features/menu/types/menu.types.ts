export interface MenuItem {
  _id: string;
  vendorId: string;
  itemName: string;
  category: string;
  description: string;
  price: number;

  location: {
    area: string;
    city: string;
  };

  images: (string | { url?: string })[];

  vendor?: {
    name?: string;
    businessName?: string;
    image?: string;
  };
}