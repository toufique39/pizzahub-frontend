import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Profile settings",
};

export default function ProfileSettingsPage() {
  return (
    <PagePlaceholder
      title="Profile settings"
      description="Account details, password, and notification preferences will live here."
    />
  );
}
