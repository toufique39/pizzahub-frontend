
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Pizza,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

type MenuItem = {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  area?: string;
  city?: string;
  location?: {
    area?: string;
    city?: string;
  };
  images?: (string | { url?: string })[];
  status: "pending" | "approved" | "rejected" | "inactive";
  isAvailable: boolean;
};

type MenuItemsResponse = {
  success: boolean;
  data: MenuItem[];
  pagination?: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
};

type EditFields = {
  itemName: string;
  category: string;
  description: string;
  price: string;
  area: string;
  city: string;
};

const filters = ["all", "pending", "approved", "rejected", "inactive"];

function getImageUrl(images?: MenuItem["images"]) {
  const image = images?.[0];

  if (!image) return "";

  return typeof image === "string" ? image : image.url || "";
}

function statusClass(status: MenuItem["status"]) {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    inactive: "bg-gray-100 text-gray-700",
  };

  return styles[status];
}

export default function MyMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editFields, setEditFields] = useState<EditFields>({
    itemName: "",
    category: "",
    description: "",
    price: "",
    area: "",
    city: "",
  });
  const [newImage, setNewImage] = useState<File | null>(null);

  const loadItems = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "12",
      });

      if (filter !== "all") {
        params.set("status", filter);
      }

      const result = await apiFetch<MenuItemsResponse>(
        `/api/vendor/menu-items?${params.toString()}`
      );

      setItems(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotalItems(result.pagination?.totalItems || 0);
      setError("");

      // The last item on a page may have been deleted.
      if (result.data.length === 0 && page > 1) {
        setPage((current) => Math.max(1, current - 1));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load menu items."
      );
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  const refreshItems = () => {
    setLoading(true);
    loadItems();
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadItems();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadItems]);

  const startEditing = (item: MenuItem) => {
    setEditingItem(item);
    setNewImage(null);

    setEditFields({
      itemName: item.itemName,
      category: item.category,
      description: item.description,
      price: String(item.price),
      area: item.area || item.location?.area || "",
      city: item.city || item.location?.city || "",
    });
  };

  const closeEditor = () => {
    setEditingItem(null);
    setNewImage(null);
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingItem) return;

    try {
      setBusyId(editingItem._id);

      const formData = new FormData();

      Object.entries(editFields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (newImage) {
        formData.append("image", newImage);
      }

      const result = await apiFetch<{ message: string }>(
        `/api/vendor/menu-items/${editingItem._id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      toast.success(result.message || "Menu item updated.");
      closeEditor();
      await loadItems();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to update item."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.itemName}"?`
    );

    if (!confirmed) return;

    try {
      setBusyId(item._id);

      const result = await apiFetch<{ message: string }>(
        `/api/vendor/menu-items/${item._id}`,
        { method: "DELETE" }
      );

      toast.success(result.message || "Menu item deleted.");
      await loadItems();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to delete item."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleAvailability = async (item: MenuItem) => {
    try {
      setBusyId(item._id);

      await apiFetch(
        `/api/vendor/menu-items/${item._id}/availability`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isAvailable: !item.isAvailable,
          }),
        }
      );

      toast.success(
        item.isAvailable ? "Item deactivated." : "Item activated."
      );

      await loadItems();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to update availability."
      );
    } finally {
      setBusyId(null);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-orange-600">
            Menu Management
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            My Menu Items
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your submitted pizzas and their availability.
          </p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            variant="outline"
            onClick={refreshItems}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            render={<Link href="/vendor/dashboard/add-menu-item" />}
            nativeButton={false}
            className="flex-1 bg-orange-600 hover:bg-orange-700 sm:flex-none"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Status filters */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setLoading(true);
              setFilter(value);
              setPage(1);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize ${
              filter === value
                ? "bg-orange-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-orange-300"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <Button onClick={refreshItems} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <Pizza className="mx-auto h-10 w-10 text-gray-300" />
          <h3 className="mt-3 font-semibold text-gray-900">
            No menu items found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first pizza to get started.
          </p>
          <Button
            render={<Link href="/vendor/dashboard/add-menu-item" />}
            nativeButton={false}
            className="mt-4 bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const imageUrl = getImageUrl(item.images);
            const isBusy = busyId === item._id;

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
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-sm text-gray-600">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-orange-600">
                      ৳{item.price}
                    </span>
                    <span className="max-w-[55%] truncate text-gray-500">
                      {[item.area || item.location?.area, item.city || item.location?.city]
                        .filter(Boolean)
                        .join(", ") || "Location unavailable"}
                    </span>
                  </div>

                  {item.status === "approved" && (
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-sm text-gray-600">
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleAvailability(item)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          item.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {isBusy
                          ? "Updating..."
                          : item.isAvailable
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                    </div>
                  )}

                  {item.status === "rejected" && (
                    <p className="text-xs text-red-600">
                      This item was rejected and is not visible to customers.
                    </p>
                  )}

                  <div className="flex gap-2 border-t border-gray-100 pt-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      disabled={isBusy}
                      onClick={() => startEditing(item)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      disabled={isBusy}
                      onClick={() => handleDelete(item)}
                    >
                      {isBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalItems > 0 && totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages} · {totalItems} items
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

      {/* Edit form */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center">
          <form
            onSubmit={handleUpdate}
            className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl space-y-4 overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
          >
            <div className="sticky top-0 -mx-5 flex items-center justify-between bg-white px-5 pb-3 sm:-mx-6 sm:px-6">
              <h2 className="text-xl font-bold text-gray-900">
                Edit Menu Item
              </h2>
              <button
                type="button"
                onClick={closeEditor}
                aria-label="Close edit form"
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {(
              [
                ["itemName", "Item Name"],
                ["category", "Category"],
                ["description", "Description"],
                ["price", "Price"],
                ["area", "Area"],
                ["city", "City"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="text-sm font-medium text-gray-700">
                  {label}
                </label>

                {key === "description" ? (
                  <textarea
                    required
                    rows={3}
                    className={inputClass}
                    value={editFields[key]}
                    onChange={(e) =>
                      setEditFields((current) => ({
                        ...current,
                        [key]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <input
                    required
                    type={key === "price" ? "number" : "text"}
                    min={key === "price" ? "1" : undefined}
                    step={key === "price" ? "0.01" : undefined}
                    className={inputClass}
                    value={editFields[key]}
                    onChange={(e) =>
                      setEditFields((current) => ({
                        ...current,
                        [key]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            ))}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Replace Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;

                  if (file && !file.type.startsWith("image/")) {
                    toast.error("Please select a valid image.");
                    e.target.value = "";
                    return;
                  }

                  if (file && file.size > 5 * 1024 * 1024) {
                    toast.error("Image size must be less than 5 MB.");
                    e.target.value = "";
                    return;
                  }

                  setNewImage(file);
                }}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeEditor}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={busyId === editingItem._id}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {busyId === editingItem._id && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
