"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Certification {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  description?: string;
  visible: boolean;
}

export default function EditCertificationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<Certification | null>(null);

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/certifications/admin/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Failed to fetch certification:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchCertification();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!formData) return;
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value,
          }
        : null,
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && formData) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData((prev) =>
          prev
            ? {
                ...prev,
                image: base64,
              }
            : null,
        );
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
        `${process.env.NEXT_PUBLIC_API_URL}/certifications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        console.error("Server error:", error);
        throw new Error("Failed to update certification");
      }

      router.push("/admin/dashboard/certifications");
    } catch (error) {
      console.error("Error updating certification:", error);
      alert("Failed to update certification. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div>Loading...</div>;
  if (!formData) return <div>Certification not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="text-secondary hover:underline mr-4"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-primary">Edit Certification</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className=" rounded-lg shadow p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Certification Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Issuer/Organization *
          </label>
          <input
            type="text"
            name="issuer"
            value={formData.issuer}
            onChange={handleChange}
            required
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Issue Date *
            </label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate.split("T")[0]}
              onChange={handleChange}
              required
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={
                formData.expiryDate ? formData.expiryDate.split("T")[0] : ""
              }
              onChange={handleChange}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Credential ID
          </label>
          <input
            type="text"
            name="credentialId"
            value={formData.credentialId || ""}
            onChange={handleChange}
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Credential URL
          </label>
          <input
            type="url"
            name="credentialUrl"
            value={formData.credentialUrl || ""}
            onChange={handleChange}
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Certificate Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
          />
          {formData.image && (
            <div className="mt-4">
              <img
                src={formData.image}
                alt="Certificate Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
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
            <input
              type="checkbox"
              name="visible"
              checked={formData.visible}
              onChange={handleChange}
              className="mr-2"
            />
            Visible in Portfolio
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="border border-[#2b1b47] bg-[#13182f] px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Certification"}
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
