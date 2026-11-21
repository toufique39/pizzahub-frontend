"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Pizza,
  RefreshCw,
  ShoppingBag,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import type {
  OrdersResponse,
  OrderStatus,
  VendorOrder,
} from "@/features/orders/types";

const statusFilters: Array<"all" | OrderStatus> = [
  "all",
  "pending",
  "accepted",
  "rejected",
  "cancelled",
];

function formatDate(value?: string) {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not provided";

  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
}

function getImageUrl(order: VendorOrder) {
  const image = order.item?.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;

  return order.itemImage || "";
}

function getStatusClass(status: OrderStatus) {
  const styles: Record<OrderStatus, string> = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
  };

  return styles[status];
}

export default function VendorOrders() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const result = await apiFetch<OrdersResponse<VendorOrder>>(
        `/api/vendor/orders?${params.toString()}`
      );

      setOrders(result.data || []);
      setTotalOrders(result.pagination?.totalOrders || 0);
      setTotalPages(Math.max(1, result.pagination?.totalPages || 1));
      setError("");

      // The last order on a page may have moved out of the filter.
      if (result.data.length === 0 && page > 1) {
        setPage((current) => Math.max(1, current - 1));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load customer orders."
      );
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

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

  const handleStatusFilter = (status: "all" | OrderStatus) => {
    setLoading(true);
    setStatusFilter(status);
    setPage(1);
  };

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

      await loadOrders();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to update order."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            Vendor Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-extrabold text-gray-900 md:text-3xl">
            Customer Orders
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review incoming orders and accept or reject pending requests.
          </p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            render={<Link href="/vendor/dashboard/menu-items" />}
            nativeButton={false}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            <Pizza className="mr-2 h-4 w-4" />
            My Menu Items
          </Button>

          <Button
            onClick={refreshOrders}
            disabled={loading}
            className="flex-1 bg-orange-600 hover:bg-orange-700 sm:flex-none"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="rounded-xl bg-orange-100 p-3">
          <ShoppingBag className="h-6 w-6 text-orange-600" />
        </div>

        <div>
          <p className="text-sm text-gray-500">Matching Orders</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading && !orders.length ? "—" : totalOrders}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {statusFilters.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => handleStatusFilter(status)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
              statusFilter === status
                ? "bg-orange-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-orange-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>

          <Button onClick={refreshOrders} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-56 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            No orders found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {statusFilter === "all"
              ? "Customer orders will appear here."
              : `You don't have any ${statusFilter} orders.`}
          </p>
        </div>
      )}

      {/* Orders */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const imageUrl = getImageUrl(order);
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
                      <p className="text-xs font-semibold tracking-wide text-orange-600">
                        ORDER #{order._id.slice(-6).toUpperCase()}
                      </p>

                      <h2 className="mt-1 break-words font-bold text-gray-900">
                        {order.item?.itemName ||
                          order.itemName ||
                          "Menu Item"}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {order.item?.category || "Pizza"}
                      </p>

                      <p className="mt-2 font-semibold text-orange-600">
                        ৳
                        {Number(
                          order.item?.price ?? order.itemPrice ?? 0
                        ).toLocaleString("en-BD")}
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
                      <p className="flex items-center gap-2 text-xs font-medium uppercase text-gray-400">
                        <UserRound className="h-3.5 w-3.5" />
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
                      <p className="flex items-center gap-2 text-xs font-medium uppercase text-gray-400">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Delivery Date
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {formatDate(order.deliveryDate)}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="flex items-center gap-2 text-xs font-medium uppercase text-gray-400">
                        <MapPin className="h-3.5 w-3.5" />
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

                    {order.createdAt && (
                      <p className="text-xs text-gray-400 sm:col-span-2">
                        Ordered on {formatDate(order.createdAt)}
                      </p>
                    )}
                  </div>
                </div>

                {order.status === "pending" && (
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 sm:flex sm:justify-end">
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      disabled={isUpdating}
                      onClick={() => handleOrderAction(order._id, "rejected")}
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
                      onClick={() => handleOrderAction(order._id, "accepted")}
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

      {/* Pagination */}
      {!loading && !error && totalOrders > 0 && totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages} · {totalOrders} orders
          </p>

          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              disabled={page <= 1 || loading}
              onClick={() => {
                setLoading(true);
                setPage((current) => Math.max(1, current - 1));
              }}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              disabled={page >= totalPages || loading}
              onClick={() => {
                setLoading(true);
                setPage((current) => Math.min(totalPages, current + 1));
              }}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
