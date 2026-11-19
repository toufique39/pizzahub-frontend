"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Pizza, Store } from "lucide-react";

import type { MenuItem } from "../types/menu.types";
import OrderForm from "@/features/orders/components/order-form";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface MenuDetailsResponse {
  success: boolean;
  data: MenuItem;
}

interface MenuItemDetailsProps {
  itemId: string;
  userRole: string;
}

function getImageUrl(image: string | { url?: string }) {
  return typeof image === "string" ? image : image.url || "";
}

export default function MenuItemDetails({
  itemId,
  userRole,
}: MenuItemDetailsProps) {
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/menu-items/${itemId}`,
          { signal: controller.signal }
        );

        const result: MenuDetailsResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Menu item not found or unavailable.");
        }

        setItem(result.data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Menu details error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load menu details."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchItem();

    return () => controller.abort();
  }, [itemId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffaf3] px-5 py-16">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-40 rounded bg-orange-100" />

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="h-96 rounded-3xl bg-orange-100" />
            <div className="h-96 rounded-3xl bg-orange-100" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fffaf3] px-5">
        <div className="max-w-md text-center">
          <Pizza className="mx-auto size-16 text-orange-300" />

          <h1 className="mt-5 text-2xl font-extrabold text-[#321b16]">
            Menu Item Unavailable
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            {error || "This menu item could not be found."}
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-flex rounded-full bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700"
          >
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  const images = (item.images || [])
    .map(getImageUrl)
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#fffaf3] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">

        <Link
          href="/menu"
          className="inline-flex items-center gap-2 font-semibold text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </Link>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-2">

          {/* Item Information */}
          <section>
            {/* Main Image */}
            <div className="overflow-hidden rounded-3xl bg-orange-100">
              {images[0] ? (
                <img
                  src={images[0]}
                  alt={item.itemName}
                  className="h-[380px] w-full object-cover sm:h-[480px]"
                />
              ) : (
                <div className="flex h-[380px] items-center justify-center">
                  <Pizza className="size-24 text-orange-300" />
                </div>
              )}
            </div>

            {/* Other Images */}
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.slice(1).map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${item.itemName} image ${index + 2}`}
                    className="h-28 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            )}

            <div className="mt-7">
              <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-bold text-orange-700">
                {item.category}
              </span>

              <h1 className="mt-5 text-3xl font-extrabold text-[#321b16] sm:text-4xl">
                {item.itemName}
              </h1>

              <p className="mt-4 leading-8 text-gray-600">
                {item.description}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-orange-100 pt-6">
                <span className="text-sm font-semibold text-gray-500">
                  Item Price
                </span>

                <span className="text-3xl font-extrabold text-orange-600">
                  ৳{Number(item.price).toLocaleString("en-BD")}
                </span>
              </div>

              <div className="mt-6 rounded-2xl border border-orange-100 bg-white p-5">
                <h2 className="flex items-center gap-2 font-bold text-[#321b16]">
                  <Store className="text-orange-600" size={20} />
                  Restaurant Information
                </h2>

                <p className="mt-4 font-semibold text-gray-800">
                  {item.vendor?.businessName ||
                    item.vendor?.name ||
                    "Local Restaurant"}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} className="shrink-0 text-orange-600" />
                  {[
                    item.location?.area || item.area,
                    item.location?.city || item.city,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Location unavailable"}
                </p>
              </div>
            </div>
          </section>

          {/* Order Form */}
          <section className="lg:sticky lg:top-28">
            <OrderForm
              itemId={item._id}
              role={userRole}
            />
          </section>

        </div>
      </div>
    </main>
  );
}