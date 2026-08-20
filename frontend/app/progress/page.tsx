"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getProgressHistory } from "@/lib/api";

export default function ProgressPage() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    getProgressHistory().then(setEntries).catch(() => {});
  }, []);

  // Group by category for simple display
  const byCategory: Record<string, any[]> = {};
  entries.forEach((e) => {
    const cat = e.category || "general";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(e);
  });

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto w-full px-6 py-12 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-white mb-2">Progress History</h1>

        {Object.keys(byCategory).length === 0 ? (
          <div className="text-center p-10 border border-dashed border-zinc-700 rounded-xl bg-zinc-900/30">
            <p className="text-gray-400">No completed interviews yet.</p>
            <p className="text-sm text-gray-500 mt-1">Start a mock interview to track your progress here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {Object.entries(byCategory).map(([category, catEntries]) => (
              <div 
                key={category} 
                className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h2 className="text-xl font-semibold capitalize text-white">
                    {category}
                  </h2>
                </div>
                
                <div className="flex flex-col">
                  {catEntries.map((entry) => (
                    <div 
                      key={entry.id} 
                      className="flex justify-between items-center py-3 border-b border-white/5 last:border-0"
                    >
                      <span className="text-sm font-medium text-gray-400">
                        {new Date(entry.recorded_at).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-sm font-bold">
                        {entry.score}/10
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}