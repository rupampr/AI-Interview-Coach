"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does the AI personalize questions to my background?",
    answer:
      "When you upload your resume (PDF), our parser extracts your technical proficiencies, frameworks, and tools. When you paste a target job description, Sentence-Transformers calculate dense vector embeddings to compute your skill overlap and highlight missing competencies. Gemini then crafts questions specifically probing those gap areas while testing depth on your claimed strengths.",
  },
  {
    question: "How are the 5 scoring dimensions evaluated?",
    answer:
      "Every answer is evaluated on a 0-10 scale across five core metrics: Technical Accuracy (depth and correctness), Relevance (how directly it answers the prompt), Completeness (coverage of edge cases and trade-offs), Clarity (structure and concise delivery), and Overall Communication. You also get 2-4 sentences of constructive tips on how to elevate your response.",
  },
  {
    question: "Can I practice both Technical and Behavioral interview rounds?",
    answer:
      "Yes! You can choose between Technical (architecture, coding concepts, systems), Behavioral (STAR method scenarios and leadership), DSA (algorithmic logic and complexity), and HR culture-fit rounds with custom question counts.",
  },
  {
    question: "Do I need to pay or provide a credit card to get started?",
    answer:
      "No credit card is required. You can sign up, upload your resume, match job descriptions, and run mock interviews completely free during development.",
  },
  {
    question: "How do I review my progress over multiple sessions?",
    answer:
      "Your user dashboard records your completed mock interviews, individual answers, question categories, and overall scores over time so you can track your growth across technical and behavioral rounds.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-zinc-900/30 border-t border-white/10 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Got questions? We&apos;ve got answers.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Everything you need to know about the platform and AI evaluation.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-xl border border-white/10 bg-zinc-950/60 transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-semibold text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? "rotate-180 text-blue-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
