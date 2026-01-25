"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";
import CardSwap, { Card } from "@/components/CardSwap";

interface Profile {
  yearsExperience: number;
  projectsCompleted: number;
  clientSatisfaction: number;
  name: string;
  title: string;
  introduction: string;
  profileImage?: string;
  resume?: string;
}

interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  image?: string;
  techStack: string[];
  featured: boolean;
}

interface Review {
  _id: string;
  clientName: string;
  clientTitle?: string;
  clientImage?: string;
  rating: number;
  comment: string;
}

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        );
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        // Fetch featured projects
        const projectsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects`,
        );
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          const featured = Array.isArray(projectsData)
            ? projectsData.filter((p: Project) => p.featured).slice(0, 2)
            : [];
          setProjects(featured);
        }

        // Fetch reviews
        const reviewsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews`,
        );
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="">
      <div className="mt-4 flex items-center flex-col">
        <Header />
      </div>
      {/* Hero Section */}
      <section className="min-h-screen text-white flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                {profile?.name || "Loading..."}
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-gray-200">
                {profile?.title || "Full-Stack Developer"}
              </p>
              <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-xl">
                {profile?.introduction ||
                  "I build modern, scalable web applications with Next.js, React, and Node.js."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/projects"
                  className="px-8 py-3 bg-blue-950 hover:bg-blue-900 rounded-lg font-semibold transition transform hover:scale-105"
                >
                  View My Work
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3 border-2 border-white hover:bg-white hover:text-black rounded-lg font-semibold transition"
                >
                  Get In Touch
                </Link>
                {profile?.resume && (
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = profile.resume || "";
                      link.download = "CV.pdf";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="px-8 py-3 border-2 border-gray-300 hover:border-white hover:bg-white hover:text-black text-gray-300  rounded-lg font-semibold transition"
                  >
                    Download CV
                  </button>
                )}
              </div>
            </div>

            {profile?.profileImage && (
              <div className="flex justify-center md:justify-end">
                <ProfileCard
                  name={profile.name}
                  title={profile.title}
                  avatarUrl={profile.profileImage}
                  enableTilt={true}
                  enableMobileTilt={true}
                  showUserInfo={false}
                  innerGradient={undefined}
                  behindGlowColor={undefined}
                  behindGlowSize={undefined}
                  miniAvatarUrl={undefined}
                  onContactClick={undefined}
                  className=""
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="flex w-full items-center flex-col rounded-lg">
        <section className="py-10 w-full max-w-6xl backdrop-blur-2xl bg-blue-950/10 shadow-2xl rounded-full">
          <div className=" mx-auto px-6 ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <h3 className="text-4xl font-bold text-teal-300 mb-2">
                  {profile?.yearsExperience || 5}+
                </h3>
                <p className="text-gray-100 text-lg">Years Experience</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-teal-300 mb-2">
                  {profile?.projectsCompleted || 20}+
                </h3>
                <p className="text-gray-100 text-lg">Projects Completed</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-teal-300 mb-2">
                  {profile?.clientSatisfaction || 100}%
                </h3>
                <p className="text-gray-100 text-lg">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Featured Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-white">Featured Work</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading featured projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="backdrop-blur-xl  border-[#2b1b47] bg-[#13182f] rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition"
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
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {project.shortDescription}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.slice(0, 2).map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-secondary text-white text-sm rounded-full border-2 border-[#2b1b47]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <Link
                        href="/projects"
                        className="text-secondary font-semibold hover:text-accent transition"
                      >
                        View Project →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          <div className="text-center">
            <Link
              href="/projects"
              className="inline-block px-8 py-3 bg-blue-950 text-white rounded-lg hover:opacity-90 transition font-semibold"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            {/* ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-center">
              {/* LEFT — Header (Centered) */}
              <div className="lg:col-span-2 flex justify-center">
                <div>
                  <h2 className="text-6xl font-bold text-primary leading-tight">
                    Client Reviews
                  </h2>
                  <p className="mt-4 text-gray-600">
                    What our clients say about our service
                  </p>
                </div>
              </div>

              {/* RIGHT — Cards (Centered) */}
              <div className="lg:col-span-2 flex justify-center">
                <div
                  style={{
                    height: "300px",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <CardSwap
                    cardDistance={60}
                    verticalDistance={70}
                    delay={5000}
                    pauseOnHover={false}
                    height={250}
                    onCardClick={undefined}
                  >
                    {reviews.map((review) => (
                      <Card
                        key={review._id}
                        {...({
                          children: (
                            <div className=" rounded-lg p-6">
                              {/* Client Info */}
                              <div className="flex items-center mb-4">
                                {review.clientImage && (
                                  <img
                                    src={review.clientImage}
                                    alt={review.clientName}
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                  />
                                )}
                                <div>
                                  <h4 className="font-bold text-primary">
                                    {review.clientName}
                                  </h4>
                                  {review.clientTitle && (
                                    <p className="text-sm text-gray-200">
                                      {review.clientTitle}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Rating */}
                              <div className="flex mb-3">
                                {Array.from({ length: review.rating }).map(
                                  (_, i) => (
                                    <span
                                      key={i}
                                      className="text-yellow-400 text-lg"
                                    >
                                      ★
                                    </span>
                                  ),
                                )}
                              </div>

                              {/* Comment */}
                              <p className="text-gray-400 leading-relaxed">
                                {review.comment}
                              </p>
                            </div>
                          ),
                        } as any)}
                      />
                    ))}
                  </CardSwap>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary to-accent text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Work Together?</h2>
          <p className="text-xl mb-8 opacity-90">
            I'm always interested in hearing about new projects and
            opportunities.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-blue-950 text-secondary rounded-lg hover:bg-gray-200 hover:text-gray-900 transition font-semibold"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
