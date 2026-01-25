"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  featured: boolean;
  techStack: string[];
  createdAt: string;
}

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects`,
        );
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to delete project");

      setProjects(projects.filter((project) => project._id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Projects Management</h1>
        <Link
          href="/admin/dashboard/projects/new"
          className="px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90"
        >
          New Project
        </Link>
      </div>

      <div className=" rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-950/10 backdrop-blur-2xl">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Tech Stack
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-t hover:bg-gray-950/10">
                <td className="px-6 py-4 text-sm">{project.title}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 border border-[#2b1b47] bg-[#13182f] bg-gray-100 text-gray-300 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.featured
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {project.featured ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Link
                    href={`/admin/dashboard/projects/${project._id}`}
                    className="text-secondary hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project._id)}
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
