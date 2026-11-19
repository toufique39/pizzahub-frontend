"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Clock,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Utensils,
  Users,
} from "lucide-react";

import type { MenuItem } from "@/features/menu/types/menu.types";

const categories = [
  { name: "Classic Pizzas", icon: "🍕" },
  { name: "Vegetarian Pizzas", icon: "🥦" },
  { name: "Meat Lovers", icon: "🍗" },
  { name: "Specialty / Gourmet Pizzas", icon: "⭐" },
  { name: "Sides & Appetizers", icon: "🍟" },
  { name: "Beverages & Desserts", icon: "🥤" },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted Local Restaurants",
    description:
      "Discover menu items from local restaurant partners.",
  },
  {
    icon: Clock,
    title: "Easy Ordering",
    description:
      "Explore menus and submit your order in just a few steps.",
  },
  {
    icon: Users,
    title: "Multiple Choices",
    description:
      "Find different pizza styles, sides and beverages in one place.",
  },
];

const steps = [
  {
    number: "01",
    icon: Utensils,
    title: "Explore the Menu",
    description: "Browse pizzas and discover local restaurant menus.",
  },
  {
    number: "02",
    icon: ShoppingBag,
    title: "Place Your Order",
    description: "Choose an item and provide your delivery details.",
  },
  {
    number: "03",
    icon: Truck,
    title: "Track Your Order",
    description: "Follow your order as the restaurant updates its status.",
  },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80";

function getItemImage(item: MenuItem) {
  const firstImage = item.images?.[0];

  if (typeof firstImage === "string") {
    return firstImage;
  }

  return firstImage?.url || fallbackImage;
}

// HERO SECTION
export function HeroSection() {
  return (
    <section
      className="relative isolate overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(45,12,8,.94), rgba(45,12,8,.72), rgba(45,12,8,.25)), url('${fallbackImage}')`,
      }}
    >
      <div className="mx-auto flex min-h-[520px] w-full max-w-7xl items-center px-4 py-16 sm:min-h-[580px] sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-2xl text-white"
        >
          <span className="inline-flex max-w-full rounded-full border border-orange-300/40 bg-orange-500/20 px-3 py-2 text-xs font-semibold text-orange-200 sm:px-4 sm:text-sm">
            Fresh flavors, delivered with care 🍕
          </span>

          <h1 className="mt-6 text-3xl leading-tight font-extrabold sm:mt-7 sm:text-5xl md:text-6xl">
            Hot & Fresh Pizza
            <span className="block text-orange-400">
              Delivered to Your Door
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-orange-50/90 sm:mt-6 sm:text-lg sm:leading-8">
            Discover local pizza restaurants, explore delicious
            menus, and enjoy a simple ordering experience with PizzaHub.
          </p>

          <Link
            href="/menu"
            className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-orange-500 px-7 py-4 font-bold text-white shadow-lg transition hover:bg-orange-600 sm:mt-9 sm:w-auto"
          >
            Explore Pizza Menu
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// FEATURED MENU SECTION
export function FeaturedMenuSection({
  items,
}: {
  items: MenuItem[];
}) {
  return (
    <section className="bg-[#fffaf3] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold tracking-wider text-orange-600 uppercase">
              Taste something special
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-[#321b16] sm:text-3xl md:text-4xl">
              Featured Menu Items
            </h2>

            <p className="mt-3 text-sm text-gray-600 sm:text-base">
              Discover delicious picks from our local restaurant partners.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 self-start font-bold text-orange-600 hover:text-orange-700 sm:self-auto"
          >
            Browse All <ArrowRight size={18} />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
            <span className="text-4xl sm:text-5xl">🍕</span>

            <h3 className="mt-4 text-lg font-bold text-[#321b16] sm:mt-5 sm:text-xl">
              Delicious pizzas are coming soon!
            </h3>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Our restaurant partners havent published any approved
              menu items yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {items.map((item, index) => {
              const imageUrl = getItemImage(item);

              return (
                <motion.article
                  key={item._id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    role="img"
                    aria-label={item.itemName}
                    className="h-48 bg-cover bg-center transition duration-500 group-hover:scale-105 sm:h-56"
                    style={{
                      backgroundImage: `url("${imageUrl}")`,
                    }}
                  />

                  <div className="flex flex-1 flex-col p-5">
                    <span className="self-start rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                      {item.category}
                    </span>

                    <h3 className="mt-4 text-lg font-bold text-[#321b16] sm:text-xl">
                      {item.itemName}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={15} className="shrink-0 text-orange-600" />
                      <span className="truncate">
                        {[
                          item.location?.area || item.area,
                          item.location?.city || item.city,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Location unavailable"}
                      </span>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      By{" "}
                      <span className="font-semibold text-[#321b16]">
                        {item.vendor?.businessName ||
                          item.vendor?.name ||
                          "Local Restaurant"}
                      </span>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 pt-4">
                      <span className="text-lg font-extrabold text-orange-600 sm:text-xl">
                        ৳{Number(item.price).toLocaleString("en-BD")}
                      </span>

                      <Link
                        href={`/menu/${item._id}`}
                        className="rounded-full bg-[#321b16] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// CATEGORY SECTION
export function CategoriesSection() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wider text-orange-600 uppercase">
            Find your favorite
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-[#321b16] sm:text-3xl md:text-4xl">
            Explore Pizza Categories
          </h2>

          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Something delicious for every craving.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
            >
              <Link
                href={`/menu?category=${encodeURIComponent(category.name)}`}
                className="flex h-full items-center gap-4 rounded-2xl border border-orange-100 bg-[#fffaf3] p-5 transition hover:border-orange-300 hover:bg-orange-50 hover:shadow-md sm:gap-5 sm:p-6"
              >
                <span className="text-3xl sm:text-4xl">{category.icon}</span>

                <div className="min-w-0">
                  <h3 className="font-bold text-[#321b16]">
                    {category.name}
                  </h3>

                  <span className="mt-1 inline-flex items-center gap-1 text-sm text-orange-600">
                    Explore <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// WHY CHOOSE PIZZAHUB SECTION
export function WhyChooseSection() {
  return (
    <section className="bg-[#fff3e6] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wider text-orange-600 uppercase">
            The PizzaHub difference
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-[#321b16] sm:text-3xl md:text-4xl">
            Why Choose PizzaHub?
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            We make it easier to discover local restaurants,
            explore their menus, and manage your food orders.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm sm:p-7"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 sm:size-14">
                  <Icon size={26} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#321b16] sm:mt-6 sm:text-xl">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// HOW IT WORKS SECTION
export function HowItWorksSection() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wider text-orange-600 uppercase">
            Simple and convenient
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-[#321b16] sm:text-3xl md:text-4xl">
            How PizzaHub Works
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-2xl bg-[#fffaf3] p-6 text-center sm:p-8"
              >
                <span className="absolute top-4 right-4 text-3xl font-black text-orange-100 sm:top-5 sm:right-5 sm:text-4xl">
                  {step.number}
                </span>

                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-orange-500 text-white sm:size-16">
                  <Icon size={26} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#321b16] sm:mt-6 sm:text-xl">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}