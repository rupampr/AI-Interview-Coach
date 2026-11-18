"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getReport } from "@/lib/api";
import {
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  LayoutDashboard,
  PlayCircle,
  FileText,
  Share2,
} from "lucide-react";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReport(id)
      .then(setReport)
      .catch((err) => setError(err.message || "Failed to load report."))
      .finally(() => setLoading(false));
  }, [id]);

  if (error) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm max-w-md mx-auto">
            {error}
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"
          >
            &larr; Return to Dashboard
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  if (loading || !report) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 text-sm animate-pulse">Loading interview report...</p>
        </div>
      </ProtectedRoute>
    );
  }

  const overallScore = report.overall_score != null ? Number(report.overall_score).toFixed(1) : "0.0";
  const scoreNum = parseFloat(overallScore);

  const getPerformanceBadge = (score: number) => {
    if (score >= 8.5) {
      return {
        label: "Ready for Final Rounds",
        color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      };
    }
    if (score >= 7.0) {
      return {
        label: "Competitive Candidate • Minor Gaps",
        color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      };
    }
    return {
      label: "Foundations Present • Needs Targeted Review",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };
  };

  const badge = getPerformanceBadge(scoreNum);

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-10">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" /> Final Evaluation
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Interview Performance Report
            </h1>
            <p className="text-xs text-zinc-500 font-mono mt-1">Session ID: #{id.substring(0, 8)}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <Link
              href="/job-description"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-lg"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Practice Another Role
            </Link>
          </div>
        </div>

        {/* Hero Scorecard */}
        <div className="relative p-8 sm:p-12 rounded-3xl bg-zinc-900/60 border border-white/10 shadow-2xl text-center overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[200px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border ${badge.color}">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge.label}</span>
            </div>

            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                {overallScore}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-zinc-600">/ 10</span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 uppercase tracking-widest font-mono">
              Aggregated Mock Session Score
            </p>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <FileText className="w-4 h-4" /> Executive Performance Summary
          </div>
          <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-sans">
            {report.summary_text}
          </p>
        </div>

        {/* Tri-Column In-Depth Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Strengths */}
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-4 pb-3 border-b border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-base uppercase tracking-wider">
                  Key Strengths
                </h3>
              </div>
              <ul className="space-y-3">
                {report.strengths?.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="text-[11px] font-mono text-emerald-400/80 pt-4 block">
              Verified depth on candidate strengths
            </span>
          </div>

          {/* Weaknesses */}
          <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-400 mb-4 pb-3 border-b border-rose-500/20">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-base uppercase tracking-wider">
                  Blind Spots Observed
                </h3>
              </div>
              <ul className="space-y-3">
                {report.weaknesses?.map((w: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="text-[11px] font-mono text-rose-400/80 pt-4 block">
              Skill gaps targeted by the interviewer
            </span>
          </div>

          {/* Improvement Action Plan */}
          <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 mb-4 pb-3 border-b border-indigo-500/20">
                <Lightbulb className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-base uppercase tracking-wider">
                  Recommended Study Plan
                </h3>
              </div>
              <ul className="space-y-3">
                {report.improvement_areas?.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="text-[11px] font-mono text-indigo-400/80 pt-4 block">
              Action items for your next round
            </span>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">
              Ready to practice another role or round?
            </h4>
            <p className="text-xs text-zinc-400">
              Pick another saved job description or run a behavioral round to level up.
            </p>
          </div>
          <Link
            href="/job-description"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all shrink-0 self-start sm:self-auto"
          >
            <span>Start Next Session</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
