"use client";

import { useState, useEffect } from "react";

interface Profile {
  _id?: string;
  name: string;
  title: string;
  introduction: string;
  email: string;
  phone?: string;
  location?: string;
  profileImage?: string;
  resume?: string;
  yearsExperience?: number;
  projectsCompleted?: number;
  clientSatisfaction?: number;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
}

export default function ProfileManagement() {
  const [profile, setProfile] = useState<Profile>({
    name: "Mahamudul Hassan Barshan",
    title: "Full-Stack Developer",
    introduction: "Building modern web applications",
    email: "contact@example.com",
    yearsExperience: 5,
    projectsCompleted: 20,
    clientSatisfaction: 100,
    socialLinks: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        );
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setProfile((prev) => ({
          ...prev,
          resume: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setProfile((prev) => ({
          ...prev,
          profileImage: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        },
      );

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to update profile");
      }
    } catch (error) {
      setMessage("An error occurred");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8">
        Profile Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-blue-950/10 backdrop-blur-2xl transparent rounded-lg shadow p-8 max-w-2xl"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Profile Photo
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
            {profile.profileImage && (
              <div className="mt-4">
                <img
                  src={profile.profileImage}
                  alt="Profile Preview"
                  className="bg-transparent w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Professional Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={profile.title}
              onChange={handleChange}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="introduction"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Introduction
            </label>
            <textarea
              id="introduction"
              name="introduction"
              value={profile.introduction}
              onChange={handleChange}
              rows={4}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={profile.location || ""}
              onChange={handleChange}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="cv"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              CV/Resume (PDF)
            </label>
            <input
              type="file"
              id="cv"
              accept=".pdf"
              onChange={handleCVUpload}
              className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
            {profile.resume && (
              <p className="text-sm text-green-600 mt-2">
                CV uploaded successfully
              </p>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Portfolio Stats
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label
                  htmlFor="yearsExperience"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="yearsExperience"
                  name="yearsExperience"
                  value={profile.yearsExperience || 0}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      yearsExperience: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="projectsCompleted"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Projects Completed
                </label>
                <input
                  type="number"
                  id="projectsCompleted"
                  name="projectsCompleted"
                  value={profile.projectsCompleted || 0}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      projectsCompleted: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="clientSatisfaction"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Client Satisfaction (%)
                </label>
                <input
                  type="number"
                  id="clientSatisfaction"
                  name="clientSatisfaction"
                  min="0"
                  max="100"
                  value={profile.clientSatisfaction || 0}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      clientSatisfaction: Math.min(
                        100,
                        Math.max(0, parseInt(e.target.value) || 0),
                      ),
                    }))
                  }
                  className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Social Links
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="github"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  GitHub
                </label>
                <input
                  type="url"
                  id="github"
                  name="github"
                  value={profile.socialLinks?.github || ""}
                  onChange={handleSocialChange}
                  className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="linkedin"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={profile.socialLinks?.linkedin || ""}
                  onChange={handleSocialChange}
                  className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="twitter"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Twitter
                </label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  value={profile.socialLinks?.twitter || ""}
                  onChange={handleSocialChange}
                  className="bg-transparent w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes("success")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-950 w-full px-6 py-3  text-white rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
