"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  views: number;
  createdAt: string;
}

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blogs`,
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const allTags = Array.from(new Set(blogs.flatMap((blog) => blog.tags)));
  const filteredBlogs = selectedTag
    ? blogs.filter((blog) => blog.tags.includes(selectedTag))
    : blogs;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500">Loading blog posts...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-primary mb-6">Blog</h1>
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">
            No blog posts yet. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold text-primary mb-6">Blog</h1>
      <p className="text-xl text-gray-200 mb-12 max-w-3xl">
        Insights, tutorials, and thoughts on web development and technology.
      </p>

      {/* Tags Filter */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              selectedTag === null
                ? " border border-[#2b1b47] bg-[#13182f] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Posts
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedTag === tag
                  ? " border border-[#2b1b47] bg-[#13182f] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {filteredBlogs.map((blog) => (
          <Link
            key={blog._id}
            href={`/blog/${blog.slug}`}
            className="border border-[#2b1b47] bg-[#13182f] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="relative h-48 bg-gradient-to-br from-secondary to-accent overflow-hidden">
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-gray-200 mb-4 line-clamp-2">{blog.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {new Date(
                    blog.publishedAt || blog.createdAt,
                  ).toLocaleDateString()}
                </span>
                <span>{blog.views} views</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts found with this tag.</p>
        </div>
      )}
    </div>
  );
}
