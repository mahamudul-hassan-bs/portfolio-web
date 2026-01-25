"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ReactQuillWrapper from "@/components/ReactQuillWrapper";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    [{ align: [] }],
    ["clean"],
  ],
};

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null,
  );
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [showAddTagInput, setShowAddTagInput] = useState(false);
  const [formData, setFormData] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blogs/admin/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) throw new Error("Failed to fetch blog");
        const data = await response.json();
        setFormData(data);
        if (data.coverImage) {
          setCoverImagePreview(data.coverImage);
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setFetching(false);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`);
        if (!response.ok) return;
        const data = await response.json();
        setAvailableTags(Array.isArray(data.tags) ? data.tags : []);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchBlog();
    fetchTags();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === "published"
                ? (e.target as HTMLInputElement).checked
                : value,
          }
        : null,
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCoverImagePreview(result);
        if (formData) {
          setFormData((prev) =>
            prev
              ? {
                  ...prev,
                  coverImage: result,
                }
              : null,
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = (value: string) => {
    if (!formData) return;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            content: value,
          }
        : null,
    );
  };

  const handleAddTag = async () => {
    if (!formData) return;
    const tag = newTagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) =>
        prev
          ? {
              ...prev,
              tags: [...prev.tags, tag],
            }
          : null,
      );
      // Add to available tags if not already there
      if (!availableTags.includes(tag)) {
        setAvailableTags((prev) => [...prev, tag].sort());

        // Save tag to database
        try {
          const token = localStorage.getItem("token");
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: tag }),
          });
        } catch (error) {
          console.error("Failed to save tag:", error);
        }
      }
      setNewTagInput("");
      setShowAddTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!formData) return;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
          }
        : null,
    );
  };

  const handleSelectTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!formData) return;
    const tag = e.target.value;
    if (tag === "add-new") {
      setShowAddTagInput(true);
      e.target.value = "";
    } else if (tag === "delete-tag") {
      // Handle delete mode
      e.target.value = "";
    } else if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) =>
        prev
          ? {
              ...prev,
              tags: [...prev.tags, tag],
            }
          : null,
      );
      e.target.value = "";
    }
  };

  const handleDeleteTag = async (tagToDelete: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the tag "${tagToDelete}"? This will not affect existing blog posts.`,
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tags/${tagToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setAvailableTags((prev) => prev.filter((tag) => tag !== tagToDelete));
      }
    } catch (error) {
      console.error("Failed to delete tag:", error);
      alert("Failed to delete tag");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!formData.excerpt.trim()) {
      alert("Please enter an excerpt");
      return;
    }
    if (!formData.content.trim() || formData.content === "<p><br></p>") {
      alert("Please enter content");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update blog");
      }

      router.push("/admin/dashboard/blog");
    } catch (error: any) {
      console.error("Error updating blog:", error);
      alert(error.message || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-500">Loading blog post...</p>
      </div>
    );
  if (!formData)
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-500">Blog post not found</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="text-secondary hover:underline mr-4"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-primary">Edit Blog Post</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-transparent rounded-lg shadow p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Excerpt *
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows={3}
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
          {coverImagePreview && (
            <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden">
              <img
                src={coverImagePreview}
                alt="Cover preview"
                className="bg-transparent w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Content *
          </label>
          <div className="quill-wrapper border border-gray-300 rounded-lg overflow-hidden">
            <ReactQuillWrapper
              modules={modules}
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write your blog content here..."
              style={{ height: "400px" }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags
          </label>
          <div className="space-y-3">
            <div>
              <select
                onChange={handleSelectTag}
                className="bg-transparent w-full px-4 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                <option value="" className="text-gray-300">
                  Select a tag...
                </option>
                {availableTags.map((tag) => (
                  <option className="text-blue-950" key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
                <option className="text-blue-950" value="add-new">
                  + Add New Tag
                </option>
              </select>
            </div>

            {/* Available Tags List with Delete Options */}
            {availableTags.length > 0 && (
              <div className="bg-blue-950/10 backdrop-blur-3xl p-3 rounded-lg">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Available Tags (click × to delete):
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 border border-[#2b1b47] bg-[#13182f]  text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleDeleteTag(tag)}
                        className="hover:text-red-600 font-bold text-gray-400"
                        title="Delete tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {showAddTagInput && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  placeholder="Enter new tag name"
                  autoFocus
                  className="bg-transparent flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-secondary text-white border border-[#2b1b47] bg-[#13182f] rounded-lg hover:opacity-90"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTagInput(false);
                    setNewTagInput("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-blue-950"
                >
                  Cancel
                </button>
              </div>
            )}

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-white rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:opacity-75 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="h-4 w-4 text-secondary"
          />
          <label className="ml-2 text-sm text-gray-300">Published</label>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="border border-[#2b1b47] bg-[#13182f] px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Blog Post"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-blue-950"
          >
            Cancel
          </button>
        </div>
      </form>

      <style jsx global>{`
        .quill-wrapper .ql-container {
          border: none !important;
          font-size: 16px;
        }
        .quill-wrapper .ql-editor {
          min-height: 350px;
          padding: 15px;
        }
        .quill-wrapper .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
        }
      `}</style>
    </div>
  );
}
