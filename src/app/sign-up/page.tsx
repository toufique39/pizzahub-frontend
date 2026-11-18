import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignUpPage() {
  return (
    <PagePlaceholder
      title="Create account"
      description="Sign-up for customers, vendors, and admins will live in features/auth."
    />
  );
}
