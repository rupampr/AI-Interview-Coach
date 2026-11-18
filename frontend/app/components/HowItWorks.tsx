import { Upload, FileText, Bot, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Resume",
    description:
      "Drop in your PDF resume. Our parser instantly extracts your verified technical skills, libraries, frameworks, and past experience.",
    highlight: "PyMuPDF Automated Parsing",
  },
  {
    step: "02",
    icon: FileText,
    title: "Paste the Job Description",
    description:
      "Paste the job post for your dream role. Sentence-Transformers compute dense vector embeddings to highlight matching and missing skills.",
    highlight: "Dense Vector Similarity",
  },
  {
    step: "03",
    icon: Bot,
    title: "Practice Adaptive Questions",
    description:
      "Gemini generates questions specifically tailored to test your skill gaps and verify depth on your claimed strengths across diverse rounds.",
    highlight: "Dynamic Gap Probing",
  },
  {
    step: "04",
    icon: Trophy,
    title: "Review Your Scorecard",
    description:
      "Receive transparent ratings on 5 key dimensions plus concrete feedback on what to practice next to ace the actual interview.",
    highlight: "5-Dimension Analytics",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-zinc-900/30 border-y border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Four Simple Steps
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-5">
            How the AI Coaching Engine Works
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            A battle-tested workflow designed to take you from uncertain to completely prepared in minutes.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map(({ step, icon: Icon, title, description, highlight }, idx) => (
            <div
              key={step}
              className="relative p-6 rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-zinc-700 group-hover:text-indigo-400 font-mono transition-colors">
                    {step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  {description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5">
                <span className="inline-block text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                  {highlight}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action below steps */}
        <div className="mt-14 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Ready to try your first mock interview?</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
