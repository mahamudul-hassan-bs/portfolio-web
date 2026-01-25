"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Experience {
  _id: string;
  title: string;
  company: string;
  employmentType: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export default function ExperienceManagement() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/experience`,
        );
        const data = await response.json();
        setExperience(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch experience:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/experience/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to delete experience");

      setExperience(experience.filter((exp) => exp._id !== id));
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert("Failed to delete experience");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">
          Experience Management
        </h1>
        <Link
          href="/admin/dashboard/experience/new"
          className="px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90"
        >
          Add Experience
        </Link>
      </div>

      <div className="space-y-4">
        {experience.map((exp) => (
          <div
            key={exp._id}
            className="bg-blue-950/10 backdrop-blur-3xl rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary">{exp.title}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  <span>{exp.employmentType}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {formatDate(exp.startDate)} -{" "}
                  {exp.endDate ? formatDate(exp.endDate) : "Present"}
                </p>
                {exp.description && (
                  <p className="text-gray-300 mt-3">{exp.description}</p>
                )}
              </div>
              <div className="space-x-2 ml-4">
                <Link
                  href={`/admin/dashboard/experience/${exp._id}`}
                  className="text-secondary hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(exp._id)}
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
