"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Mahamudul Hassan</h3>
            <p className="text-gray-400">
              Full-Stack Developer | Open to opportunities
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-accent transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-accent transition">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-accent transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@example.com"
                  className="hover:text-accent transition"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-accent transition">
                  Resume
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition">
                  Case Studies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>
            &copy; {currentYear} Mahamudul Hassan Barshan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
