"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats {
  blogs: number;
  projects: number;
  skills: number;
}

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats>({
    blogs: 0,
    projects: 0,
    skills: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const blogsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blogs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const projectsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const skillsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/skills`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const blogs = await blogsRes.json();
        const projects = await projectsRes.json();
        const skills = await skillsRes.json();

        setStats({
          blogs: Array.isArray(blogs.blogs) ? blogs.blogs.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-100 text-sm font-medium mb-2">Blog Posts</h3>
          <p className="text-4xl font-bold text-secondary">{stats.blogs}</p>
          <p className="text-gray-200 text-sm mt-2">Total published posts</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-100 text-sm font-medium mb-2">Projects</h3>
          <p className="text-4xl font-bold text-secondary">{stats.projects}</p>
          <p className="text-gray-200 text-sm mt-2">Projects in portfolio</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-100 text-sm font-medium mb-2">Skills</h3>
          <p className="text-4xl font-bold text-secondary">{stats.skills}</p>
          <p className="text-gray-200 text-sm mt-2">Total skills listed</p>
        </div>
      </div>

      <div className=" rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/dashboard/blog"
            className="p-4 bg-secondary border-2 border-teal-900 hover:bg-gray-300 hover:text-gray-900 text-white rounded-lg hover:opacity-90 transition text-center font-semibold"
          >
            New Blog Post
          </Link>
          <Link
            href="/admin/dashboard/projects"
            className="p-4 bg-secondary border-2 border-teal-900 hover:bg-gray-300 hover:text-gray-900 text-white rounded-lg hover:opacity-90 transition text-center font-semibold"
          >
            New Project
          </Link>
          <Link
            href="/admin/dashboard/skills"
            className="p-4 bg-secondary border-2 border-teal-900 hover:bg-gray-300 hover:text-gray-900 text-white rounded-lg hover:opacity-90 transition text-center font-semibold"
          >
            Add Skill
          </Link>
          <Link
            href="/admin/dashboard/profile"
            className="p-4 bg-secondary border-2 border-teal-900 hover:bg-gray-300 hover:text-gray-900  text-white rounded-lg hover:opacity-90 transition text-center font-semibold"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
