"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createJobDescription, listJobDescriptions } from "@/lib/api";
import {
  Briefcase,
  PlusCircle,
  ArrowRight,
  Sparkles,
  FileText,
  AlertCircle,
  PlayCircle,
  Clock,
  Layers,
} from "lucide-react";

export default function JobDescriptionsPage() {
  const [jds, setJds] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    listJobDescriptions()
      .then(setJds)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    setError("");
    setCreating(true);
    try {
      await createJobDescription(title, rawText);
      setTitle("");
      setRawText("");
      load();
    } catch (err: any) {
      setError(err.message || "Failed to save job description.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Target Role Manager
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Job Descriptions
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Add job posts for roles you are interviewing for to calculate skill matches and launch adaptive mock interviews.
            </p>
          </div>
        </div>

        {/* Create JD Form Card */}
        <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            Add Target Job Description
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Job Title / Company (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Full-Stack Engineer @ Stripe"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-700 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Full Job Description Text <span className="text-rose-400">*</span>
              </label>
              <textarea
                placeholder="Paste the full job requirements, responsibilities, and qualifications here..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                required
                rows={6}
                className="w-full bg-zinc-950/60 border border-zinc-700 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-zinc-500 resize-y leading-relaxed"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500">
                Pasting the full text yields higher quality semantic match results.
              </span>
              <button
                type="submit"
                disabled={creating || !rawText.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {creating ? "Saving & Indexing..." : "Save Role"}
              </button>
            </div>
          </form>
        </div>

        {/* Saved JDs List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Saved Job Roles
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              {jds.length} role{jds.length === 1 ? "" : "s"} saved
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-400 text-sm animate-pulse">
              Loading saved roles...
            </div>
          ) : jds.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-dashed border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">No job descriptions added yet</h3>
              <p className="text-sm text-zinc-400 max-w-sm mx-auto">
                Paste your first job posting above to see matched skills and practice role-specific questions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jds.map((jd) => (
                <Link
                  key={jd.id}
                  href={`/job-description/${jd.id}`}
                  className="p-6 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-white/10 hover:border-indigo-500/40 transition-all duration-200 shadow-xl flex flex-col justify-between group hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        <Briefcase className="w-3.5 h-3.5" />
                        Target Role
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">
                        #{jd.id.substring(0, 8)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-2 line-clamp-1">
                      {jd.title || "Untitled Role"}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-6">
                      {jd.raw_text}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-indigo-400">
                    <span>Run Match & Start Interview</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
