"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getReport } from "@/lib/api";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getReport(id).then(setReport).catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto px-6 py-12 text-center text-red-400">{error}</div>
      </ProtectedRoute>
    );
  }

  if (!report) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto px-6 py-12 flex justify-center">
          <p className="text-gray-400 animate-pulse">Loading report...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto w-full px-6 py-12 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-white">Interview Report</h1>

        {/* Hero Score Card */}
        <div className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center shadow-xl">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Overall score</p>
          <p className="text-6xl font-extrabold text-white">
            {report.overall_score}<span className="text-3xl text-zinc-600 font-medium">/10</span>
          </p>
        </div>

        {/* Summary Section */}
        <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <p className="text-gray-300 leading-relaxed text-lg">{report.summary_text}</p>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Strengths */}
          <div className="bg-zinc-900/60 backdrop-blur-md border border-emerald-500/20 rounded-xl p-6 shadow-lg">
            <h2 className="font-semibold text-lg text-emerald-400 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Strengths
            </h2>
            <ul className="list-disc list-outside ml-4 text-gray-300 space-y-2">
              {report.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-zinc-900/60 backdrop-blur-md border border-rose-500/20 rounded-xl p-6 shadow-lg">
            <h2 className="font-semibold text-lg text-rose-400 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Weaknesses
            </h2>
            <ul className="list-disc list-outside ml-4 text-gray-300 space-y-2">
              {report.weaknesses?.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          {/* Improvement Areas */}
          <div className="bg-zinc-900/60 backdrop-blur-md border border-blue-500/20 rounded-xl p-6 shadow-lg">
            <h2 className="font-semibold text-lg text-blue-400 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              Improvement Areas
            </h2>
            <ul className="list-disc list-outside ml-4 text-gray-300 space-y-2">
              {report.improvement_areas?.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}