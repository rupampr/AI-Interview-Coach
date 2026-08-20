"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getMyResume, listJobDescriptions, listInterviews } from "@/lib/api";

export default function DashboardPage() {
  const [hasResume, setHasResume] = useState<boolean | null>(null);
  const [jdCount, setJdCount] = useState(0);
  const [interviews, setInterviews] = useState<any[]>([]);

  useEffect(() => {
    getMyResume().then(() => setHasResume(true)).catch(() => setHasResume(false));
    listJobDescriptions().then((data) => setJdCount(data.length)).catch(() => {});
    listInterviews().then(setInterviews).catch(() => {});
  }, []);

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto w-full px-6 py-12 flex flex-col gap-8">
        
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Resume Card */}
          <div className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Resume</p>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <p className={`text-2xl font-bold mb-4 ${hasResume ? 'text-emerald-400' : 'text-gray-500'}`}>
              {hasResume === null ? "..." : hasResume ? "Uploaded" : "Not uploaded"}
            </p>
            <Link href="/resume" className="mt-auto text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1">
              {hasResume ? "Update resume" : "Upload resume"} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Job Descriptions Card */}
          <div className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Saved Roles</p>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-3xl font-bold text-white mb-4">{jdCount}</p>
            <Link href="/job-description" className="mt-auto text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1">
              Manage roles <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Interviews Card */}
          <div className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Interviews</p>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-3xl font-bold text-white mb-4">{interviews.length}</p>
            <Link href="/progress" className="mt-auto text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1">
              View progress <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

        </div>

        {/* Recent Interviews Section */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Interviews</h2>
          
          <div className="space-y-3">
            {interviews.map((iv) => (
              <Link
                key={iv.id}
                href={
                  iv.status === "completed"
                    ? `/interview/${iv.id}/report`
                    : `/interview/${iv.id}`
                }
                className="flex items-center justify-between bg-zinc-900/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/5 hover:border-white/20 transition-all shadow-lg group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-blue-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-200 group-hover:text-white transition-colors capitalize">
                      {iv.interview_type} Interview
                    </span>
                    <span className="text-xs text-gray-500">
                      ID: {iv.id.substring(0, 8)}...
                    </span>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${
                  iv.status === 'completed' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {iv.status}
                </span>
              </Link>
            ))}
            
            {interviews.length === 0 && (
              <div className="text-center p-8 border border-dashed border-zinc-700 rounded-xl bg-zinc-900/30 text-gray-500">
                <p>No interviews yet.</p>
                <Link href="/job-descriptions" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
                  Go to Saved Roles to start one &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}