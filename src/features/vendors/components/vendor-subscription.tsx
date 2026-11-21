
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Crown,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

type SubscriptionData = {
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionExpiresAt: string | null;
  subscriptionCancelAtPeriodEnd: boolean;
};

type SummaryResponse = {
  success: boolean;
  data: SubscriptionData;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data?: {
    checkoutUrl?: string;
    cancelAtPeriodEnd?: boolean;
    subscriptionExpiresAt?: string | null;
  };
};

function formatDate(value: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-700";

    case "past_due":
      return "bg-amber-100 text-amber-700";

    case "canceled":
    case "unpaid":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function VendorSubscription() {
  const [subscription, setSubscription] =
    useState<SubscriptionData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const loadSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await apiFetch<SummaryResponse>(
        "/api/vendor/dashboard/summary"
      );

      setSubscription({
        subscriptionPlan: result.data.subscriptionPlan || "free",
        subscriptionStatus: result.data.subscriptionStatus || "inactive",
        subscriptionExpiresAt: result.data.subscriptionExpiresAt || null,
        subscriptionCancelAtPeriodEnd:
          Boolean(result.data.subscriptionCancelAtPeriodEnd),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load subscription."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadSubscription();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadSubscription]);

  const handleUpgrade = async () => {
    try {
      setProcessing(true);

      const result = await apiFetch<ApiResponse>(
        "/api/vendor/subscription/checkout",
        {
          method: "POST",
        }
      );

      const checkoutUrl = result.data?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("Stripe Checkout URL was not returned.");
      }

      // Redirect to Stripe-hosted Checkout.
      window.location.assign(checkoutUrl);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to start Premium checkout."
      );

      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      setProcessing(true);

      const result = await apiFetch<ApiResponse>(
        "/api/vendor/subscription/cancel",
        {
          method: "POST",
        }
      );

      toast.success(
        result.message || "Subscription cancellation scheduled."
      );

      setConfirmCancel(false);
      await loadSubscription();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to cancel subscription."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading && !subscription) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">{error}</p>
        <Button onClick={loadSubscription} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const isPremium = subscription?.subscriptionPlan === "premium";
  const isCancellationScheduled =
    Boolean(subscription?.subscriptionCancelAtPeriodEnd);

  const status = subscription?.subscriptionStatus || "inactive";

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            Vendor Account
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
            Subscription
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your PizzaHub vendor subscription.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadSubscription}
          disabled={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Current plan */}
      <section className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm">
        <div className="bg-[#2b201c] p-6 text-white md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-orange-200">
                Current Plan
              </p>

              <h2 className="mt-2 text-3xl font-extrabold capitalize">
                {subscription?.subscriptionPlan || "Free"}
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                {isPremium
                  ? "Enjoy your Premium vendor benefits."
                  : "You are currently using the Free plan."}
              </p>
            </div>

            <div className="rounded-2xl bg-orange-500 p-4">
              <Crown className="h-9 w-9 text-white" />
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Subscription Status
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${getStatusStyle(status)}`}
            >
              {status.replaceAll("_", " ")}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {isCancellationScheduled
                ? "Premium Access Until"
                : "Next Expiry Date"}
            </p>

            <p className="mt-2 font-semibold text-gray-900">
              {formatDate(subscription?.subscriptionExpiresAt || null)}
            </p>
          </div>
        </div>
      </section>

      {/* Cancellation information */}
      {isCancellationScheduled && (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">
              Cancellation scheduled
            </p>
            <p className="mt-1 text-sm text-amber-800">
              Your Premium access remains available until{" "}
              {formatDate(subscription?.subscriptionExpiresAt || null)}.
              After that, your account will return to the Free plan.
            </p>
          </div>
        </div>
      )}

      {/* Payment issue */}
      {status === "past_due" && (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">
              Payment needs attention
            </p>
            <p className="mt-1 text-sm text-amber-800">
              Stripe could not collect your latest subscription payment.
              Please check your payment method in Stripe.
            </p>
          </div>
        </div>
      )}

      {/* Plan comparison */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Subscription Benefits
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Compare the Free and Premium plans.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Free Plan
              </h3>
              {subscription?.subscriptionPlan === "free" && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  Current Plan
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Get started with your restaurant.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Maximum 3 active menu items",
                "Basic vendor dashboard",
                "Customer order management",
              ].map((benefit) => (
                <p
                  key={benefit}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {benefit}
                </p>
              ))}
            </div>
          </div>

          {/* Premium */}
          <div className="rounded-2xl border-2 border-orange-300 bg-orange-50 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                <Crown className="mr-2 inline h-5 w-5 text-orange-600" />
                Premium Plan
              </h3>

              {isPremium && (
                <span className="rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white">
                  Current Plan
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-gray-600">
              More flexibility and visibility for your restaurant.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Unlimited active menu items",
                "Premium vendor badge",
                "Featured menu placement",
                "All Free plan features",
              ].map((benefit) => (
                <p
                  key={benefit}
                  className="flex items-center gap-2 text-sm text-gray-800"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {benefit}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-bold text-gray-900">
          Manage Your Plan
        </h2>

        {!isPremium ? (
          <>
            <p className="mt-2 text-sm text-gray-500">
              Upgrade to Premium to publish unlimited active menu items
              and get featured placement.
            </p>

            <Button
              onClick={handleUpgrade}
              disabled={processing}
              className="mt-5 w-full bg-orange-600 hover:bg-orange-700 sm:w-auto"
            >
              {processing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Crown className="mr-2 h-4 w-4" />
              )}
              Upgrade to Premium
            </Button>
          </>
        ) : isCancellationScheduled ? (
          <p className="mt-2 text-sm text-gray-600">
            Your subscription is already scheduled to end at the current
            billing period. Premium remains available until the expiry date.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-gray-500">
              You can schedule cancellation. Your Premium benefits will
              continue until the current billing period ends.
            </p>

            {!confirmCancel ? (
              <Button
                variant="outline"
                onClick={() => setConfirmCancel(true)}
                className="mt-5 border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Subscription
              </Button>
            ) : (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="font-semibold text-red-800">
                  Confirm subscription cancellation?
                </p>

                <p className="mt-1 text-sm text-red-700">
                  Your Premium access will remain active until the current
                  billing period ends.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    disabled={processing}
                    onClick={() => setConfirmCancel(false)}
                  >
                    Keep Premium
                  </Button>

                  <Button
                    disabled={processing}
                    onClick={handleCancel}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {processing && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Confirm Cancellation
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <p className="flex items-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="h-4 w-4 text-green-600" />
        Subscription updates are confirmed through verified Stripe events.
      </p>
    </div>
  );
}
