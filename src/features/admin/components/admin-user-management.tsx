
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  ShieldCheck,
  ShieldBan,
  Loader2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "admin" | "vendor" | "customer";
  isBlocked?: boolean;
  businessName?: string;
  subscriptionPlan?: string;
  createdAt?: string;
};

type UsersResponse = {
  success: boolean;
  data: AdminUser[];
  pagination: {
    totalUsers: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
};

type ApiResponse = {
  success: boolean;
  message: string;
};

export default function AdminUserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [role, setRole] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        search: activeSearch,
        role,
        page: String(page),
        limit: "10",
      });

      const result = await apiFetch<UsersResponse>(
        `/api/admin/users?${params.toString()}`
      );

      setUsers(result.data || []);
      setTotalUsers(result.pagination?.totalUsers || 0);
      setTotalPages(Math.max(1, result.pagination?.totalPages || 1));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  }, [activeSearch, role, page]);

  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      try {
        const params = new URLSearchParams({
          search: activeSearch,
          role,
          page: String(page),
          limit: "10",
        });

        const result = await apiFetch<UsersResponse>(
          `/api/admin/users?${params.toString()}`
        );

        if (!cancelled) {
          setUsers(result.data || []);
          setTotalUsers(result.pagination?.totalUsers || 0);
          setTotalPages(Math.max(1, result.pagination?.totalPages || 1));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load users."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [activeSearch, role, page]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setPage(1);
    setActiveSearch(searchInput.trim());
  };

  const handleRoleChange = (value: string) => {
    setLoading(true);
    setError("");
    setRole(value);
    setPage(1);
  };

  const handleBlockToggle = async (user: AdminUser) => {
    const nextBlockedStatus = !user.isBlocked;

    try {
      setBusyUserId(user._id);

      const result = await apiFetch<ApiResponse>(
        `/api/admin/users/${user._id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isBlocked: nextBlockedStatus,
          }),
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser._id === user._id
            ? { ...currentUser, isBlocked: nextBlockedStatus }
            : currentUser
        )
      );

      toast.success(
        result.message ||
          (nextBlockedStatus
            ? "User blocked successfully."
            : "User unblocked successfully.")
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to update user."
      );
    } finally {
      setBusyUserId(null);
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const roleClass = (userRole: AdminUser["role"]) => {
    const classes = {
      admin: "bg-purple-100 text-purple-700",
      vendor: "bg-orange-100 text-orange-700",
      customer: "bg-blue-100 text-blue-700",
    };

    return classes[userRole];
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
            Manage Users
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View, search and manage PizzaHub accounts.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadUsers}
          disabled={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Total users */}
      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="rounded-xl bg-orange-100 p-3">
          <Users className="h-6 w-6 text-orange-600" />
        </div>

        <div>
          <p className="text-sm text-gray-500">Total Registered Users</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalUsers}
          </p>
        </div>
      </div>

      {/* Search and role filter */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <select
          value={role}
          onChange={(event) => handleRoleChange(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="vendor">Vendor</option>
          <option value="customer">Customer</option>
        </select>

        <Button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <Button
            variant="outline"
            size="sm"
            className="ml-3"
            onClick={loadUsers}
          >
            Retry
          </Button>
        </div>
      )}

      {/* User table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-bold text-gray-900">All Users</h2>
          <p className="mt-1 text-xs text-gray-500">
            Showing {users.length} of {totalUsers} accounts
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="mx-auto h-10 w-10 text-gray-300" />
            <h3 className="mt-3 font-semibold text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try another search or role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Subscription</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((user) => {
                  const isBusy = busyUserId === user._id;

                  return (
                    <tr key={user._id} className="hover:bg-gray-50/70">
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>

                            {user.businessName && (
                              <p className="mt-1 text-xs text-orange-600">
                                {user.businessName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleClass(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Subscription */}
                      <td className="px-5 py-4">
                        {user.role === "vendor" ? (
                          <span className="font-medium capitalize text-gray-700">
                            {user.subscriptionPlan || "Free"}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Account status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isBlocked
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isBusy}
                          onClick={() => handleBlockToggle(user)}
                          className={
                            user.isBlocked
                              ? "border-green-200 text-green-700 hover:bg-green-50"
                              : "border-red-200 text-red-600 hover:bg-red-50"
                          }
                        >
                          {isBusy ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : user.isBlocked ? (
                            <ShieldCheck className="mr-2 h-4 w-4" />
                          ) : (
                            <ShieldBan className="mr-2 h-4 w-4" />
                          )}

                          {user.isBlocked ? "Unblock" : "Block"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalUsers > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-5 py-4">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
