
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

type SubscriptionResponse = {
  success: boolean;
  data: {
    subscriptionPlan: string;
    subscriptionStatus: string;
    subscriptionExpiresAt: string | null;
  };
};

type CheckState = "checking" | "active" | "pending" | "error";

export default function PaymentSuccessPage() {
  const [state, setState] = useState<CheckState>("checking");
  const [error, setError] = useState("");

  const checkSubscription = useCallback(async () => {
    try {
      // Read subscription state updated by the verified webhook.
      const result = await apiFetch<SubscriptionResponse>(
        "/api/vendor/dashboard/summary"
      );

      const isActive =
        result.data.subscriptionPlan === "premium" &&
        result.data.subscriptionStatus === "active";

      setState(isActive ? "active" : "pending");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to check subscription status."
      );
      setState("error");
    }
  }, []);

  const retrySubscriptionCheck = () => {
    setState("checking");
    setError("");
    void checkSubscription();
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void checkSubscription();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [checkSubscription]);

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#fffaf5] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        {state === "checking" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Checking Your Payment
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Please wait while we check your subscription status.
            </p>
          </>
        )}

        {state === "active" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Premium Activated!
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Your payment has been verified and your PizzaHub Premium
              subscription is now active.
            </p>

            <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-800">
              You can now enjoy unlimited active menu items and Premium
              vendor benefits.
            </div>

            <Button  className="mt-7 w-full bg-orange-600 hover:bg-orange-700">
              <Link href="/vendor/dashboard">Go to Dashboard</Link>
            </Button>
          </>
        )}

        {state === "pending" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <Clock3 className="h-10 w-10 text-amber-600" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Payment Confirmation Pending
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              We have not received confirmation of your Premium
              subscription yet. Stripe webhook verification may still
              be processing.
            </p>

            <Button
              onClick={retrySubscriptionCheck}
              className="mt-7 w-full bg-orange-600 hover:bg-orange-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Again
            </Button>

            <Button  variant="outline" className="mt-3 w-full">
              <Link href="/vendor/dashboard/subscription">
                View Subscription
              </Link>
            </Button>
          </>
        )}

        {state === "error" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Unable to Verify Status
            </h1>

            <p className="mt-3 text-sm text-red-600">{error}</p>

            <Button
              onClick={retrySubscriptionCheck}
              className="mt-7 w-full bg-orange-600 hover:bg-orange-700"
            >
              Try Again
            </Button>
          </>
        )}
      </div>
    </main>
  );
}