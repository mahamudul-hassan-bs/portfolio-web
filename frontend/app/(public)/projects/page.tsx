"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  techStack: string[];
  image?: string;
  githubLink?: string;
  liveLink?: string;
  featured: boolean;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects`,
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500">Loading projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-primary mb-6">My Projects</h1>
        <div className="text-center py-20">
          <p className="text-xl text-gray-400">
            No projects yet. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold text-primary mb-6">My Projects</h1>
      <p className="text-xl text-gray-300 mb-12 max-w-3xl">
        A selection of my recent work showcasing my skills in full-stack
        development.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {projects.map((project) => (
          <div
            key={project._id}
            className={`border border-[#2b1b47] bg-[#13182f] rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition ${
              project.featured ? "md:col-span-2" : ""
            }`}
          >
            <div className="relative h-48 bg-gradient-to-br from-secondary to-accent overflow-hidden">
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-primary mb-2">
                {project.title}
              </h3>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 border border-[#2b1b47] py-1 bg-secondary text-white text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:text-accent transition"
                  >
                    View Live →
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:text-accent transition"
                  >
                    GitHub →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className=" p-12 rounded-lg text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">
          Interested in Working Together?
        </h2>
        <p className="text-gray-400 mb-6">
          Let's discuss how I can help with your next project.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 bg-blue-950 text-white rounded-lg hover:opacity-90 transition font-semibold"
        >
          Contact Me
        </Link>
      </div>
    </div>
  );
}
