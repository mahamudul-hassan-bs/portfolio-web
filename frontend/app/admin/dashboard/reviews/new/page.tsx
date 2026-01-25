"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewReview() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    clientTitle: "",
    clientImage: "",
    rating: 5,
    comment: "",
    featured: true,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? parseInt(value)
            : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setForm((prev) => ({
          ...prev,
          clientImage: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );

      if (response.ok) {
        router.push("/admin/dashboard/reviews");
      } else {
        alert("Failed to create review");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="text-secondary hover:underline mr-4"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-primary">Add New Review</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className=" rounded-lg shadow p-8 space-y-6"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="clientImage"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Client Photo
            </label>
            <input
              type="file"
              id="clientImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
            {form.clientImage && (
              <div className="mt-4">
                <img
                  src={form.clientImage}
                  alt="Client Preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="clientName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Client Name *
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              required
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="clientTitle"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Client Title/Position
            </label>
            <input
              type="text"
              id="clientTitle"
              name="clientTitle"
              value={form.clientTitle}
              onChange={handleChange}
              placeholder="e.g., CEO at Tech Company"
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Rating *
            </label>
            <select
              id="rating"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            >
              <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
              <option value="4">⭐⭐⭐⭐ 4 Stars</option>
              <option value="3">⭐⭐⭐ 3 Stars</option>
              <option value="2">⭐⭐ 2 Stars</option>
              <option value="1">⭐ 1 Star</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Review Comment *
            </label>
            <textarea
              id="comment"
              name="comment"
              value={form.comment}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Write the client's review..."
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none resize-none"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-secondary"
            />
            <label
              htmlFor="featured"
              className="ml-2 text-sm font-medium text-gray-300"
            >
              Featured (Display on home page)
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="border border-[#2b1b47] bg-[#13182f] px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Review"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-blue-950"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
