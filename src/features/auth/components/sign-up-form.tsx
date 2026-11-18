"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  signUpSchema,
  type SignUpFormValues,
} from "../schemas/sign-up.schema";
import { useState } from "react";

export default function SignUpForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
      role: "customer",
    },
  });
const [isGoogleLoading, setIsGoogleLoading] = useState(false);

const selectedRole = watch("role");

const handleGoogleSignUp = async () => {
  try {
    setIsGoogleLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      additionalData: {
        role: selectedRole,
      },
    });

    if (error) {
      toast.error(error.message || "Google registration failed.");
      setIsGoogleLoading(false);
    }
  } catch (error) {
    console.error("Google signup error:", error);

    toast.error("Unable to sign up with Google.");
    setIsGoogleLoading(false);
  }
};
  const onSubmit = async (values: SignUpFormValues) => {
    try {
      const { error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        image: values.image || undefined,
        role: values.role,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Your PizzaHub account was created successfully!");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Full Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Full Name
        </label>

        <Input
          placeholder="Enter your full name"
          {...register("name")}
        />

        {errors.name && (
          <p className="mt-1 text-xs text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Email Address
        </label>

        <Input
          type="email"
          placeholder="you@example.com"
          {...register("email")}
        />

        {errors.email && (
          <p className="mt-1 text-xs text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Profile Image */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Profile Image URL (Optional)
        </label>

        <Input
          type="url"
          placeholder="https://example.com/image.jpg"
          {...register("image")}
        />

        {errors.image && (
          <p className="mt-1 text-xs text-red-600">
            {errors.image.message}
          </p>
        )}
      </div>

      {/* Account Role */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Account Type
        </label>

        <select
          {...register("role")}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor (Restaurant Owner)</option>
        </select>

        {errors.role && (
          <p className="mt-1 text-xs text-red-600">
            {errors.role.message}
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
          placeholder="Create a password"
          {...register("password")}
        />

        {errors.password && (
          <p className="mt-1 text-xs text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Confirm Password
        </label>

        <Input
          type="password"
          placeholder="Confirm your password"
          {...register("confirmPassword")}
        />

        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-600 text-white hover:bg-orange-700"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>
      <div className="relative flex items-center py-2">
  <div className="flex-1 border-t" />
  <span className="px-3 text-xs text-muted-foreground">
    OR CONTINUE WITH
  </span>
  <div className="flex-1 border-t" />
</div>

<Button
  type="button"
  variant="outline"
  className="w-full"
  disabled={isGoogleLoading || isSubmitting}
  onClick={handleGoogleSignUp}
>
  <span className="font-bold text-blue-600">G</span>
  {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
</Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-orange-600 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}