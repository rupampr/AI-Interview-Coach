"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(email, password, fullName);
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-500"
        />
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-500"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-500"
        />
        
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
      
      <p className="text-sm text-gray-400 text-center mt-6">
        Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Login</Link>
      </p>
    </div>
  );
}