"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Brain,
  ShieldCheck,
  Zap,
  Play,
  Award,
  TrendingUp,
  FileText,
} from "lucide-react";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"question" | "evaluation">("evaluation");

  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md shadow-inner shadow-blue-500/20 hover:border-blue-500/50 transition-colors">
          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
          <span>Powered by Gemini & Semantic Resume Matching</span>
          <span className="text-blue-500">•</span>
          <span className="text-zinc-400">v2.0 Ready</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl leading-[1.1] mb-6">
          Master Your Next Interview with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Real-Time AI Coaching
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Upload your resume, target any job description, and practice realistic mock interviews tailored specifically to your skill gaps with instant, dimensional scoring.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-xl hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            Start Free Mock Interview
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#interactive-demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-medium text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800/80 border border-white/10 hover:border-white/20 rounded-xl backdrop-blur-md transition-all duration-200"
          >
            <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
            See Live Demo
          </a>
        </div>

        {/* Trust Points */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-zinc-400 border-y border-white/5 py-4 w-full max-w-3xl mb-16">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>PDF Resume Parser</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Dynamic Skill Gap Probing</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>5-Metric Evaluation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Technical & Behavioral</span>
          </div>
        </div>

        {/* Interactive Live Mock Interview Showcase */}
        <div id="interactive-demo" className="w-full max-w-4xl mx-auto text-left">
          <div className="relative rounded-2xl border border-white/15 bg-zinc-900/70 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden">
            {/* Window Topbar */}
            <div className="px-5 py-3.5 border-b border-white/10 bg-zinc-950/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-mono text-zinc-400 hidden sm:inline">
                  ai-interview-session :: live_preview
                </span>
              </div>

              {/* Toggle View Tabs */}
              <div className="flex items-center p-1 bg-zinc-900 rounded-lg border border-white/10 text-xs font-medium">
                <button
                  onClick={() => setActiveTab("question")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "question"
                      ? "bg-blue-600 text-white shadow"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Question & Answer
                </button>
                <button
                  onClick={() => setActiveTab("evaluation")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "evaluation"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  AI Live Evaluation
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Meta details bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Technical Round
                  </span>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Difficulty: Medium
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Question 2 of 5</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Target: Full-Stack Engineer (Node + FastAPI + Redis)</span>
                </div>
              </div>

              {activeTab === "question" ? (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Question Box */}
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/10">
                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5" /> AI Interviewer
                    </p>
                    <p className="text-base sm:text-lg text-white font-medium">
                      &ldquo;How would you architect a distributed caching layer with Redis to protect your database during traffic spikes, and what strategy would you use to prevent cache stampedes?&rdquo;
                    </p>
                  </div>

                  {/* Candidate Input Preview */}
                  <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/10 space-y-2">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Your Response (Speech or Text)
                    </p>
                    <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                      &ldquo;I would place Redis as an in-memory cache-aside layer before PostgreSQL. To mitigate cache stampedes (thundering herd), I&apos;d implement mutual exclusion locks using Redis SETNX with TTL, combined with probabilistic early expiration (XFetch algorithm) so hot keys are refreshed in the background before they truly expire.&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500 pt-2">
                    <span>Probed skills: <span className="text-zinc-300 font-medium">Redis, Distributed Systems, Caching</span></span>
                    <button
                      onClick={() => setActiveTab("evaluation")}
                      className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                    >
                      View AI Scorecard &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Score Summary Header */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-950/80 border border-white/10">
                    <div className="text-center sm:text-left">
                      <span className="text-xs text-zinc-400 uppercase font-medium">Overall Score</span>
                      <div className="flex items-baseline gap-1 mt-1 justify-center sm:justify-start">
                        <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">9.2</span>
                        <span className="text-xs text-zinc-500">/ 10</span>
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="text-xs text-zinc-400 uppercase font-medium">Technical Depth</span>
                      <div className="flex items-baseline gap-1 mt-1 justify-center sm:justify-start">
                        <span className="text-2xl sm:text-3xl font-bold text-white">9.5</span>
                        <span className="text-xs text-zinc-500">/ 10</span>
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="text-xs text-zinc-400 uppercase font-medium">Clarity</span>
                      <div className="flex items-baseline gap-1 mt-1 justify-center sm:justify-start">
                        <span className="text-2xl sm:text-3xl font-bold text-white">9.1</span>
                        <span className="text-xs text-zinc-500">/ 10</span>
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="text-xs text-zinc-400 uppercase font-medium">Relevance</span>
                      <div className="flex items-baseline gap-1 mt-1 justify-center sm:justify-start">
                        <span className="text-2xl sm:text-3xl font-bold text-white">9.4</span>
                        <span className="text-xs text-zinc-500">/ 10</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Box */}
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1.5">
                      <Award className="w-4 h-4" /> AI Coach Feedback
                    </div>
                    <p className="text-sm text-zinc-200 leading-relaxed">
                      &ldquo;Exceptional answer. You directly addressed cache stampedes with specific architectural patterns (mutual exclusion locks via SETNX and probabilistic early refresh). To elevate this to a staff-engineer level, briefly mention fallback behavior if the Redis cluster itself experiences network partitioning.&rdquo;
                    </p>
                  </div>

                  {/* Skills Tag Cloud */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400">Verified Skills:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">Redis</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">Cache Patterns</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">Concurrency</span>
                    </div>
                    <span className="text-zinc-500 font-mono">Response evaluated in 1.2s</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
