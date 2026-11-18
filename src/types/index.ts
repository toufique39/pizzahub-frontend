/**
 * Cross-cutting types shared by more than one feature.
 * Feature-specific types belong in `src/features/<feature>/types.ts`.
 */

export type Role = "customer" | "vendor" | "admin";

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}
