"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getInterview, submitAnswer, generateReport } from "@/lib/api";

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
        <div className="max-w-3xl mx-auto w-full px-6 py-12 flex justify-center">
          <p className="text-gray-400 animate-pulse">Loading interview...</p>
        </div>
      </ProtectedRoute>
    );
  }

  const questions = interview.questions;
  const currentQuestion = questions[currentIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      const result = await submitAnswer(currentQuestion.id, answerText);
      setLastFeedback(result);
      setAnswerText("");
    } catch (err: any) {
      setError(err.message);
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
        // report may already exist
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
        <div className="max-w-3xl mx-auto w-full px-6 py-32 flex flex-col items-center justify-center space-y-8">
          <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute w-full h-full border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute w-16 h-16 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin direction-reverse"></div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-white tracking-wide">Analyzing Performance</h2>
            <p className="text-gray-400">Our AI is generating your comprehensive interview report...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto w-full px-6 py-12 flex flex-col gap-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm font-medium text-gray-400 uppercase tracking-wider">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <div className="flex gap-2">
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">{currentQuestion.category}</span>
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">{currentQuestion.difficulty}</span>
          </div>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl">
          <h2 className="text-base md:text-lg font-semibold text-white leading-relaxed">
            {currentQuestion.text}
          </h2>
        </div>

        {!lastFeedback ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              required
              className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-500 resize-y text-base md:text-lg"
            />
            
            {error && <p className="text-red-400 text-sm">{error}</p>}
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0 || submitting}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-8 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Evaluating..." : "Submit Answer"}
              </button>

              <button
                type="button"
                onClick={handleSkipNext}
                disabled={currentIndex === questions.length - 1 || submitting}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-zinc-900/60 backdrop-blur-md border border-blue-500/20 rounded-xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="text-gray-400 uppercase text-sm tracking-wider font-medium">Evaluation Score:</span>
              <span className="text-2xl font-bold text-blue-400">{lastFeedback.overall_score}/10</span>
            </div>
            
            <p className="text-gray-300 leading-relaxed text-base md:text-lg">
              {lastFeedback.feedback}
            </p>
            
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextFeedback}
                className="backdrop-blur-md bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 font-medium py-3 px-8 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
              >
                {currentIndex + 1 < questions.length ? "Next Question →" : "Finish & View Report"}
              </button>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}