
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  Loader2,
  ReceiptText,
  Store,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

type Transaction = {
  _id: string;
  vendorId: string;
  plan: string;
  amount: number;
  currency?: string;
  status: string;
  createdAt?: string;
  vendor?: {
    name?: string;
    email?: string;
    image?: string;
    businessName?: string;
  } | null;
};

type TransactionsResponse = {
  success: boolean;
  data: Transaction[];
  pagination: {
    totalTransactions: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
};

const statusOptions = [
  "all",
  "paid",
  "pending",
  "failed",
  "cancelled",
];

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
    case "succeeded":
    case "successful":
      return "bg-green-100 text-green-700";

    case "pending":
    case "processing":
      return "bg-amber-100 text-amber-700";

    case "failed":
    case "canceled":
    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatDate(value?: string) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatAmount(amount: number, currency?: string) {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "N/A";

  const code = (currency || "BDT").toUpperCase();

  return `${value.toLocaleString("en-BD")} ${code}`;
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const result = await apiFetch<TransactionsResponse>(
        `/api/admin/transactions?${params.toString()}`
      );

      setTransactions(result.data || []);
      setTotalTransactions(
        result.pagination?.totalTransactions || 0
      );
      setTotalPages(
        Math.max(1, result.pagination?.totalPages || 1)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTransactions();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadTransactions]);

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
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
            Transactions
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review vendor subscription payment history.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadTransactions}
          disabled={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Total transactions */}
      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="rounded-xl bg-green-100 p-3">
          <ReceiptText className="h-6 w-6 text-green-600" />
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Total Transactions
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {totalTransactions.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="font-bold text-gray-900">
            Payment History
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Vendor premium subscription transactions.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(event) => handleStatusFilter(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status === "all"
                ? "All Statuses"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}

          <Button
            size="sm"
            variant="outline"
            className="ml-3"
            onClick={loadTransactions}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Transaction list */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <ReceiptText className="mx-auto h-10 w-10 text-gray-300" />

            <h3 className="mt-3 font-semibold text-gray-900">
              No transactions found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Subscription payment records will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Vendor</th>
                  <th className="px-5 py-4">Plan</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Payment Status</th>
                  <th className="px-5 py-4">Transaction Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-gray-50/70"
                  >
                    {/* Vendor */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {transaction.vendor?.image ? (
                          <img
                            src={transaction.vendor.image}
                            alt={transaction.vendor.name || "Vendor"}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                            <Store className="h-5 w-5 text-orange-600" />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-gray-900">
                            {transaction.vendor?.businessName ||
                              transaction.vendor?.name ||
                              "Unknown Vendor"}
                          </p>

                          <p className="text-xs text-gray-500">
                            {transaction.vendor?.email || "Email unavailable"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-5 py-4">
                      <span className="font-semibold capitalize text-gray-800">
                        {transaction.plan}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatAmount(
                        transaction.amount,
                        transaction.currency
                      )}
                    </td>

                    {/* Payment status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        {formatDate(transaction.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalTransactions > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages} · {totalTransactions} transactions
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

      {/* Read-only notice */}
      <p className="text-xs text-gray-500">
        Transaction records are read-only. Payment status can only be
        updated through verified payment events handled by the backend.
      </p>
    </div>
  );
}
