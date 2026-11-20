
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Store,
  UserRound,
  Pizza,
  Clock3,
  ReceiptText,
  RefreshCw,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

type AdminSummary = {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  totalTransactions: number;
};

type SummaryResponse = {
  success: boolean;
  data: AdminSummary;
};

const statCards = [
  {
    key: "totalUsers",
    title: "Total Users",
    description: "Registered accounts",
    icon: Users,
    iconStyle: "bg-blue-100 text-blue-600",
  },
  {
    key: "totalVendors",
    title: "Total Vendors",
    description: "Restaurant owners",
    icon: Store,
    iconStyle: "bg-orange-100 text-orange-600",
  },
  {
    key: "totalCustomers",
    title: "Total Customers",
    description: "Registered customers",
    icon: UserRound,
    iconStyle: "bg-purple-100 text-purple-600",
  },
  {
    key: "totalMenuItems",
    title: "Total Menu Items",
    description: "All submitted items",
    icon: Pizza,
    iconStyle: "bg-red-100 text-red-600",
  },
  {
    key: "pendingMenuItems",
    title: "Pending Items",
    description: "Waiting for approval",
    icon: Clock3,
    iconStyle: "bg-amber-100 text-amber-600",
  },
  {
    key: "totalTransactions",
    title: "Total Transactions",
    description: "Subscription payments",
    icon: ReceiptText,
    iconStyle: "bg-green-100 text-green-600",
  },
] as const;

export default function AdminDashboardOverview() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = useCallback(async () => {
    try {
      const result = await apiFetch<SummaryResponse>(
        "/api/admin/dashboard/summary"
      );

      setSummary(result.data);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard summary."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSummary = useCallback(() => {
    setLoading(true);
    setError("");
    void fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSummary();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchSummary]);

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor users, restaurants, menu items and platform activity.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadSummary}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>

          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={loadSummary}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Platform Statistics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Current overview of your PizzaHub platform.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            const value = summary?.[card.key] ?? 0;

            return (
              <div
                key={card.key}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {card.title}
                    </p>

                    <p className="mt-3 text-3xl font-extrabold text-gray-900">
                      {loading && !summary ? (
                        <span className="inline-block h-9 w-16 animate-pulse rounded-md bg-gray-100" />
                      ) : (
                        value.toLocaleString()
                      )}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      {card.description}
                    </p>
                  </div>

                  <div className={`rounded-xl p-3 ${card.iconStyle}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage important parts of your platform.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/dashboard/users"
            className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <h3 className="font-bold text-gray-900">
                  Manage Users
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Search, block and unblock accounts.
                </p>
              </div>
            </div>

            <ArrowUpRight className="h-5 w-5 text-gray-400 transition group-hover:text-orange-600" />
          </Link>

          <Link
            href="/admin/dashboard/menu-items"
            className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-100 p-3">
                <Pizza className="h-6 w-6 text-orange-600" />
              </div>

              <div>
                <h3 className="font-bold text-gray-900">
                  Manage Menu Items
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Review and approve submitted pizzas.
                </p>
              </div>
            </div>

            <ArrowUpRight className="h-5 w-5 text-gray-400 transition group-hover:text-orange-600" />
          </Link>

          <Link
            href="/admin/dashboard/transactions"
            className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-green-100 p-3">
                <ReceiptText className="h-6 w-6 text-green-600" />
              </div>

              <div>
                <h3 className="font-bold text-gray-900">
                  Transactions
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Review vendor subscription payments.
                </p>
              </div>
            </div>

            <ArrowUpRight className="h-5 w-5 text-gray-400 transition group-hover:text-orange-600" />
          </Link>

          <div className="flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="rounded-xl bg-white p-3">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                Platform Security
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Admin-only routes are protected by JWT and role verification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
