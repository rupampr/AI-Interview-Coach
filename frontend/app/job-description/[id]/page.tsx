"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getJobDescription, matchResumeToJD, startInterview } from "@/lib/api";

const INTERVIEW_TYPES = ["technical", "behavioral", "dsa", "hr"];

export default function JobDescriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [jd, setJd] = useState<any>(null);
  const [match, setMatch] = useState<any>(null);
  const [matching, setMatching] = useState(false);
  const [interviewType, setInterviewType] = useState("technical");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

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
      setError(err.message);
    } finally {
      setMatching(false);
    }
  };

  const handleStartInterview = async () => {
    setError("");
    setStarting(true);
    try {
      const interview = await startInterview(id, interviewType, 5);
      router.push(`/interview/${interview.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setStarting(false);
    }
  };

  if (!jd) {
    return (
      <ProtectedRoute>
        <div className="max-w-3xl mx-auto w-full px-6 py-12 flex justify-center">
          <p className="text-gray-400 animate-pulse">Loading description...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto w-full px-6 py-12 flex flex-col gap-6">
        
        <h1 className="text-3xl font-bold text-white mb-2">{jd.title || "Untitled role"}</h1>
        
        <div className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl">
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {jd.raw_text}
          </p>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Resume Match Section */}
        <div className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Resume Match</h2>
          
          <button
            onClick={handleMatch}
            disabled={matching}
            className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 px-6 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {matching ? "Analyzing Match..." : "Run Match"}
          </button>

          {match && (
            <div className="space-y-5 border-t border-zinc-800 pt-5 mt-2">
              <div className="flex items-center gap-3">
                <span className="text-gray-400">Similarity score:</span>
                <span className="text-2xl font-bold text-blue-400">
                  {(match.similarity_score * 100).toFixed(0)}%
                </span>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Matched skills</p>
                <div className="flex flex-wrap gap-2">
                  {match.matched_skills.map((s: string) => (
                    <span key={s} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm px-3 py-1.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 mt-4">Missing skills</p>
                <div className="flex flex-wrap gap-2">
                  {match.missing_skills.map((s: string) => (
                    <span key={s} className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm px-3 py-1.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Start Interview Section */}
        <div className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-4">Start Mock Interview</h2>
            <label className="block text-sm text-gray-400 mb-2">Select focus area</label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              {INTERVIEW_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleStartInterview}
            disabled={starting}
            className="backdrop-blur-md bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 font-medium py-3 px-6 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed h-[50px] whitespace-nowrap"
          >
            {starting ? "Generating..." : "Start Interview"}
          </button>
        </div>

      </div>
    </ProtectedRoute>
  );
}