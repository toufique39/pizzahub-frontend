import type { Role } from "@/types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload extends SignInPayload {
  name: string;
  role: Role;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}
