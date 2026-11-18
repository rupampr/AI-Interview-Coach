"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getJobDescription, matchResumeToJD, startInterview } from "@/lib/api";
import {
  ArrowLeft,
  Sparkles,
  Target,
  Brain,
  Code2,
  Users,
  Cpu,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  RefreshCw,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const INTERVIEW_TRACKS = [
  {
    type: "technical",
    label: "Technical",
    icon: Code2,
    description: "System design, databases, API architectures, and frameworks",
  },
  {
    type: "behavioral",
    label: "Behavioral",
    icon: Users,
    description: "STAR method scenarios, leadership, teamwork, and conflict",
  },
  {
    type: "dsa",
    label: "DSA / Logic",
    icon: Cpu,
    description: "Data structures, algorithmic complexity, and problem solving",
  },
  {
    type: "hr",
    label: "HR & Culture",
    icon: Briefcase,
    description: "Motivation, team fit, career story, and compensation pitch",
  },
];

export default function JobDescriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [jd, setJd] = useState<any>(null);
  const [match, setMatch] = useState<any>(null);
  const [matching, setMatching] = useState(false);
  const [interviewType, setInterviewType] = useState("technical");
  const [questionCount, setQuestionCount] = useState(5);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [expandJD, setExpandJD] = useState(false);

  useEffect(() => {
    getJobDescription(id).then(setJd).catch((err) => setError(err.message));
  }, [id]);

  const handleMatch = async () => {
    setError("");
    setMatching(true);
    try {
      const result = await matchResumeToJD(id);
      setMatch(result);
    } catch (err: any) {
      setError(err.message || "Failed to calculate match.");
    } finally {
      setMatching(false);
    }
  };

  const handleStartInterview = async () => {
    setError("");
    setStarting(true);
    try {
      const interview = await startInterview(id, interviewType, questionCount);
      router.push(`/interview/${interview.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to start interview.");
    } finally {
      setStarting(false);
    }
  };

  if (!jd) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto w-full px-6 py-20 text-center">
          <p className="text-zinc-400 animate-pulse text-sm">Loading job description details...</p>
        </div>
      </ProtectedRoute>
    );
  }

  const matchPercentage = match?.similarity_score != null ? Math.round(match.similarity_score * 100) : null;

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
        {/* Navigation & Header */}
        <div>
          <Link
            href="/job-description"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Saved Roles
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Target className="w-3.5 h-3.5" /> Role Profile
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {jd.title || "Untitled Role"}
              </h1>
              <p className="text-xs text-zinc-500 font-mono mt-1">ID: {jd.id}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* Job Description Raw Text Box */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Job Requirements Text
            </h2>
            <button
              onClick={() => setExpandJD(!expandJD)}
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              {expandJD ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Show Full Text</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <div
            className={`text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap rounded-xl bg-zinc-950/60 p-4 border border-white/5 transition-all ${
              expandJD ? "" : "max-h-48 overflow-hidden relative"
            }`}
          >
            {jd.raw_text}
            {!expandJD && (
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
            )}
          </div>
        </div>

        {/* Semantic Resume Match Card */}
        <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Semantic Resume Matcher
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Computes 384-dimensional dense vector embeddings between your resume and this job description.
              </p>
            </div>

            <button
              onClick={handleMatch}
              disabled={matching}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all self-start sm:self-auto"
            >
              {matching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Similarity...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{match ? "Re-run Match" : "Analyze Match"}</span>
                </>
              )}
            </button>
          </div>

          {match && (
            <div className="pt-6 border-t border-white/10 space-y-6 animate-in fade-in">
              {/* Score Meter Bar */}
              <div className="p-5 rounded-xl bg-zinc-950/70 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                    Semantic Similarity Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-blue-400">
                      {matchPercentage}%
                    </span>
                    <span className="text-xs text-zinc-400">
                      {matchPercentage && matchPercentage >= 75
                        ? "• Strong Candidate Alignment"
                        : matchPercentage && matchPercentage >= 50
                        ? "• Moderate Alignment — Gap Probing Recommended"
                        : "• High Divergence — Key Skills Missing"}
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-64 h-3 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(matchPercentage || 0, 100)}%` }}
                  />
                </div>
              </div>

              {/* Matched vs Missing Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" /> Matched Skills ({match.matched_skills?.length || 0})
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Skills confirmed on both your resume and this job posting:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {match.matched_skills?.map((s: string) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >
                        {s}
                      </span>
                    ))}
                    {(!match.matched_skills || match.matched_skills.length === 0) && (
                      <span className="text-xs text-zinc-500">No direct skill overlap found.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" /> Skill Gaps To Target ({match.missing_skills?.length || 0})
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Required by this job post, but not detected in your resume:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {match.missing_skills?.map((s: string) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      >
                        {s}
                      </span>
                    ))}
                    {(!match.missing_skills || match.missing_skills.length === 0) && (
                      <span className="text-xs text-emerald-400">All required skills present!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Start Mock Interview Launcher */}
        <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-blue-400" />
              Launch Adaptive Mock Interview
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Select the round type. Gemini will synthesize role-specific questions prioritizing your detected skill gaps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {INTERVIEW_TRACKS.map(({ type, label, icon: Icon, description }) => {
              const isSelected = interviewType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInterviewType(type)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    isSelected
                      ? "bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                      : "bg-zinc-950/60 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-blue-400" : "text-zinc-500"}`} />
                    <span className="font-bold text-sm text-white">{label}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Question Count:
              </span>
              <div className="flex items-center gap-1 bg-zinc-950/70 p-1 rounded-lg border border-white/10 text-xs font-medium">
                {[3, 5, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`px-3 py-1 rounded-md transition-all ${
                      questionCount === num
                        ? "bg-blue-600 text-white font-bold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={starting}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-xl hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-xl shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {starting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Questions...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Mock Interview</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
