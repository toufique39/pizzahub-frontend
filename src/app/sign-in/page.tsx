import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/common/page-placeholder";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <PagePlaceholder
      title="Sign in"
      description="The sign-in form will live in features/auth and authenticate against the PizzaHub API."
    />
  );
}
