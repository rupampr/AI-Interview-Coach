"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      {/* Left Section: Logo & Links */}
      <div className="flex items-center gap-8">
        <Link
          href="/dashboard"
          className="text-lg font-bold text-white-600 tracking-tight hover:text-blue-600 transition-colors"
        >
          AI Interview Coach
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/resume"
            className="text-sm font-medium text-white-600 hover:text-blue-600 transition-colors duration-200"
          >
            Resume
          </Link>
          <Link
            href="/job-description"
            className="text-sm font-medium text-white-600 hover:text-blue-600 transition-colors duration-200"
          >
            Job Descriptions
          </Link>
          <Link
            href="/progress"
            className="text-sm font-medium text-white-600 hover:text-blue-600 transition-colors duration-200"
          >
            Progress
          </Link>
        </div>
      </div>

      {/* Right Section: User & Logout */}
      <div className="flex items-center gap-5">
        <span className="text-sm font-medium text-white-600 hidden sm:block">
          {user.email}
        </span>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-100 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
