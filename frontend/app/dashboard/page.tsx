"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getMyResume, listJobDescriptions, listInterviews } from "@/lib/api";
import {
  FileText,
  Briefcase,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  PlayCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Layers,
} from "lucide-react";

export default function DashboardPage() {
  const [hasResume, setHasResume] = useState<boolean | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [jdCount, setJdCount] = useState(0);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getMyResume().then((res) => {
        setHasResume(true);
        setResumeData(res);
      }).catch(() => setHasResume(false)),
      listJobDescriptions().then((data) => setJdCount(data.length)).catch(() => {}),
      listInterviews().then(setInterviews).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const completedCount = interviews.filter((i) => i.status === "completed").length;

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto w-full px-6 py-10 flex flex-col gap-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Candidate Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Interview Dashboard
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-1">
              Track your mock sessions, analyze resume skill gaps, and prepare for your dream role.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/job-description"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Start Mock Interview</span>
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resume Intelligence Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Resume Intelligence
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-2xl font-bold ${hasResume ? "text-emerald-400" : "text-amber-400"}`}>
                  {hasResume === null ? "Checking..." : hasResume ? "Resume Parsed" : "No Resume"}
                </span>
              </div>

              <p className="text-xs text-zinc-400 mb-6">
                {hasResume && resumeData?.extracted_data?.skills
                  ? `${resumeData.extracted_data.skills.length} technical skills extracted and ready for gap analysis`
                  : "Upload your PDF resume to unlock personalized gap probing"}
              </p>
            </div>

            <Link
              href="/resume"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors pt-3 border-t border-white/5"
            >
              {hasResume ? "View Extracted Skills" : "Upload Resume"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Job Descriptions Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Target Job Descriptions
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold text-white">{jdCount}</span>
                <span className="text-xs text-zinc-500 font-medium">roles saved</span>
              </div>

              <p className="text-xs text-zinc-400 mb-6">
                Sentence-Transformers compute dense vector similarity against each role.
              </p>
            </div>

            <Link
              href="/job-description"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors pt-3 border-t border-white/5"
            >
              Manage Saved Roles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Practice Sessions Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Practice Sessions
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold text-white">{interviews.length}</span>
                <span className="text-xs text-zinc-500 font-medium">
                  ({completedCount} completed)
                </span>
              </div>

              <p className="text-xs text-zinc-400 mb-6">
                Instant dimensional scoring on clarity, technical depth, and communication.
              </p>
            </div>

            <Link
              href="/progress"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors pt-3 border-t border-white/5"
            >
              View Performance Analytics
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Recent Interviews Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Recent Practice Sessions
            </h2>
            {interviews.length > 0 && (
              <span className="text-xs text-zinc-400 font-mono">
                {interviews.length} total session{interviews.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-white/5">
              <p className="text-sm text-zinc-400 animate-pulse">Loading sessions...</p>
            </div>
          ) : interviews.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-dashed border-zinc-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">No mock interviews yet</h3>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">
                  Pick a target role or paste a new job description to begin your first adaptive AI interview session.
                </p>
              </div>
              <Link
                href="/job-description"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors shadow-lg"
              >
                <PlusCircle className="w-4 h-4" />
                Go to Saved Roles
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {interviews.map((iv) => {
                const isCompleted = iv.status === "completed";
                const targetUrl = isCompleted
                  ? `/interview/${iv.id}/report`
                  : `/interview/${iv.id}`;

                return (
                  <Link
                    key={iv.id}
                    href={targetUrl}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-white/10 hover:border-white/20 transition-all duration-200 shadow-lg group gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors shrink-0">
                        {isCompleted ? (
                          <Award className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="font-semibold text-white group-hover:text-blue-300 transition-colors capitalize">
                            {iv.interview_type || "General"} Interview
                          </span>
                          <span className="text-xs text-zinc-500 font-mono">
                            #{iv.id.substring(0, 8)}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">
                          {isCompleted
                            ? "Completed • Click to review detailed report card"
                            : "In progress • Click to resume question session"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          isCompleted
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            In Progress
                          </>
                        )}
                      </span>
                      <span className="text-xs font-medium text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        {isCompleted ? "Scorecard" : "Resume"} &rarr;
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
