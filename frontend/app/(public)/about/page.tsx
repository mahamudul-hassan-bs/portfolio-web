"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface Profile {
  _id: string;
  name: string;
  title: string;
  introduction: string;
  location: string;
  email: string;
  phone?: string;
}

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

interface Certification {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  image?: string;
  description?: string;
}

interface Experience {
  _id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
  logo?: string;
}

interface Education {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  currentlyStudying?: boolean;
  description?: string;
  logo?: string;
}

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skillIcons, setSkillIcons] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [selectedCertImage, setSelectedCertImage] = useState<string | null>(
    null,
  );

  // Fetch icon from Devicon API or use backend icon
  const getSkillIcon = async (skill: Skill): Promise<string> => {
    // If backend has icon, use it
    if (skill.icon) {
      return skill.icon;
    }

    // Otherwise, fetch from Devicon API
    const iconName = skill.name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/\.js/, "js")
      .replace(/\+\+/g, "plus");

    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconName}/${iconName}-original.svg`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        );
        const skillsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/skills`,
        );
        const certificationsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/certifications`,
        );
        const experienceRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/experience`,
        );
        const educationRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/education`,
        );

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        if (skillsRes.ok) {
          const skillsData = await skillsRes.json();
          const skillsArray = Array.isArray(skillsData) ? skillsData : [];
          setSkills(skillsArray);

          // Fetch icons for all skills
          const icons: { [key: string]: string } = {};
          for (const skill of skillsArray) {
            icons[skill._id] = await getSkillIcon(skill);
          }
          setSkillIcons(icons);
        }

        if (certificationsRes.ok) {
          const certificationsData = await certificationsRes.json();
          setCertifications(
            Array.isArray(certificationsData) ? certificationsData : [],
          );
        }

        if (experienceRes.ok) {
          const experienceData = await experienceRes.json();
          setExperience(Array.isArray(experienceData) ? experienceData : []);
        }

        if (educationRes.ok) {
          const educationData = await educationRes.json();
          setEducation(Array.isArray(educationData) ? educationData : []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCertImage(null);
      }
    };

    if (selectedCertImage) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedCertImage]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const frontendSkills = skills.filter((s) => s.category === "Frontend");
  const backendSkills = skills.filter((s) => s.category === "Backend");
  const toolsSkills = skills.filter(
    (s) => s.category === "DevOps" || s.category === "Tools",
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      {/* Hero */}
      <div className="flex  gap-4 justify-between items-center  ">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-bold text-primary mb-6">
            {profile?.name || "About Me"}
          </h1>
          <p className="text-xl text-gray-200 mb-12 max-w-3xl">
            {profile?.title || "Full-stack developer"}
          </p>
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-primary mb-6">Who I Am</h2>
            <div className="space-y-4 text-gray-200">
              <p>{profile?.introduction || "Loading introduction..."}</p>
            </div>
          </div>
        </div>
        <div>
          <div className=" border-[#2b1b47] bg-[#13182f] border p-8 rounded-lg h-fit shadow-lg">
            <h3 className="text-2xl font-bold text-gray-50 mb-6">
              Quick Facts
            </h3>
            <ul className="space-y-4 text-gray-200">
              {profile?.location && (
                <li>
                  <strong>Location:</strong> {profile.location}
                </li>
              )}
              {profile?.email && (
                <li>
                  <strong>Email:</strong> {profile.email}
                </li>
              )}
              {profile?.phone && (
                <li>
                  <strong>Phone:</strong> {profile.phone}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bio Section */}

      {/* Skills Preview */}
      <section className="mb-20 mt-20">
        <h2 className="text-3xl font-bold text-primary mb-8">
          Skills & Expertise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {frontendSkills.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-secondary mb-6">
                Frontend
              </h3>
              <div className="flex flex-wrap gap-6">
                {frontendSkills.map((skill) => (
                  <div key={skill._id} className="flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-2">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgb(55, 65, 81)"
                          strokeWidth="3"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgb(107, 114, 128)"
                          strokeWidth="3"
                          strokeDasharray={`${(skill.level / 100) * 282.7} 282.7`}
                          strokeLinecap="round"
                          className="transition-all duration-500"
                        />
                      </svg>
                      {/* Icon in center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={skillIcons[skill._id]}
                          alt={skill.name}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50' y='50' font-size='50' text-anchor='middle' dy='.3em' fill='%23aaa'%3E%3F%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-200">
                        {skill.name}
                      </p>
                      <p className="text-xs text-gray-400">{skill.level}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {backendSkills.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-secondary mb-6">Backend</h3>
              <div className="flex flex-wrap gap-6">
                {backendSkills.map((skill) => (
                  <div key={skill._id} className="flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-2">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgb(55, 65, 81)"
                          strokeWidth="3"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgb(107, 114, 128)"
                          strokeWidth="3"
                          strokeDasharray={`${(skill.level / 100) * 282.7} 282.7`}
                          strokeLinecap="round"
                          className="transition-all duration-500"
                        />
                      </svg>
                      {/* Icon in center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={skillIcons[skill._id]}
                          alt={skill.name}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50' y='50' font-size='50' text-anchor='middle' dy='.3em' fill='%23aaa'%3E%3F%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-200">
                        {skill.name}
                      </p>
                      <p className="text-xs text-gray-400">{skill.level}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {toolsSkills.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-secondary mb-6">
                Tools & DevOps
              </h3>
              <div className="flex flex-wrap gap-6">
                {toolsSkills.map((skill) => (
                  <div key={skill._id} className="flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-2">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgb(107, 114, 128)"
                          strokeWidth="3"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgb(20, 184, 166)"
                          strokeWidth="3"
                          strokeDasharray={`${(skill.level / 100) * 282.7} 282.7`}
                          strokeLinecap="round"
                          className="transition-all duration-500"
                        />
                      </svg>
                      {/* Icon in center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={skillIcons[skill._id]}
                          alt={skill.name}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50' y='50' font-size='50' text-anchor='middle' dy='.3em' fill='%23aaa'%3E%3F%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-200">
                        {skill.name}
                      </p>
                      <p className="text-xs text-gray-400">{skill.level}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      {experience.length > 0 && (
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-primary mb-8">
            Work Experience
          </h2>
          <div className="relative">
            {/* Group experience by company */}
            {Object.entries(
              experience.reduce(
                (acc, exp) => {
                  if (!acc[exp.company]) {
                    acc[exp.company] = [];
                  }
                  acc[exp.company].push(exp);
                  return acc;
                },
                {} as Record<string, Experience[]>,
              ),
            )
              .sort(
                ([, expsA], [, expsB]) =>
                  new Date(expsB[0].startDate).getTime() -
                  new Date(expsA[0].startDate).getTime(),
              )
              .map(([company, exps], companyIndex, allCompanies) => {
                const earliestStart = new Date(
                  Math.min(...exps.map((e) => new Date(e.startDate).getTime())),
                );
                const latestEnd = exps.some((e) => e.currentlyWorking)
                  ? null
                  : new Date(
                      Math.max(
                        ...exps
                          .filter((e) => e.endDate)
                          .map((e) => new Date(e.endDate!).getTime()),
                      ),
                    );

                const duration = latestEnd
                  ? `${earliestStart.getFullYear()} - ${latestEnd.getFullYear()}`
                  : `${earliestStart.getFullYear()} - Present`;

                const firstExp = exps[0];

                return (
                  <div key={company} className="mb-12">
                    {/* Company Header */}
                    <div className="flex items-start gap-4 mb-6">
                      {firstExp.logo ? (
                        <img
                          src={firstExp.logo}
                          alt={company}
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0 bg-white p-1"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
                          💼
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-primary">
                          {company}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">{duration}</p>
                      </div>
                    </div>

                    {/* Positions at this company */}
                    <div className="pl-8 border-l-2 border-gray-600 space-y-0">
                      {exps
                        .sort(
                          (a, b) =>
                            new Date(b.startDate).getTime() -
                            new Date(a.startDate).getTime(),
                        )
                        .map((exp, idx) => {
                          const isCurrentJob = !exp.endDate;

                          return (
                            <div key={exp._id} className="relative pb-6">
                              {/* Position dot */}
                              <div
                                className={`absolute -left-[39px] top-2 w-3 h-3 rounded-full ${
                                  isCurrentJob ? "bg-blue-700" : "bg-gray-500"
                                }`}
                              ></div>

                              {/* Position card */}
                              <div className={`p-4 rounded-lg transition-all `}>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                  <div>
                                    <h4 className="text-lg font-bold text-primary">
                                      {exp.role}
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                                    <span className="text-sm text-gray-300">
                                      {new Date(
                                        exp.startDate,
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                      })}
                                      {" — "}
                                      {exp.currentlyWorking ? (
                                        <span className="text-secondary font-semibold">
                                          Present
                                        </span>
                                      ) : (
                                        exp.endDate &&
                                        new Date(
                                          exp.endDate,
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                        })
                                      )}
                                    </span>
                                    {isCurrentJob && (
                                      <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full font-semibold">
                                        Current
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {exp.location && (
                                  <p className="text-gray-400 text-sm mb-2">
                                    📍 {exp.location}
                                  </p>
                                )}
                                {exp.description && (
                                  <p className="text-gray-300 text-sm">
                                    {exp.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Divider between companies */}
                    {companyIndex < allCompanies.length - 1 && (
                      <div className="border-t border-gray-700 mt-8"></div>
                    )}
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-primary mb-8">Education</h2>
          <div className="relative">
            {/* Group education by institution */}
            {Object.entries(
              education.reduce(
                (acc, edu) => {
                  if (!acc[edu.institution]) {
                    acc[edu.institution] = [];
                  }
                  acc[edu.institution].push(edu);
                  return acc;
                },
                {} as Record<string, Education[]>,
              ),
            )
              .sort(
                ([, edusA], [, edusB]) =>
                  (edusB[0].endYear || edusB[0].startYear) -
                  (edusA[0].endYear || edusA[0].startYear),
              )
              .map(([institution, edus], institutionIndex, allInstitutions) => {
                const earliestStart = Math.min(...edus.map((e) => e.startYear));
                const latestEnd = Math.max(
                  ...edus.map((e) => e.endYear || e.startYear),
                );
                const duration =
                  earliestStart === latestEnd
                    ? `${earliestStart}`
                    : `${earliestStart} - ${latestEnd}`;

                return (
                  <div key={institution} className="mb-12">
                    {/* Institution Header */}
                    <div className="flex items-start gap-4 mb-6">
                      {edus[0].logo ? (
                        <img
                          src={edus[0].logo}
                          alt={institution}
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0 bg-white p-1"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
                          🎓
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-primary">
                          {institution}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">{duration}</p>
                      </div>
                    </div>

                    {/* Degrees at this institution */}
                    <div className="pl-8 border-l-2 border-gray-600 space-y-0">
                      {edus
                        .sort(
                          (a, b) =>
                            (b.endYear || b.startYear) -
                            (a.endYear || a.startYear),
                        )
                        .map((edu, idx) => {
                          const isCurrentStudy = edu.currentlyStudying || false;

                          return (
                            <div key={edu._id} className="relative pb-6">
                              {/* Degree dot */}
                              <div
                                className={`absolute -left-[39px] top-2 w-3 h-3 rounded-full ${
                                  isCurrentStudy ? "bg-blue-700" : "bg-gray-500"
                                }`}
                              ></div>

                              {/* Degree card */}
                              <div className={`p-4 rounded-lg transition-all`}>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                  <div>
                                    <h4 className="text-lg font-bold text-primary">
                                      {edu.degree}
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                                    <span className="text-sm text-gray-300">
                                      {edu.startYear}
                                      {" — "}
                                      {edu.currentlyStudying ? (
                                        <span className="text-secondary font-semibold">
                                          Present
                                        </span>
                                      ) : (
                                        edu.endYear
                                      )}
                                    </span>
                                    {isCurrentStudy && (
                                      <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full font-semibold">
                                        Currently
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-gray-400 text-sm mb-2">
                                  {edu.fieldOfStudy}
                                </p>
                                {edu.description && (
                                  <p className="text-gray-300 text-sm">
                                    {edu.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Divider between institutions */}
                    {institutionIndex < allInstitutions.length - 1 && (
                      <div className="border-t border-gray-700 mt-8"></div>
                    )}
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {certifications.length > 0 && (
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-primary mb-8">
            Certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert._id}
                className=" border-[#2b1b47] bg-[#13182f] border rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow"
              >
                {cert.image ? (
                  <div
                    className="w-full h-48 bg-gradient-to-br from-secondary to-accent overflow-hidden relative cursor-pointer group"
                    onClick={() => setSelectedCertImage(cert.image)}
                  >
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-semibold">
                        Click to view
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                    <span className="text-white text-4xl">🏆</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-1">
                    {cert.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">{cert.issuer}</p>

                  <div className="space-y-2 text-sm text-gray-200 mb-4">
                    <p>
                      <strong>Issued:</strong>{" "}
                      {new Date(cert.issueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                    {cert.expiryDate && (
                      <p>
                        <strong>Expires:</strong>{" "}
                        {new Date(cert.expiryDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                    )}
                  </div>

                  {cert.description && (
                    <p className="text-gray-200 text-sm mb-4">
                      {cert.description}
                    </p>
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-secondary hover:underline font-semibold text-sm"
                    >
                      View Credential →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Image Modal */}
      {selectedCertImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCertImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedCertImage}
              alt="Certification"
              className="w-full h-auto object-contain max-h-[85vh]"
            />
            <button
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedCertImage(null)}
              aria-label="Close modal"
            >
              <X className="w-8 h-8" />
            </button>
            <p className="text-white text-center mt-4 text-sm">
              Press ESC or click outside to close
            </p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className=" p-12 rounded-lg text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Let's Work Together
        </h2>
        <p className="text-gray-300 mb-6">
          Have a project in mind? I'd love to help bring your ideas to life.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 bg-secondary text-white  bg-[#13182f] rounded-lg hover:opacity-90 transition font-semibold"
        >
          Get In Touch
        </Link>
      </div>
    </div>
  );
}
