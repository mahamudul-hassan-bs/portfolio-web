"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    ["clean"],
  ],
};

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null,
  );
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [showAddTagInput, setShowAddTagInput] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: [] as string[],
    published: false,
  });

  useEffect(() => {
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

    fetchTags();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "published" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCoverImagePreview(result);
        setFormData((prev) => ({
          ...prev,
          coverImage: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleAddTag = () => {
    const tag = newTagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSelectTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tag = e.target.value;
    if (tag === "add-new") {
      setShowAddTagInput(true);
      e.target.value = "";
    } else if (tag === "delete-tag") {
      // Handle delete mode
      e.target.value = "";
    } else if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
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

  const handleAddNewTag = async () => {
    const tag = newTagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create blog");
      }

      router.push("/admin/dashboard/blog");
    } catch (error: any) {
      console.error("Error creating blog:", error);
      alert(error.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="text-secondary hover:underline mr-4"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-primary">
          Create New Blog Post
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 rounded-lg shadow p-8 space-y-6"
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
            className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
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
            className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
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
            className="w-full px-4 py-2 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
          {coverImagePreview && (
            <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden">
              <img
                src={coverImagePreview}
                alt="Cover preview"
                className="w-full h-full object-cover"
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
              className=" text-gray-200"
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
                className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                <option className="text-gray-900" value="">
                  Select a tag...
                </option>
                {availableTags.map((tag) => (
                  <option className="text-gray-900" key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
                <option className="text-gray-900" value="add-new">
                  + Add New Tag
                </option>
              </select>
            </div>

            {/* Available Tags List with Delete Options */}
            {availableTags.length > 0 && (
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-xs font-medium text-gray-300 mb-2">
                  Available Tags (click × to delete):
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[#2b1b47] bg-[#13182f] inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 text-gray-300 rounded-full text-sm"
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
                    e.key === "Enter" && (e.preventDefault(), handleAddNewTag())
                  }
                  placeholder="Enter new tag name"
                  autoFocus
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddNewTag}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTagInput(false);
                    setNewTagInput("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
                    className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-white border  rounded-full text-sm"
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
          <label className="ml-2 text-sm text-gray-300">
            Publish immediately
          </label>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className=" border border-[#2b1b47] bg-[#13182f] px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Blog Post"}
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
        .ql-toolbar.ql-snow {
          background-color: lightgrey;
        }
      `}</style>
    </div>
  );
}
