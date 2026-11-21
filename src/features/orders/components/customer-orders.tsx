"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Package,
  Pizza,
  RefreshCw,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import type {
  CustomerOrder,
  OrdersResponse,
  OrderStatus,
  OrderSummary,
  OrderSummaryResponse,
} from "@/features/orders/types";

const initialSummary: OrderSummary = {
  total: 0,
  pending: 0,
  accepted: 0,
  rejected: 0,
  cancelled: 0,
};

const statusFilters: Array<"all" | OrderStatus> = [
  "all",
  "pending",
  "accepted",
  "rejected",
  "cancelled",
];

function getImageUrl(image: CustomerOrder["itemImage"]) {
  if (typeof image === "string") return image;

  return image?.url || "";
}

function formatDate(value?: string) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

function getStatusStyle(status: OrderStatus) {
  const styles: Record<OrderStatus, string> = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-600",
  };

  return styles[status];
}

export default function CustomerOrders() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [summary, setSummary] = useState<OrderSummary>(initialSummary);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      const [ordersResult, summaryResult] = await Promise.all([
        apiFetch<OrdersResponse<CustomerOrder>>("/api/orders/my-orders"),
        apiFetch<OrderSummaryResponse>("/api/orders/summary"),
      ]);

      setOrders(ordersResult.data || []);
      setSummary(summaryResult.data || initialSummary);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshOrders = () => {
    setLoading(true);
    void loadOrders();
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadOrders();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadOrders]);

  const handleCancelOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(orderId);

      const result = await apiFetch<{ success: boolean; message: string }>(
        `/api/orders/${orderId}/cancel`,
        { method: "PATCH" }
      );

      toast.success(result.message || "Order cancelled successfully.");

      await loadOrders();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to cancel order."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const statistics = [
    {
      title: "Total Orders",
      value: summary.total,
      icon: ShoppingBag,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Pending",
      value: summary.pending,
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Accepted",
      value: summary.accepted,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Rejected",
      value: summary.rejected,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Cancelled",
      value: summary.cancelled,
      icon: Package,
      color: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            Customer Portal
          </p>

          <h1 className="mt-1 text-2xl font-extrabold text-[#321b16] md:text-3xl">
            My Orders
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Track your order history and manage pending orders.
          </p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            render={<Link href="/menu" />}
            nativeButton={false}
            className="flex-1 bg-orange-600 hover:bg-orange-700 sm:flex-none"
          >
            <Pizza className="mr-2 h-4 w-4" />
            Order More
          </Button>

          <Button
            variant="outline"
            onClick={refreshOrders}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  {loading && !orders.length ? (
                    <div className="mt-3 h-8 w-12 animate-pulse rounded bg-orange-100" />
                  ) : (
                    <p className="mt-2 text-2xl font-extrabold text-[#321b16]">
                      {stat.value}
                    </p>
                  )}
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {statusFilters.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
              statusFilter === status
                ? "bg-orange-600 text-white"
                : "border border-orange-100 bg-white text-gray-600 hover:border-orange-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>

          <Button onClick={refreshOrders} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-2xl bg-orange-100"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredOrders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-6 py-16 text-center">
          <ShoppingBag className="mx-auto size-14 text-orange-300" />

          <h2 className="mt-5 text-xl font-bold text-[#321b16]">
            {orders.length === 0 ? "No Orders Yet" : "No matching orders"}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {orders.length === 0
              ? "Your pizza ordering journey starts here!"
              : `You don't have any ${statusFilter} orders.`}
          </p>

          {orders.length === 0 && (
            <Button
              render={<Link href="/menu" />}
              nativeButton={false}
              className="mt-6 bg-orange-600 hover:bg-orange-700"
            >
              Explore Menu
            </Button>
          )}
        </div>
      )}

      {/* Orders */}
      {!loading && !error && filteredOrders.length > 0 && (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const imageUrl = getImageUrl(order.itemImage);
            const isCancelling = cancellingId === order._id;

            return (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm"
              >
                <div className="grid gap-5 p-5 sm:grid-cols-[150px_1fr] sm:p-6">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={order.itemName}
                      className="h-40 w-full rounded-xl object-cover sm:h-full"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-xl bg-orange-50 text-5xl">
                      🍕
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold tracking-wide text-orange-600">
                          ORDER #{order._id.slice(-6).toUpperCase()}
                        </p>

                        <h2 className="mt-2 text-xl font-extrabold text-[#321b16]">
                          {order.itemName}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {order.vendor?.businessName ||
                            order.vendor?.name ||
                            "Restaurant"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays
                          size={16}
                          className="shrink-0 text-orange-600"
                        />
                        Delivery: {formatDate(order.deliveryDate)}
                      </p>

                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin
                          size={16}
                          className="shrink-0 text-orange-600"
                        />
                        {[
                          order.deliveryAddress?.addressLine,
                          order.deliveryAddress?.area,
                          order.deliveryAddress?.city,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Address unavailable"}
                      </p>

                      {order.deliveryAddress?.phone && (
                        <p className="text-sm text-gray-600 sm:col-span-2">
                          Phone: {order.deliveryAddress.phone}
                        </p>
                      )}

                      {order.message && (
                        <p className="text-sm text-gray-600 sm:col-span-2">
                          <span className="font-semibold">
                            Special instructions:
                          </span>{" "}
                          {order.message}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-orange-100 pt-4">
                      <span className="text-xl font-extrabold text-orange-600">
                        ৳{Number(order.itemPrice).toLocaleString("en-BD")}
                      </span>

                      {order.status === "pending" && (
                        <Button
                          variant="outline"
                          disabled={isCancelling}
                          onClick={() => handleCancelOrder(order._id)}
                          className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          {isCancelling ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            "Cancel Order"
                          )}
                        </Button>
                      )}
                    </div>

                    <p className="mt-3 text-xs text-gray-400">
                      Ordered on {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
