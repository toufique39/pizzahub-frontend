
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Crown,
  Loader2,
  Pizza,
  Plus,
  RefreshCw,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

type VendorSummary = {
  totalMenuItems: number;
  activeMenuItems: number;
  pendingOrders: number;
  acceptedOrders: number;
  subscriptionPlan: string;
  subscriptionExpiresAt: string | null;
};

type VendorOrder = {
  _id: string;
  customerId: string;
  itemId: string;
  customer?: {
    name?: string;
    email?: string;
    image?: string;
  } | null;
  item?: {
    itemName?: string;
    category?: string;
    price?: number;
    images?: (string | { url?: string })[];
  } | null;
  itemName?: string;
  price?: number;
  deliveryDate?: string;
  deliveryAddress?: {
    addressLine?: string;
    area?: string;
    city?: string;
    phone?: string;
  };
  message?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt?: string;
};

type SummaryResponse = {
  success: boolean;
  data: VendorSummary;
};

type OrdersResponse = {
  success: boolean;
  data: VendorOrder[];
};

const statCards = [
  {
    key: "totalMenuItems",
    label: "Total Menu Items",
    icon: Pizza,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    key: "activeMenuItems",
    label: "Active Items",
    icon: BadgeCheck,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    key: "pendingOrders",
    label: "Pending Orders",
    icon: Clock3,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    key: "acceptedOrders",
    label: "Accepted Orders",
    icon: CheckCircle2,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
] as const;

function formatDate(value?: string) {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not provided";

  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getImageUrl(images?: (string | { url?: string })[]) {
  if (!Array.isArray(images) || !images[0]) return "";

  const image = images[0];

  return typeof image === "string" ? image : image.url || "";
}

function getStatusClass(status: VendorOrder["status"]) {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
  };

  return styles[status];
}

export default function VendorDashboard() {
  const [summary, setSummary] = useState<VendorSummary | null>(null);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      const [summaryResponse, ordersResponse] = await Promise.all([
        apiFetch<SummaryResponse>("/api/vendor/dashboard/summary"),
        apiFetch<OrdersResponse>("/api/vendor/orders"),
      ]);

      setSummary(summaryResponse.data);
      setOrders(ordersResponse.data || []);
      setError("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load dashboard.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDashboard = () => {
    setLoading(true);
    loadDashboard();
  };

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleOrderAction = async (
    orderId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      setUpdatingOrderId(orderId);

      await apiFetch(`/api/vendor/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      toast.success(
        status === "accepted"
          ? "Order accepted successfully."
          : "Order rejected successfully."
      );

      await loadDashboard();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to update order."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  if (loading && !summary) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">{error}</p>
        <Button onClick={refreshDashboard} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-orange-600">
            Vendor Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
            Overview
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your menu and customer orders.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
          <Button
            render={<Link href="/vendor/dashboard/add-menu-item" />}
            nativeButton={false}
            className="w-full bg-orange-600 hover:bg-orange-700 sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>

          <Button
            render={<Link href="/vendor/dashboard/menu-items" />}
            nativeButton={false}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Pizza className="mr-2 h-4 w-4" />
            My Menu Items
          </Button>

          <Button
            variant="outline"
            onClick={refreshDashboard}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const value = summary?.[stat.key] ?? 0;

          return (
            <div
              key={stat.key}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    {value}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription plan */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white p-3">
            <Crown className="h-6 w-6 text-orange-600" />
          </div>

          <div>
            <p className="text-sm text-gray-600">Current Subscription</p>
            <h2 className="text-lg font-bold capitalize text-gray-900">
              {summary?.subscriptionPlan || "Free"} Plan
            </h2>

            {summary?.subscriptionExpiresAt && (
              <p className="mt-1 text-xs text-gray-500">
                Expires: {formatDate(summary.subscriptionExpiresAt)}
              </p>
            )}
          </div>
        </div>

        <Button
          render={<Link href="/vendor/dashboard/subscription" />}
          nativeButton={false}
          className="w-full bg-orange-600 hover:bg-orange-700 sm:w-auto"
        >
          <Crown className="mr-2 h-4 w-4" />
          {summary?.subscriptionPlan === "premium"
            ? "Manage Subscription"
            : "Upgrade to Premium"}
        </Button>
      </div>

      {/* Customer orders */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Customer Orders
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and manage your incoming orders.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <ShoppingBag className="h-4 w-4 text-orange-600" />
            {orders.length} Orders
          </div>
        </div>

        {/* Filter */}
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {["all", "pending", "accepted", "rejected", "cancelled"].map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                  statusFilter === status
                    ? "bg-orange-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-orange-300"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-gray-300" />
            <h3 className="mt-3 font-semibold text-gray-900">
              No orders found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter === "all"
                ? "Customer orders will appear here."
                : `You don't have any ${statusFilter} orders.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const imageUrl = getImageUrl(order.item?.images);
              const isUpdating = updatingOrderId === order._id;

              return (
                <article
                  key={order._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={order.item?.itemName || order.itemName || "Pizza"}
                          className="h-20 w-20 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                          <Pizza className="h-8 w-8 text-orange-500" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="break-words font-bold text-gray-900">
                          {order.item?.itemName || order.itemName || "Menu Item"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {order.item?.category || "Pizza"}
                        </p>

                        <p className="mt-2 font-semibold text-orange-600">
                          ৳{order.item?.price ?? order.price ?? 0}
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:max-w-xl">
                      <div>
                        <p className="text-xs font-medium uppercase text-gray-400">
                          Customer
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                          {order.customer?.name || "Customer"}
                        </p>
                        <p className="break-all text-sm text-gray-500">
                          {order.customer?.email || ""}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase text-gray-400">
                          Delivery Date
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {formatDate(order.deliveryDate)}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-xs font-medium uppercase text-gray-400">
                          Delivery Address
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                          {[
                            order.deliveryAddress?.addressLine,
                            order.deliveryAddress?.area,
                            order.deliveryAddress?.city,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Address unavailable"}
                        </p>
                        {order.deliveryAddress?.phone && (
                          <p className="mt-1 text-sm text-gray-500">
                            Phone: {order.deliveryAddress.phone}
                          </p>
                        )}
                      </div>

                      {order.message && (
                        <div className="sm:col-span-2">
                          <p className="text-xs font-medium uppercase text-gray-400">
                            Customer Message
                          </p>
                          <p className="mt-1 text-sm text-gray-700">
                            {order.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {order.status === "pending" && (
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 sm:flex sm:justify-end">
                      <Button
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        disabled={isUpdating}
                        onClick={() =>
                          handleOrderAction(order._id, "rejected")
                        }
                      >
                        {isUpdating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        Reject
                      </Button>

                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isUpdating}
                        onClick={() =>
                          handleOrderAction(order._id, "accepted")
                        }
                      >
                        {isUpdating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
                        Accept
                      </Button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
