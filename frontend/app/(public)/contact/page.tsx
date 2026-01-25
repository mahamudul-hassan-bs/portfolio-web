"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, just show success message
      // In production, this would send to an email service or backend endpoint
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold text-primary mb-6">Get In Touch</h1>
      <p className="text-xl text-gray-300 mb-12">
        Have a project in mind or want to discuss opportunities? I'd love to
        hear from you!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-primary mb-2">Email</h3>
            <a
              href="mailto:contact@example.com"
              className="text-secondary hover:text-accent transition"
            >
              contact@example.com
            </a>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary mb-2">Location</h3>
            <p className="text-gray-300">Bangladesh</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary mb-2">Social</h3>
            <div className="space-y-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-secondary hover:text-accent transition"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-secondary hover:text-accent transition"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-secondary hover:text-accent transition"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary  outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary  outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-transparent px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary  outline-none"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-transparent px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary  outline-none resize-none"
                placeholder="Tell me more about your project..."
              />
            </div>

            {submitted && (
              <div className="p-4 bg-green-100 text-green-700 rounded-lg">
                ✓ Thank you! I'll get back to you soon.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-950 text-white rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
