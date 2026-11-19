import { authClient } from "@/lib/auth-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Use this helper for authenticated backend requests.
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Please sign in to continue.");
  }

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${data.token}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || `API request failed: ${response.status}`
    );
  }

  return result as T;
}