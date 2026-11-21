
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import { Loader2, RefreshCw, ChartNoAxesCombined } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

type CountItem = {
  role?: string;
  status?: string;
  count: number;
};

type MonthlyTransaction = {
  month: string;
  totalTransactions: number;
  paidTransactions: number;
  failedTransactions: number;
};

type AnalyticsData = {
  userDistribution: CountItem[];
  menuStatusDistribution: CountItem[];
  orderStatusDistribution: CountItem[];
  monthlyTransactions: MonthlyTransaction[];
};

type AnalyticsResponse = {
  success: boolean;
  data: AnalyticsData;
};

const COLORS = [
  "#EA580C",
  "#16A34A",
  "#2563EB",
  "#9333EA",
  "#D97706",
];

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ChartEmptyState() {
  return (
    <div className="flex h-full min-h-60 flex-col items-center justify-center text-center">
      <ChartNoAxesCombined className="h-9 w-9 text-gray-300" />
      <p className="mt-3 text-sm font-medium text-gray-600">
        No data available yet
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Chart data will appear as the platform receives activity.
      </p>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function AdminAnalyticsCharts() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await apiFetch<AnalyticsResponse>(
        "/api/admin/dashboard/analytics"
      );

      setAnalytics(result.data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load analytics.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchInitialAnalytics = async () => {
      try {
        const result = await apiFetch<AnalyticsResponse>(
          "/api/admin/dashboard/analytics"
        );

        if (!cancelled) {
          setAnalytics(result.data);
        }
      } catch (err) {
        if (cancelled) return;

        const message =
          err instanceof Error
            ? err.message
            : "Unable to load analytics.";

        setError(message);
        toast.error(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchInitialAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading && !analytics) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">{error}</p>
        <Button
          variant="outline"
          onClick={loadAnalytics}
          className="mt-4"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  const userData = (analytics?.userDistribution || []).map((item) => ({
    name: formatLabel(item.role || "unknown"),
    count: item.count,
  }));

  const menuData = (analytics?.menuStatusDistribution || []).map(
    (item) => ({
      name: formatLabel(item.status || "unknown"),
      count: item.count,
    })
  );

  const orderData = (analytics?.orderStatusDistribution || []).map(
    (item) => ({
      status: formatLabel(item.status || "unknown"),
      count: item.count,
    })
  );

  const monthlyData = analytics?.monthlyTransactions || [];

  const hasUsers = userData.some((item) => item.count > 0);
  const hasMenuItems = menuData.some((item) => item.count > 0);
  const hasOrders = orderData.some((item) => item.count > 0);
  const hasTransactions = monthlyData.some(
    (item) => item.totalTransactions > 0
  );

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Analytics & Reports
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Visual overview of users, menu items, orders and payments.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadAnalytics}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh Charts
        </Button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        {/* User distribution */}
        <ChartCard
          title="User Distribution"
          description="Registered accounts grouped by role."
        >
          <div className="h-[280px] w-full">
            {hasUsers ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="48%"
                    innerRadius={62}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {userData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmptyState />
            )}
          </div>
        </ChartCard>

        {/* Menu status */}
        <ChartCard
          title="Menu Item Status"
          description="Distribution of submitted menu items."
        >
          <div className="h-[280px] w-full">
            {hasMenuItems ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={menuData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="48%"
                    innerRadius={62}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {menuData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmptyState />
            )}
          </div>
        </ChartCard>

        {/* Order status */}
        <ChartCard
          title="Order Status"
          description="Customer orders grouped by current status."
        >
          <div className="h-[280px] w-full">
            {hasOrders ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orderData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    name="Orders"
                    fill="#EA580C"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmptyState />
            )}
          </div>
        </ChartCard>

        {/* Monthly transactions */}
        <ChartCard
          title="Monthly Transactions"
          description="Subscription payment activity over the last six months."
        >
          <div className="h-[280px] w-full">
            {hasTransactions ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 10, right: 15, left: -15, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="totalTransactions"
                    name="Total"
                    stroke="#EA580C"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="paidTransactions"
                    name="Paid"
                    stroke="#16A34A"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="failedTransactions"
                    name="Failed"
                    stroke="#DC2626"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmptyState />
            )}
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
