export type MenuCategory = "pizza" | "sides" | "drinks" | "desserts";

export interface MenuItem {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: MenuCategory;
  isAvailable: boolean;
}

export interface MenuItemFormValues {
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl?: string;
}
