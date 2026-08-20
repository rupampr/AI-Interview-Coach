import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      {/* Left Section: Logo & Links */}
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-lg font-bold text-white tracking-tight hover:text-blue-500 transition-colors"
        >
          AI Interview Coach
        </Link>
      </div>

      {/* Right Section: Auth Actions */}
      <div className="flex items-center gap-5">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-300 hover:text-blue-500 transition-colors duration-200"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-200"
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
}