"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  CalendarDays,
  RefreshCw,
  Package,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CustomerOrder {
  _id: string;
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemImage?: string | { url?: string } | null;

  vendor?: {
    name?: string;
    businessName?: string;
  } | null;

  deliveryDate: string;

  deliveryAddress: {
    addressLine: string;
    area: string;
    city: string;
    phone: string;
  };

  message?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
}

interface OrdersResponse {
  success: boolean;
  count: number;
  data: CustomerOrder[];
}

interface SummaryResponse {
  success: boolean;
  data: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    cancelled: number;
  };
}

const initialSummary = {
  total: 0,
  pending: 0,
  accepted: 0,
  rejected: 0,
  cancelled: 0,
};

function getImageUrl(image: CustomerOrder["itemImage"]) {
  if (typeof image === "string") return image;

  return image?.url || "";
}

function formatDate(value: string) {
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

function getStatusStyle(status: CustomerOrder["status"]) {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-600",
  };

  return styles[status];
}

export default function CustomerDashboard() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [summary, setSummary] = useState(initialSummary);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [ordersResult, summaryResult] = await Promise.all([
        apiFetch<OrdersResponse>("/api/orders/my-orders"),
        apiFetch<SummaryResponse>("/api/orders/summary"),
      ]);

      setOrders(ordersResult.data || []);
      setSummary(summaryResult.data || initialSummary);
    } catch (error) {
      console.error("Customer dashboard error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load your dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Cancel pending order
  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingId(orderId);

      const result = await apiFetch<{
        success: boolean;
        message: string;
      }>(`/api/orders/${orderId}/cancel`, {
        method: "PATCH",
      });

      toast.success(result.message || "Order cancelled successfully.");

      await loadDashboard();
    } catch (error) {
      console.error("Cancel order error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to cancel order."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const statistics = [
    {
      title: "Total Orders",
      value: summary.total,
      icon: ShoppingBag,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Pending Orders",
      value: summary.pending,
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Accepted Orders",
      value: summary.accepted,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Rejected Orders",
      value: summary.rejected,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  if (error && !orders.length && !loading) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-xl font-bold text-red-700">
          Unable to Load Dashboard
        </h2>

        <p className="mt-2 text-sm text-red-600">{error}</p>

        <Button
          onClick={loadDashboard}
          className="mt-5 bg-orange-600 hover:bg-orange-700"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Dashboard Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            CUSTOMER PORTAL
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#321b16]">
            My Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Welcome back! Manage and track your pizza orders.
          </p>
        </div>

        <Button
          onClick={loadDashboard}
          disabled={loading}
          variant="outline"
          className="rounded-xl border-orange-200"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  {loading ? (
                    <div className="mt-3 h-9 w-16 animate-pulse rounded bg-orange-100" />
                  ) : (
                    <h2 className="mt-2 text-3xl font-extrabold text-[#321b16]">
                      {stat.value}
                    </h2>
                  )}
                </div>

                <div
                  className={`flex size-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancelled Statistics */}
      <div className="rounded-2xl border border-orange-100 bg-[#fff7ed] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-600">
              Cancelled Orders
            </p>

            <p className="mt-1 text-2xl font-extrabold text-[#321b16]">
              {loading ? "—" : summary.cancelled}
            </p>
          </div>

          <Package className="size-8 text-orange-500" />
        </div>
      </div>

      {/* Orders Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#321b16]">
            My Recent Orders
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Check your order details and current status.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-2xl bg-orange-100"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-6 py-16 text-center">
            <ShoppingBag className="mx-auto size-14 text-orange-300" />

            <h3 className="mt-5 text-xl font-bold text-[#321b16]">
              No Orders Yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Your pizza ordering journey starts here!
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-block rounded-full bg-orange-600 px-6 py-3 font-bold text-white transition hover:bg-orange-700"
            >
              Explore Menu
            </Link>
          </div>
        )}

        {/* Order List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm"
              >
                <div className="grid gap-5 p-5 sm:grid-cols-[150px_1fr] sm:p-6">

                  {/* Item Image */}
                  {getImageUrl(order.itemImage) ? (
                    <img
                      src={getImageUrl(order.itemImage)}
                      alt={order.itemName}
                      className="h-40 w-full rounded-xl object-cover sm:h-full"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-xl bg-orange-50 text-5xl">
                      🍕
                    </div>
                  )}

                  {/* Order Information */}
                  <div className="min-w-0">

                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold tracking-wide text-orange-600">
                          ORDER #{order._id.slice(-6).toUpperCase()}
                        </p>

                        <h3 className="mt-2 text-xl font-extrabold text-[#321b16]">
                          {order.itemName}
                        </h3>

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
                        {order.deliveryAddress?.area},{" "}
                        {order.deliveryAddress?.city}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-orange-100 pt-4">

                      <span className="text-xl font-extrabold text-orange-600">
                        ৳{Number(order.itemPrice).toLocaleString("en-BD")}
                      </span>

                      {order.status === "pending" && (
                        <Button
                          variant="outline"
                          disabled={cancellingId === order._id}
                          onClick={() => handleCancelOrder(order._id)}
                          className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          {cancellingId === order._id ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}