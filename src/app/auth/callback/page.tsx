"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getDashboardPath } from "@/utils/role-redirect";


export default function AuthCallbackPage() {
  const router = useRouter();

  const { data: session, isPending, error } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (error || !session) {
      router.replace("/sign-in");
      return;
    }

    const role = session.user.role || "customer";

    router.replace(getDashboardPath(role));
  }, [session, isPending, error, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff8f2]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />

        <h1 className="mt-5 text-xl font-bold text-gray-900">
          Completing Sign In...
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Preparing your PizzaHub dashboard.
        </p>
      </div>
    </main>
  );
}