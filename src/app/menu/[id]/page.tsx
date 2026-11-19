import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Menu item",
};

export default function MenuItemPage() {
  // TODO: read `params.id` (via PageProps<"/menu/[id]">) once the detail view exists.
  return (
    <PagePlaceholder
      title="Menu item"
      description="Item details, options, and the add-to-cart action will live in features/menu."
    />
  );
}
