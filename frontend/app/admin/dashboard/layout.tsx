"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/admin");
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-primary text-white transition-all duration-300 flex flex-col `}
      >
        <div className="p-6 border-b border-r border-gray-700">
          <h2 className={`text-2xl font-bold ${!sidebarOpen && "text-center"}`}>
            {sidebarOpen ? "Admin Panel" : "AP"}
          </h2>
        </div>

        <nav className="flex-1 p-6 space-y-4 border-r border-gray-700">
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition"
          >
            <span className="text-xl">📊</span>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            href="/admin/dashboard/profile"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition"
          >
            <span className="text-xl">👤</span>
            {sidebarOpen && <span>Profile</span>}
          </Link>
          <Link
            href="/admin/dashboard/blog"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition"
          >
            <span className="text-xl">📝</span>
            {sidebarOpen && <span>Blog</span>}
          </Link>
          <Link
            href="/admin/dashboard/projects"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition"
          >
            <span className="text-xl">🚀</span>
            {sidebarOpen && <span>Projects</span>}
          </Link>
          <Link
            href="/admin/dashboard/skills"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition"
          >
            <span className="text-xl">⚡</span>
            {sidebarOpen && <span>Skills</span>}
          </Link>
          <Link
            href="/admin/dashboard/education"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition"
          >
            <span className="text-xl">🎓</span>
            {sidebarOpen && <span>Education</span>}
          </Link>
          <Link
            href="/admin/dashboard/experience"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition"
          >
            <span className="text-xl">💼</span>
            {sidebarOpen && <span>Experience</span>}
          </Link>
          <Link
            href="/admin/dashboard/certifications"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition"
          >
            <span className="text-xl">🏆</span>
            {sidebarOpen && <span>Certifications</span>}
          </Link>
          <Link
            href="/admin/dashboard/reviews"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition"
          >
            <span className="text-xl">⭐</span>
            {sidebarOpen && <span>Reviews</span>}
          </Link>
        </nav>

        <div className="border-t border-r border-gray-700 p-6">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition w-full text-left"
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-gray-700 shadow-sm p-6 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl text-primary hover:opacity-70 transition"
          >
            ☰
          </button>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-secondary hover:text-accent transition font-semibold"
            >
              ← Back to Website
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}
