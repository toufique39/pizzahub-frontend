"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  signInSchema,
  type SignInFormValues,
} from "../schemas/sign-in.schema";
import { getDashboardPath } from "@/utils/role-redirect";

export default function SignInForm() {
  const router = useRouter();

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message || "Unable to sign in.");
        return;
      }

      toast.success("Welcome back to PizzaHub!");

      const role = data?.user?.role || "customer";

      router.replace(getDashboardPath(role));
      router.refresh();
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/callback",
      });

      if (error) {
        toast.error(error.message || "Google sign in failed.");
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Unable to sign in with Google.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-5">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Email Address
          </label>

          <Input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="h-10"
            {...register("email")}
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Password
          </label>

          <Input
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            className="h-10"
            {...register("password")}
          />

          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || isGoogleLoading}
          className="h-11 w-full bg-orange-600 text-white hover:bg-orange-700"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>

      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">
          OR CONTINUE WITH
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full"
        disabled={isGoogleLoading || isSubmitting}
        onClick={handleGoogleSignIn}
      >
        <span className="font-bold text-blue-600">G</span>

        {isGoogleLoading
          ? "Connecting to Google..."
          : "Continue with Google"}
      </Button>

      {/* Signup Link */}
      <p className="text-center text-sm text-muted-foreground">
        Dont have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-orange-600 hover:underline"
        >
          Create Account
        </Link>
      </p>

    </div>
  );
}