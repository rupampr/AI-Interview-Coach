"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getInterview, submitAnswer, generateReport } from "@/lib/api";
import {
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Award,
  Send,
  RefreshCw,
  HelpCircle,
  FileCheck,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";

export default function TakeInterviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [interview, setInterview] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<any>(null);
  const [error, setError] = useState("");
  const [generatingReport, setGeneratingReport] = useState(false);

  const load = () => {
    getInterview(id).then((data) => {
      setInterview(data);
      const firstUnanswered = data.questions.findIndex((q: any) => !q.answered);
      setCurrentIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
    });
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!interview) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto w-full px-6 py-20 text-center">
          <p className="text-zinc-400 animate-pulse text-sm">Loading interview session...</p>
        </div>
      </ProtectedRoute>
    );
  }

  const questions = interview.questions || [];
  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() || !currentQuestion) return;
    setError("");
    setSubmitting(true);
    try {
      const result = await submitAnswer(currentQuestion.id, answerText);
      setLastFeedback(result);
      setAnswerText("");
    } catch (err: any) {
      setError(err.message || "Failed to submit answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextFeedback = async () => {
    if (currentIndex + 1 < questions.length) {
      setLastFeedback(null);
      setCurrentIndex(currentIndex + 1);
    } else {
      setGeneratingReport(true);
      try {
        await generateReport(id);
      } catch {
        // Report may already exist
      }
      router.push(`/interview/${id}/report`);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setLastFeedback(null);
      setAnswerText("");
      setError("");
    }
  };

  const handleSkipNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setLastFeedback(null);
      setAnswerText("");
      setError("");
    }
  };

  if (generatingReport) {
    return (
      <ProtectedRoute>
        <div className="max-w-3xl mx-auto w-full px-6 py-32 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute w-full h-full border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute w-16 h-16 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin direction-reverse" />
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Generating Comprehensive Scorecard
            </h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Our AI is evaluating your answers across 5 dimensions, aggregating strengths, and synthesizing a custom study plan...
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto w-full px-6 py-10 flex flex-col gap-6">
        {/* Top Progress & Status Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Live Session
              </span>
            </div>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-semibold text-blue-400 capitalize">
              {interview.interview_type || "Technical"} Round
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span className="text-zinc-600">({progressPercent}%)</span>
            </div>
            <div className="w-24 sm:w-32 h-2 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Current Question Card */}
        <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/10 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                {currentQuestion?.category || "General"}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                currentQuestion?.difficulty === "hard"
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : currentQuestion?.difficulty === "medium"
                  ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}>
                Difficulty: {currentQuestion?.difficulty || "Medium"}
              </span>
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              QID: {currentQuestion?.id ? currentQuestion.id.substring(0, 8) : ""}
            </span>
          </div>

          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" /> AI Interviewer Prompt
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {currentQuestion?.text}
            </h2>
          </div>
        </div>

        {/* Feedback vs Answer Submission Form */}
        {!lastFeedback ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Your Answer (Be concise, structured & thorough)
                </label>
                <span className="text-xs text-zinc-500 font-mono">
                  {answerText.length} characters
                </span>
              </div>

              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Structure your answer with key concepts, trade-offs, and concrete examples..."
                rows={7}
                required
                className="w-full bg-zinc-950/70 border border-zinc-700 focus:border-blue-500 text-white rounded-xl p-4 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder-zinc-600 resize-y leading-relaxed font-sans"
              />

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                  {error}
                </div>
              )}
            </div>

            {/* Form Action Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0 || submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white bg-zinc-900/70 border border-white/10 rounded-xl hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Question
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSkipNext}
                  disabled={currentIndex === questions.length - 1 || submitting}
                  className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-40"
                >
                  Skip for now &rarr;
                </button>

                <button
                  type="submit"
                  disabled={submitting || !answerText.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-xl hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Evaluating Answer...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Answer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Live AI Evaluation Feedback Box */
          <div className="p-8 rounded-2xl bg-zinc-900/70 border border-blue-500/30 shadow-2xl space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Answer Evaluation</h3>
                  <p className="text-xs text-zinc-400">Real-time dimensional analysis</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1.5 self-start sm:self-auto">
                <span className="text-xs uppercase font-semibold text-zinc-400 mr-1">Score:</span>
                <span className="text-3xl font-black text-emerald-400">
                  {lastFeedback.overall_score}
                </span>
                <span className="text-xs text-zinc-500">/ 10</span>
              </div>
            </div>

            {/* Optional dimension scores if returned */}
            {(lastFeedback.technical_score != null || lastFeedback.clarity_score != null) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-zinc-950/70 border border-white/10 text-center">
                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase">Technical</span>
                  <p className="text-lg font-bold text-white">{lastFeedback.technical_score ?? "-"}/10</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase">Relevance</span>
                  <p className="text-lg font-bold text-white">{lastFeedback.relevance_score ?? "-"}/10</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase">Clarity</span>
                  <p className="text-lg font-bold text-white">{lastFeedback.clarity_score ?? "-"}/10</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase">Communication</span>
                  <p className="text-lg font-bold text-white">{lastFeedback.communication_score ?? "-"}/10</p>
                </div>
              </div>
            )}

            {/* Feedback Text */}
            <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-2">
                Constructive AI Feedback:
              </span>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">
                {lastFeedback.feedback}
              </p>
            </div>

            {/* Next Action */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextFeedback}
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 transition-all"
              >
                <span>
                  {currentIndex + 1 < questions.length ? "Next Question" : "Finish & View Scorecard"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
