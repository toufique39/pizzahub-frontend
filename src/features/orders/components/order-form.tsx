"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, MapPin, Phone, Loader2 } from "lucide-react";

import { apiFetch } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OrderResponse {
  success: boolean;
  message: string;
}

interface OrderFormProps {
  itemId: string;
  role: string;
}

function getTomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function OrderForm({
  itemId,
  role,
}: OrderFormProps) {
  const router = useRouter();

  const [deliveryDate, setDeliveryDate] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const minimumDate = getTomorrowDate();

  // Only customers can place orders
  if (role !== "customer") {
    return (
      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
        <h3 className="font-bold text-[#321b16]">
          Customer Ordering Only
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Only customer accounts can place pizza orders.
          Vendors and administrators cannot place customer orders.
        </p>
      </div>
    );
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!deliveryDate || !addressLine.trim() ||
        !area.trim() || !city.trim() || !phone.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (deliveryDate < minimumDate) {
      toast.error("Please select a future delivery date.");
      return;
    }

    try {
      setLoading(true);

      const result = await apiFetch<OrderResponse>(
        "/api/orders",
        {
          method: "POST",
          body: JSON.stringify({
            itemId,
            deliveryDate,
            deliveryAddress: {
              addressLine,
              area,
              city,
              phone,
            },
            message,
          }),
        }
      );

      if (!result.success) {
        throw new Error(result.message || "Order failed.");
      }

      toast.success("Your pizza order has been placed!");
      setSubmitted(true);
      router.refresh();
    } catch (error) {
      console.error("Order submission error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to place your order."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <h3 className="text-lg font-bold text-green-800">
          Order Placed Successfully!
        </h3>

        <p className="mt-2 text-sm leading-6 text-green-700">
          Your order is now pending. You can check its progress
          from your Customer Dashboard.
        </p>

        <Button
          className="mt-5 bg-orange-600 text-white hover:bg-orange-700"
          onClick={() => router.push("/customer/dashboard")}
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
    >
      <div>
        <h3 className="text-2xl font-extrabold text-[#321b16]">
          Place Your Order
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Provide your delivery information to continue.
        </p>
      </div>

      {/* Delivery Date */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <CalendarDays size={17} className="text-orange-600" />
          Delivery Date
        </label>

        <Input
          type="date"
          min={minimumDate}
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          required
          className="h-12"
        />
      </div>

      {/* Address */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <MapPin size={17} className="text-orange-600" />
          Delivery Address
        </label>

        <Input
          placeholder="House number, road or street"
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          required
          className="h-12"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Area
          </label>

          <Input
            placeholder="e.g. Dhanmondi"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            City
          </label>

          <Input
            placeholder="e.g. Dhaka"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="h-12"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Phone size={17} className="text-orange-600" />
          Contact Number
        </label>

        <Input
          type="tel"
          placeholder="Your contact number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="h-12"
        />
      </div>

      {/* Special Instructions */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Additional Message (Optional)
        </label>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Any special instructions..."
          className="w-full resize-y rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl bg-orange-600 font-bold text-white hover:bg-orange-700"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Placing Order...
          </>
        ) : (
          "Confirm Order"
        )}
      </Button>

      <p className="text-center text-xs text-gray-500">
        No online payment required for customer pizza orders.
      </p>
    </form>
  );
}