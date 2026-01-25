"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  url?: string;
  visible: boolean;
}

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<Skill | null>(null);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/skills/${id}`,
        );
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Failed to fetch skill:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchSkill();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === "level"
                ? parseInt(value)
                : name === "visible"
                  ? (e.target as HTMLInputElement).checked
                  : value,
          }
        : null,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/skills/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Failed to update skill");

      router.push("/admin/dashboard/skills");
    } catch (error) {
      console.error("Error updating skill:", error);
      alert("Failed to update skill");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div>Loading...</div>;
  if (!formData) return <div>Skill not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="text-secondary hover:underline mr-4"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-primary">Edit Skill</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className=" rounded-lg shadow p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Skill Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category *
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL
          </label>
          <input
            type="url"
            name="url"
            value={formData.url || ""}
            onChange={handleChange}
            placeholder="e.g., https://example.com"
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Proficiency Level (%)
          </label>
          <input
            type="range"
            name="level"
            min="0"
            max="100"
            value={formData.level}
            onChange={handleChange}
            className="bg-transparent w-full"
          />
          <div className="text-right text-sm text-gray-600 mt-2">
            {formData.level}%
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="visible"
            checked={formData.visible}
            onChange={handleChange}
            className="h-4 w-4 text-secondary"
          />
          <label className="ml-2 text-sm text-gray-300">
            Visible in Portfolio
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="border border-[#2b1b47] bg-[#13182f] px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Skill"}
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
