import Link from "next/link";

const links = [
  { label: "Log in", href: "/login" },
  { label: "Sign up", href: "/register" },
];

export default function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-white/10 bg-zinc-900/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-medium text-gray-400">
          © {new Date().getFullYear()} AI Interview Coach
        </span>
        <div className="flex items-center gap-6">
          {links.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
