
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

type ApiResponse = {
  success: boolean;
  message: string;
};

export default function AddMenuItemForm() {
  const router = useRouter();

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!image) {
      toast.error("Please upload a menu item image.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("itemName", itemName);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("area", area);
      formData.append("city", city);
      formData.append("image", image);

      const result = await apiFetch<ApiResponse>(
        "/api/vendor/menu-items",
        {
          method: "POST",
          body: formData,
        }
      );

      toast.success(
        result.message || "Menu item submitted for approval."
      );

      router.push("/vendor/dashboard/menu-items");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create menu item."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-medium text-orange-600">
          Menu Management
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Add New Menu Item
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Add your pizza details and submit it for admin approval.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7"
      >
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Item Name *
          </label>
          <input
            required
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Chicken Cheese Pizza"
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Category *
            </label>
            <input
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Chicken Pizza"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Price (৳) *
            </label>
            <input
              required
              type="number"
              min="1"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="450"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Description *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your pizza..."
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Area *
            </label>
            <input
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Mirpur"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              City *
            </label>
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Dhaka"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Menu Item Image *
          </label>

          <label className="mt-2 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-200 bg-orange-50 p-5 text-center hover:bg-orange-100">
            {preview ? (
              <img
                src={preview}
                alt="Pizza preview"
                className="h-36 w-full rounded-lg object-contain"
              />
            ) : (
              <>
                <ImagePlus className="h-9 w-9 text-orange-500" />
                <span className="mt-2 text-sm font-semibold text-gray-700">
                  Choose a pizza image
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  Image files only, maximum 5 MB
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0])}
            />
          </label>

          {image && (
            <p className="mt-2 text-xs text-gray-500">
              Selected: {image.name}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-orange-50 p-4 text-sm text-orange-800">
          Your menu item will remain pending until an admin approves it.
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {submitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="mr-2 h-4 w-4" />
          )}
          {submitting ? "Submitting..." : "Submit Menu Item"}
        </Button>
      </form>
    </div>
  );
}
