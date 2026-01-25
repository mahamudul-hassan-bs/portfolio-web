"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEducationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logoMode, setLogoMode] = useState<"upload" | "link">("upload");
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    currentlyStudying: false,
    description: "",
    logo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logo: reader.result as string,
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
        `${process.env.NEXT_PUBLIC_API_URL}/education`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Failed to create education");

      router.push("/admin/dashboard/education");
    } catch (error) {
      console.error("Error creating education:", error);
      alert("Failed to create education");
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
        <h1 className="text-4xl font-bold text-primary">Add Education</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className=" rounded-lg shadow p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            School/University *
          </label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            required
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Degree *
          </label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
            placeholder="e.g., Bachelor, Master, Associate"
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Field of Study *
          </label>
          <input
            type="text"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            required
            placeholder="e.g., Computer Science"
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Year *
            </label>
            <input
              type="number"
              name="startYear"
              value={formData.startYear}
              onChange={handleChange}
              required
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Year
            </label>
            <input
              type="number"
              name="endYear"
              value={formData.endYear}
              onChange={handleChange}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <input
              type="checkbox"
              name="currentlyStudying"
              checked={formData.currentlyStudying}
              onChange={handleChange}
              className="mr-2"
            />
            Currently Studying
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Institution Logo
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
              value={formData.logo}
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
            {loading ? "Creating..." : "Create Education"}
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
