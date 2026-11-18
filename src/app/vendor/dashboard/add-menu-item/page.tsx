import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Add menu item",
};

export default function AddMenuItemPage() {
  return (
    <PagePlaceholder
      title="Add menu item"
      description="The create form will live in features/menu and reuse MenuItemFormValues."
    />
  );
}
