
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Loader2,
  Pizza,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

type MenuStatus = "pending" | "approved" | "rejected" | "inactive";

type MenuItem = {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  area?: string;
  city?: string;
  images?: (string | { url?: string })[];
  status: MenuStatus;
  isAvailable: boolean;
  createdAt?: string;
  vendor?: {
    name?: string;
    email?: string;
    businessName?: string;
    subscriptionPlan?: string;
  } | null;
};

type MenuResponse = {
  success: boolean;
  data: MenuItem[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
};

type ApiResponse = {
  success: boolean;
  message: string;
  data?: MenuItem;
};

const statusFilters = [
  "all",
  "pending",
  "approved",
  "rejected",
  "inactive",
];

function getImageUrl(images?: MenuItem["images"]) {
  const image = images?.[0];

  if (!image) return "";

  return typeof image === "string" ? image : image.url || "";
}

function getStatusClass(status: MenuStatus) {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    inactive: "bg-gray-100 text-gray-700",
  };

  return styles[status];
}

function formatDate(value?: string) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminMenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [detailsItem, setDetailsItem] = useState<MenuItem | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        search: activeSearch,
        status: statusFilter,
        page: String(page),
        limit: "9",
      });

      const result = await apiFetch<MenuResponse>(
        `/api/admin/menu-items?${params.toString()}`
      );

      setItems(result.data || []);
      setTotalItems(result.pagination?.totalItems || 0);
      setTotalPages(Math.max(1, result.pagination?.totalPages || 1));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load menu items."
      );
    } finally {
      setLoading(false);
    }
  }, [activeSearch, statusFilter, page]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadItems();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadItems]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setActiveSearch(searchInput.trim());
  };

  const handleStatusChange = async (
    item: MenuItem,
    nextStatus: MenuStatus
  ) => {
    try {
      setBusyId(item._id);

      const result = await apiFetch<ApiResponse>(
        `/api/admin/menu-items/${item._id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      toast.success(
        result.message || `Menu item ${nextStatus} successfully.`
      );

      if (detailsItem?._id === item._id) {
        setDetailsItem(null);
      }

      await loadItems();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to update menu item."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    try {
      setBusyId(item._id);

      const result = await apiFetch<ApiResponse>(
        `/api/admin/menu-items/${item._id}`,
        { method: "DELETE" }
      );

      toast.success(result.message || "Menu item deleted.");

      setConfirmDeleteId(null);

      if (detailsItem?._id === item._id) {
        setDetailsItem(null);
      }

      await loadItems();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to delete menu item."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-orange-600">
            Administration
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
            Manage Menu Items
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Review, approve and manage submitted menu items.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadItems}
          disabled={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Total items */}
      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="rounded-xl bg-orange-100 p-3">
          <Pizza className="h-6 w-6 text-orange-600" />
        </div>

        <div>
          <p className="text-sm text-gray-500">Matching Menu Items</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalItems}
          </p>
        </div>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search item name, category or description..."
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
        >
          {statusFilters.map((status) => (
            <option key={status} value={status}>
              {status === "all"
                ? "All Statuses"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>

        <Button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <Button
            size="sm"
            variant="outline"
            className="ml-3"
            onClick={loadItems}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Menu item cards */}
      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <Pizza className="mx-auto h-10 w-10 text-gray-300" />
          <h3 className="mt-3 font-semibold text-gray-900">
            No menu items found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try another search or status filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const imageUrl = getImageUrl(item.images);
            const busy = busyId === item._id;

            return (
              <article
                key={item._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={item.itemName}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-orange-50">
                    <Pizza className="h-12 w-12 text-orange-400" />
                  </div>
                )}

                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-gray-900">
                        {item.itemName}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.category}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-sm text-gray-600">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-orange-600">
                      ৳{item.price}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.area || ""}{item.area && item.city ? ", " : ""}{item.city || ""}
                    </span>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs font-semibold uppercase text-gray-400">
                      Vendor
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {item.vendor?.businessName ||
                        item.vendor?.name ||
                        "Unknown Vendor"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.vendor?.email || ""}
                    </p>
                    <p className="mt-1 text-xs capitalize text-orange-600">
                      {item.vendor?.subscriptionPlan || "free"} plan
                    </p>
                  </div>

                  <p className="text-xs text-gray-400">
                    Submitted: {formatDate(item.createdAt)}
                  </p>

                  <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setDetailsItem(item)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Details
                    </Button>

                    {item.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          disabled={busy}
                          onClick={() =>
                            handleStatusChange(item, "approved")
                          }
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {busy ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() =>
                            handleStatusChange(item, "rejected")
                          }
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {item.status === "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() =>
                          handleStatusChange(item, "inactive")
                        }
                      >
                        Deactivate
                      </Button>
                    )}

                    {(item.status === "rejected" ||
                      item.status === "inactive") && (
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() =>
                          handleStatusChange(item, "approved")
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                    )}

                    {confirmDeleteId === item._id ? (
                      <div className="flex w-full items-center justify-end gap-2 rounded-lg bg-red-50 p-2">
                        <span className="mr-auto text-xs text-red-700">
                          Delete this item?
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          disabled={busy}
                          onClick={() => handleDelete(item)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Confirm
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => setConfirmDeleteId(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {item.status === "approved" && !item.isAvailable && (
                    <p className="text-xs text-amber-700">
                      Approved, but currently unavailable. Vendor must activate it.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalItems > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages} · {totalItems} items
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Details modal */}
      {detailsItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {detailsItem.itemName}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {detailsItem.category}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDetailsItem(null)}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Close
              </button>
            </div>

            {getImageUrl(detailsItem.images) && (
              <img
                src={getImageUrl(detailsItem.images)}
                alt={detailsItem.itemName}
                className="mt-4 h-56 w-full rounded-xl object-cover"
              />
            )}

            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {detailsItem.description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">Price</p>
                <p className="mt-1 font-semibold">৳{detailsItem.price}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className="mt-1 font-semibold capitalize">
                  {detailsItem.status}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Vendor</p>
                <p className="mt-1 font-semibold">
                  {detailsItem.vendor?.businessName ||
                    detailsItem.vendor?.name ||
                    "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="mt-1 font-semibold">
                  {detailsItem.area || ""}{detailsItem.area && detailsItem.city ? ", " : ""}{detailsItem.city || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
