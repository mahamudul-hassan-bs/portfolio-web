"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Education {
  _id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export default function EducationManagement() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/education`,
        );
        const data = await response.json();
        setEducation(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch education:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/education/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to delete education");

      setEducation(education.filter((edu) => edu._id !== id));
    } catch (error) {
      console.error("Error deleting education:", error);
      alert("Failed to delete education");
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
          Education Management
        </h1>
        <Link
          href="/admin/dashboard/education/new"
          className="px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90"
        >
          Add Education
        </Link>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu._id}
            className="bg-blue-950/10 backdrop-blur-3xl rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary">
                  {edu.degree} in {edu.fieldOfStudy}
                </h3>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </p>
                {edu.description && (
                  <p className="text-gray-300 mt-3">{edu.description}</p>
                )}
              </div>
              <div className="space-x-2 ml-4">
                <Link
                  href={`/admin/dashboard/education/${edu._id}`}
                  className="text-secondary hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(edu._id)}
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
