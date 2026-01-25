"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky w-full">
      <nav className=" mx-auto max-w-6xl px-6 py-4 flex justify-between items-center text-white z-50 backdrop-blur-2xl bg-blue-950/10 shadow-2xl rounded-md">
        <Link href="/" className="text-2xl font-bold text-primary text-white">
          MHB
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-white">
          <Link
            href="/about"
            className="text-gray-700 hover:text-secondary transition font-medium text-white"
          >
            About
          </Link>
          <Link
            href="/projects"
            className="text-gray-700 hover:text-secondary transition font-medium text-white"
          >
            Projects
          </Link>
          <Link
            href="/blog"
            className="text-gray-700 hover:text-secondary transition font-medium text-white"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-secondary transition font-medium text-white"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col space-y-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="w-6 h-0.5 bg-primary"></div>
          <div className="w-6 h-0.5 bg-primary"></div>
          <div className="w-6 h-0.5 bg-primary"></div>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden backdrop-blur-xl bg-gradient-to-b from-white/80 to-white/60 border-t border-white/30 px-6 py-4 space-y-4 rounded-md">
          <Link
            href="/about"
            className="block text-gray-700 hover:text-secondary transition font-medium text-white"
          >
            About
          </Link>
          <Link
            href="/projects"
            className="block text-gray-700 hover:text-secondary transition font-medium text-white"
          >
            Projects
          </Link>
          <Link
            href="/blog"
            className="block text-gray-700 hover:text-secondary transition font-medium text-white"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="block text-gray-700 hover:text-secondary transition font-medium text-white"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
