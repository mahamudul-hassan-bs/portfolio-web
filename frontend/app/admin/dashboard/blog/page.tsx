"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  views: number;
  createdAt: string;
}

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blogs/admin/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to delete blog");

      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Blog Management</h1>
        <Link
          href="/admin/dashboard/blog/new"
          className="px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90"
        >
          New Post
        </Link>
      </div>

      <div
        className="bg-transparent
       rounded-lg shadow overflow-x-auto"
      >
        <table className="w-full">
          <thead className="bg-blue-950/10 backdrop-blur-3xl">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Views
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="border-t hover:bg-blue-950/15">
                <td className="px-6 py-4 text-sm">{blog.title}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      blog.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{blog.views}</td>
                <td className="px-6 py-4 text-sm">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Link
                    href={`/admin/dashboard/blog/${blog._id}`}
                    className="text-secondary hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id)}
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
