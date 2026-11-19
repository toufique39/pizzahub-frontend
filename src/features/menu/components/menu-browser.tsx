"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Pizza,
} from "lucide-react";

import type { MenuItem } from "../types/menu.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface MenuResponse {
  success: boolean;
  data: MenuItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

const fallbackImage =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80";

function getItemImage(item: MenuItem) {
  const image = item.images?.[0];

  if (typeof image === "string") {
    return image;
  }

  return image?.url || fallbackImage;
}

export default function MenuBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [sort, setSort] = useState("latest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Category links from the homepage are reflected in the URL.
  const category = searchParams.get("category") || "";
  const debouncedCity = useDebouncedValue(city, 350);
  const debouncedArea = useDebouncedValue(area, 350);

  const updateCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    setLoading(true);
    setPage(1);
    router.replace(`/menu?${params.toString()}`, { scroll: false });
  };

  const fetchMenuItems = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const params = new URLSearchParams();

        if (search.trim()) params.set("search", search.trim());
        if (category) params.set("category", category);
        if (debouncedCity.trim()) params.set("city", debouncedCity.trim());
        if (debouncedArea.trim()) params.set("area", debouncedArea.trim());

        params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", "9");

        const response = await fetch(
          `${API_URL}/api/menu-items?${params.toString()}`,
          { signal }
        );

        if (!response.ok) {
          throw new Error("Unable to load menu items.");
        }

        const result: MenuResponse = await response.json();

        setItems(result.data || []);
        setTotalPages(result.pagination?.totalPages || 1);
        setTotalItems(result.pagination?.totalItems || 0);
        setError("");
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Menu loading error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [search, category, debouncedCity, debouncedArea, sort, page]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchMenuItems(controller.signal);

    return () => controller.abort();
  }, [fetchMenuItems]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setPage(1);
    setSearch(searchInput);
  };

  const clearFilters = () => {
    setLoading(true);
    setSearchInput("");
    setSearch("");
    setCity("");
    setArea("");
    setSort("latest");
    setPage(1);

    router.replace("/menu", { scroll: false });
  };

  const retry = () => {
    setLoading(true);
    fetchMenuItems();
  };

  return (
    <main className="min-h-screen bg-[#fffaf3]">

      {/* Page Hero */}
      <section className="bg-gradient-to-r from-[#521b13] to-[#a93818] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-semibold tracking-wider text-orange-300 uppercase">
            Discover delicious choices
          </p>

          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
            Explore Our Menu 🍕
          </h1>

          <p className="mt-4 max-w-xl leading-7 text-orange-100">
            Find your favorite pizzas, discover local restaurants,
            and explore something delicious for every craving.
          </p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-400" />

            <Input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Search pizza by name..."
              className="h-12 rounded-xl border-orange-200 bg-white pl-12"
            />
          </div>

          <Button
            type="submit"
            className="h-12 rounded-xl bg-orange-600 px-8 font-bold text-white hover:bg-orange-700"
          >
            Search
          </Button>
        </form>

        {/* Filters */}
        <div className="mt-7 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-orange-600" />

            <h2 className="font-bold text-[#321b16]">
              Filter & Sort
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category
              </label>

              <select
                value={category}
                onChange={(event) => updateCategory(event.target.value)}
                className="h-11 w-full rounded-lg border border-orange-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                City
              </label>

              <Input
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  setPage(1);
                }}
                placeholder="e.g. Dhaka"
                className="h-11"
              />
            </div>

            {/* Area */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Area
              </label>

              <Input
                value={area}
                onChange={(event) => {
                  setArea(event.target.value);
                  setPage(1);
                }}
                placeholder="e.g. Mirpur"
                className="h-11"
              />
            </div>

            {/* Sorting */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <ArrowUpDown size={15} />
                Sort By
              </label>

              <select
                value={sort}
                onChange={(event) => {
                  setLoading(true);
                  setSort(event.target.value);
                  setPage(1);
                }}
                className="h-11 w-full rounded-lg border border-orange-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="latest">Latest Items</option>
                <option value="price_asc">
                  Price: Low to High
                </option>
                <option value="price_desc">
                  Price: High to Low
                </option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="my-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-[#321b16]">
              Our Menu
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {loading ? "Finding delicious items..." : `${totalItems} items found`}
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-semibold text-red-600">{error}</p>

            <Button
              onClick={retry}
              className="mt-5 bg-orange-600 hover:bg-orange-700"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-56 bg-orange-100" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 rounded bg-orange-100" />
                  <div className="h-6 w-3/4 rounded bg-orange-100" />
                  <div className="h-4 w-full rounded bg-orange-100" />
                  <div className="h-10 rounded bg-orange-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-6 py-20 text-center">
            <Pizza className="mx-auto size-16 text-orange-300" />

            <h3 className="mt-5 text-2xl font-extrabold text-[#321b16]">
              No Menu Items Found
            </h3>

            <p className="mt-3 text-gray-500">
              Try changing your search or filters to discover more choices.
            </p>

            <Button
              onClick={clearFilters}
              className="mt-6 bg-orange-600 hover:bg-orange-700"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Menu Cards */}
        {!loading && !error && items.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item._id}
                className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="h-56 bg-cover bg-center transition duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${getItemImage(item)}")`,
                  }}
                />

                <div className="p-5">

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                    {item.category}
                  </span>

                  <h3 className="mt-4 text-xl font-extrabold text-[#321b16]">
                    {item.itemName}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={15} className="text-orange-600" />

                    {[
                      item.location?.area || item.area,
                      item.location?.city || item.city,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Location unavailable"}
                  </div>

                  <p className="mt-3 text-sm text-gray-600">
                    By{" "}
                    <span className="font-semibold text-[#321b16]">
                      {item.vendor?.businessName ||
                        item.vendor?.name ||
                        "Local Restaurant"}
                    </span>
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-orange-100 pt-4">
                    <span className="text-xl font-extrabold text-orange-600">
                      ৳{Number(item.price).toLocaleString("en-BD")}
                    </span>

                    <Link
                      href={`/menu/${item._id}`}
                      className="rounded-full bg-[#321b16] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalItems > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-5">

            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => {
                setLoading(true);
                setPage((previous) => previous - 1);
              }}
              className="rounded-full"
            >
              <ChevronLeft size={17} />
              Previous
            </Button>

            <span className="text-sm font-semibold text-gray-600">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => {
                setLoading(true);
                setPage((previous) => previous + 1);
              }}
              className="rounded-full"
            >
              Next
              <ChevronRight size={17} />
            </Button>

          </div>
        )}
      </section>
    </main>
  );
}