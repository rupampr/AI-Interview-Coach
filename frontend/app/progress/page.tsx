"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getProgressHistory } from "@/lib/api";
import {
  TrendingUp,
  Sparkles,
  Award,
  Calendar,
  Layers,
  Code2,
  Users,
  Cpu,
  Briefcase,
  PlayCircle,
  ArrowRight,
} from "lucide-react";

export default function ProgressPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProgressHistory()
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Group by category
  const byCategory: Record<string, any[]> = {};
  entries.forEach((e) => {
    const cat = e.category || "general";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(e);
  });

  const totalEntries = entries.length;
  const overallAvg =
    totalEntries > 0
      ? (entries.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0) / totalEntries).toFixed(1)
      : "0.0";

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "technical":
        return Code2;
      case "behavioral":
        return Users;
      case "dsa":
        return Cpu;
      case "hr":
        return Briefcase;
      default:
        return Layers;
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5" /> Performance Analytics
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Progress & Mastery History
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Track how your answers are scoring over time across all interview categories.
            </p>
          </div>

          <Link
            href="/job-description"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg self-start sm:self-auto"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Practice Mock Interview</span>
          </Link>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-xl">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Average Answer Score
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl sm:text-4xl font-black text-blue-400">{overallAvg}</span>
              <span className="text-xs text-zinc-500 font-medium">/ 10</span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">Calculated across all evaluated responses</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-xl">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Total Questions Evaluated
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl sm:text-4xl font-black text-white">{totalEntries}</span>
              <span className="text-xs text-zinc-500 font-medium">questions</span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">Scored by AI across all interview rounds</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-xl">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Active Category Tracks
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl sm:text-4xl font-black text-purple-400">
                {Object.keys(byCategory).length}
              </span>
              <span className="text-xs text-zinc-500 font-medium">tracks</span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">Technical, Behavioral, DSA, HR</p>
          </div>
        </div>

        {/* History Grouped by Category */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Performance by Category
          </h2>

          {loading ? (
            <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-400 text-sm animate-pulse">
              Loading progress records...
            </div>
          ) : Object.keys(byCategory).length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-dashed border-zinc-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">No completed interviews yet</h3>
                <p className="text-sm text-zinc-400 max-w-sm mx-auto">
                  Launch a mock interview session to start logging your score history and tracking improvements.
                </p>
              </div>
              <Link
                href="/job-description"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors shadow-lg"
              >
                <span>Select a Role to Practice</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(byCategory).map(([category, catEntries]) => {
                const Icon = getCategoryIcon(category);
                const catAvg = (
                  catEntries.reduce((acc, c) => acc + (Number(c.score) || 0), 0) /
                  catEntries.length
                ).toFixed(1);

                return (
                  <div
                    key={category}
                    className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-xl space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white capitalize">{category}</h3>
                            <span className="text-xs text-zinc-500 font-mono">
                              {catEntries.length} evaluation{catEntries.length === 1 ? "" : "s"}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] font-semibold text-zinc-400 uppercase">Average</span>
                          <p className="text-xl font-black text-blue-400">{catAvg}/10</p>
                        </div>
                      </div>

                      {/* Log list */}
                      <div className="divide-y divide-white/5 mt-2">
                        {catEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center justify-between py-3 text-xs"
                          >
                            <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                              {new Date(entry.recorded_at).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span className="px-2.5 py-1 rounded-full font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {entry.score} / 10
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
