"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Log In</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
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
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      
      <p className="text-sm text-gray-400 text-center mt-6">
        No account? <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Register</Link>
      </p>
    </div>
  );
}