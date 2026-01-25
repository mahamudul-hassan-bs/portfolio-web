"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  visible: boolean;
}

export default function SkillsManagement() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/skills`,
        );
        const data = await response.json();
        setSkills(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/skills/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to delete skill");

      setSkills(skills.filter((skill) => skill._id !== id));
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Failed to delete skill");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Skills Management</h1>
        <Link
          href="/admin/dashboard/skills/new"
          className="px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90"
        >
          Add Skill
        </Link>
      </div>

      <div className="rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-950/10 backdrop-blur-xl">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Proficiency
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Visible
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill._id} className="border-t hover:bg-blue-950/10">
                <td className="px-6 py-4 text-sm">{skill.name}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className="px-3 py-1 border border-[#2b1b47] bg-[#13182f]
                   text-xs rounded"
                  >
                    {skill.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      skill.visible
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-300"
                    }`}
                  >
                    {skill.visible ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Link
                    href={`/admin/dashboard/skills/${skill._id}`}
                    className="text-secondary hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
