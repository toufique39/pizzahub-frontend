import type { MenuItem } from "../types/menu.types";

interface MenuResponse {
  success: boolean;
  data: MenuItem[];
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getFeaturedMenuItems(): Promise<MenuItem[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/menu-items?limit=6`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch featured menu items.");
    }

    const result: MenuResponse = await response.json();

    return result.success ? result.data : [];
  } catch (error) {
    console.error("Featured menu error:", error);
    return [];
  }
}