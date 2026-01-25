"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Experience {
  _id: string;
  role: string;
  company: string;
  employmentType: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  logo?: string;
}

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [logoMode, setLogoMode] = useState<"upload" | "link">("upload");
  const [formData, setFormData] = useState<Experience | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/experience/${id}`,
        );
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Failed to fetch experience:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchExperience();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : null,
    );
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && formData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logo: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/experience/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Failed to update experience");

      router.push("/admin/dashboard/experience");
    } catch (error) {
      console.error("Error updating experience:", error);
      alert("Failed to update experience");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div>Loading...</div>;
  if (!formData) return <div>Experience not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="text-secondary hover:underline mr-4"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-primary">Edit Experience</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className=" rounded-lg shadow p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company *
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Employment Type
            </label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Freelance</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate.split("T")[0]}
              onChange={handleChange}
              required
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Date (leave blank if current)
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate ? formData.endDate.split("T")[0] : ""}
              onChange={handleChange}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={4}
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company Logo
          </label>
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setLogoMode("upload")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                logoMode === "upload"
                  ? "bg-blue-900/10 text-white"
                  : "border border-[#2b1b47] bg-[#13182f]"
              }`}
            >
              📤 Upload
            </button>
            <button
              type="button"
              onClick={() => setLogoMode("link")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                logoMode === "link"
                  ? "bg-blue-900/10 text-white"
                  : "border border-[#2b1b47] bg-[#13182f]"
              }`}
            >
              🔗 Link
            </button>
          </div>

          {logoMode === "upload" ? (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPG, PNG, SVG, GIF
              </p>
            </div>
          ) : (
            <input
              type="url"
              name="logo"
              value={formData.logo || ""}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          )}

          {formData.logo && (
            <div className="mt-2">
              <img
                src={formData.logo}
                alt="Logo preview"
                className="bg-transparent w-14 h-14 rounded-full object-cover"
                onError={() => alert("Invalid image")}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="border border-[#2b1b47] bg-[#13182f] px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Experience"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-blue-950"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
