"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createJobDescription, listJobDescriptions } from "@/lib/api";

export default function JobDescriptionsPage() {
  const [jds, setJds] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const load = () => {
    listJobDescriptions().then(setJds).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      await createJobDescription(title, rawText);
      setTitle("");
      setRawText("");
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto w-full px-6 py-12 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-white mb-2">Job Descriptions</h1>

        {/* Add JD Form */}
        <form 
          onSubmit={handleCreate} 
          className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl space-y-5"
        >
          <input
            type="text"
            placeholder="Job Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-500"
          />
          
          <textarea
            placeholder="Paste job description text here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            required
            rows={6}
            className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-500 resize-y"
          />
          
          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={creating}
            className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 px-6 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          >
            {creating ? "Saving..." : "Add job description"}
          </button>
        </form>

        {/* Saved JDs List */}
        <div className="space-y-3 mt-4">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">Saved Roles</h2>
          
          {jds.map((jd) => (
            <Link
              key={jd.id}
              href={`/job-description/${jd.id}`}
              className="flex items-center justify-between bg-zinc-900/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/5 hover:border-white/20 transition-all shadow-lg group"
            >
              <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                {jd.title || "Untitled role"}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
          
          {jds.length === 0 && (
            <div className="text-center p-8 border border-dashed border-zinc-700 rounded-xl text-gray-500">
              No job descriptions added yet.
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}