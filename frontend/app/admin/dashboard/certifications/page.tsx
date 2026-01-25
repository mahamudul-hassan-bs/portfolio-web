"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Certification {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  visible: boolean;
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/certifications/admin/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        setCertifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch certifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certifications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setCertifications(certifications.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error("Error deleting certification:", error);
      alert("Failed to delete certification");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Certifications</h1>
        <Link
          href="/admin/dashboard/certifications/new"
          className="px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90"
        >
          Add Certification
        </Link>
      </div>

      <div className="space-y-4">
        {certifications.map((cert) => (
          <div
            key={cert._id}
            className="bg-blue-950/10 backdrop-blur-3xl rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary">{cert.title}</h3>
                <p className="text-gray-600">{cert.issuer}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {formatDate(cert.issueDate)}
                  {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                </p>
                <div className="mt-3">
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      cert.visible
                        ? "bg-green-100/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {cert.visible ? "Visible" : "Hidden"}
                  </span>
                </div>
              </div>
              <div className="space-x-2 ml-4">
                <Link
                  href={`/admin/dashboard/certifications/${cert._id}`}
                  className="text-secondary hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(cert._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
