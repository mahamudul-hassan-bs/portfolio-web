"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  views: number;
  author: string;
  createdAt: string;
}

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`,
        );
        if (!response.ok) throw new Error("Blog not found");
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500">Loading blog post...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, the blog post you're looking for doesn't exist.
        </p>
        <Link
          href="/blog"
          className="text-secondary hover:text-accent transition font-semibold"
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Header */}
      <Link
        href="/blog"
        className="text-secondary hover:text-accent transition font-semibold mb-8"
      >
        ← Back to Blog
      </Link>

      <h1 className="text-5xl font-bold text-primary mt-10 mb-4">
        {blog.title}
      </h1>

      <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-8 pb-8 border-b">
        <span>
          {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          )}
        </span>
        <span>•</span>
        <span>{blog.author}</span>
        <span>•</span>
        <span>{blog.views} views</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-12">
        {blog.tags.map((tag) => (
          <span
            key={tag}
            className="px-4 py-2 bg-secondary text-white border border-[#453069] rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="mb-12 h-96 bg-gradient-to-br from-secondary to-accent rounded-lg overflow-hidden ">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div
          className="text-gray-200 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{
            __html: blog.content
              .split("\n")
              .map((line) => {
                if (line.startsWith("#")) {
                  const level = line.match(/^#+/)[0].length;
                  const text = line.replace(/^#+\s/, "");
                  const className =
                    ["text-4xl", "text-3xl", "text-2xl", "text-xl"][
                      level - 1
                    ] || "text-lg";
                  return `<h${level} class="${className} font-bold text-primary mt-6 mb-4">${text}</h${level}>`;
                }
                if (line.startsWith("```")) {
                  return "</pre>";
                }
                if (line.startsWith("-")) {
                  return `<li class="ml-4">• ${line.replace(/^-\s/, "")}</li>`;
                }
                if (line.trim() === "") {
                  return "</p>";
                }
                return `<p>${line}</p>`;
              })
              .join(""),
          }}
        />
      </div>

      {/* Related Posts */}
      <div className="border-t pt-12 mt-12">
        <h2 className="text-3xl font-bold text-primary mb-8">
          Continue Reading
        </h2>
        <Link
          href="/blog"
          className="text-secondary hover:text-accent transition font-semibold"
        >
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
}
