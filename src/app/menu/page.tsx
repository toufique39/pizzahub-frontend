import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Menu",
};

export default function MenuPage() {
  return (
    <PagePlaceholder
      title="Menu"
      description="The browsable menu grid will live in features/menu; open an item to see its detail page."
    />
  );
}
