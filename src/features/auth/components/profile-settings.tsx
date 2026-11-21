
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  UserRound,
  Store,
  Mail,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Save,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import Image from "next/image";

type Profile = {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "vendor" | "customer";
  businessName?: string;
  subscriptionPlan?: string;
  isBlocked?: boolean;
};

type ProfileResponse = {
  success: boolean;
  data: Profile;
  message?: string;
};

export default function ProfileSettings() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [businessName, setBusinessName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    const result = await apiFetch<ProfileResponse>("/api/profile");
    return result.data;
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const user = await fetchProfile();

      setError("");
      setProfile(user);
      setName(user.name || "");
      setImage(user.image || "");
      setBusinessName(user.businessName || "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    let active = true;

    const initializeProfile = async () => {
      try {
        const user = await fetchProfile();

        if (active) {
          setError("");
          setProfile(user);
          setName(user.name || "");
          setImage(user.image || "");
          setBusinessName(user.businessName || "");
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your profile."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void initializeProfile();

    return () => {
      active = false;
    };
  }, [fetchProfile]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (name.trim().length < 2 || name.trim().length > 60) {
      toast.error("Name must be between 2 and 60 characters.");
      return;
    }

    if (image.trim()) {
      try {
        const url = new URL(image.trim());

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        toast.error("Please enter a valid profile image URL.");
        return;
      }
    }

    if (
      profile?.role === "vendor" &&
      businessName.trim() &&
      (businessName.trim().length < 2 ||
        businessName.trim().length > 80)
    ) {
      toast.error("Business name must be between 2 and 80 characters.");
      return;
    }

    const updateData: {
      name: string;
      image: string;
      businessName?: string;
    } = {
      name: name.trim(),
      image: image.trim(),
    };

    if (profile?.role === "vendor" && businessName.trim()) {
      updateData.businessName = businessName.trim();
    }

    try {
      setSaving(true);

      const result = await apiFetch<ProfileResponse>(
        "/api/profile",
        {
          method: "PATCH",
          body: JSON.stringify(updateData),
        }
      );

      setProfile(result.data);
      setName(result.data.name || "");
      setImage(result.data.image || "");
      setBusinessName(result.data.businessName || "");

      toast.success(
        result.message || "Profile updated successfully."
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">
          {error || "Profile not found."}
        </p>

        <Button onClick={loadProfile} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      {/* Heading */}
      <div>
        <p className="text-sm font-semibold text-orange-600">
          Account Settings
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
          Profile Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Profile summary */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-100">
          {image ? (
            <img
              src={image}
              alt={name || "Profile"}
              className="h-full w-full object-cover"
              
            />
          ) : (
            <UserRound className="h-9 w-9 text-orange-600" />
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {profile.name}
          </h2>

          <p className="text-sm text-gray-500">{profile.email}</p>

          <span className="mt-2 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold capitalize text-orange-700">
            {profile.role}
          </span>
        </div>
      </div>

      {/* Profile form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your account information below.
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Full Name *
          </label>

          <div className="relative">
            <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              required
              minLength={2}
              maxLength={60}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Email Address
          </label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              disabled
              value={profile.email}
              className={`${inputClass} cursor-not-allowed bg-gray-50 pl-10 text-gray-500`}
            />
          </div>

          <p className="mt-1 text-xs text-gray-400">
            Email cannot be changed from Profile Settings.
          </p>
        </div>

        {/* Vendor business name */}
        {profile.role === "vendor" && (
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Business Name
            </label>

            <div className="relative">
              <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                value={businessName}
                onChange={(event) =>
                  setBusinessName(event.target.value)
                }
                maxLength={80}
                placeholder="Enter your restaurant name"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        )}

        {/* Profile image */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Profile Image URL
          </label>

          <div className="relative">
            <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              maxLength={1000}
              placeholder="https://example.com/profile.jpg"
              className={`${inputClass} pl-10`}
            />
          </div>

          <p className="mt-1 text-xs text-gray-400">
            Enter a valid image URL. Leave empty to remove the profile image.
          </p>
        </div>

        {/* Protected information */}
        <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">
              Protected Account Information
            </h3>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500">Account Role</p>
              <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
                {profile.role}
              </p>
            </div>

            {profile.role === "vendor" && (
              <div>
                <p className="text-xs text-gray-500">
                  Subscription Plan
                </p>
                <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
                  {profile.subscriptionPlan || "Free"}
                </p>
              </div>
            )}
          </div>

          <p className="mt-3 text-xs leading-5 text-gray-500">
            Role and subscription information are managed securely by
            the platform and cannot be changed here.
          </p>
        </div>

        {/* Save */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => {
              setName(profile.name || "");
              setImage(profile.image || "");
              setBusinessName(profile.businessName || "");
            }}
          >
            Reset
          </Button>

          <Button
            type="submit"
            disabled={saving}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}