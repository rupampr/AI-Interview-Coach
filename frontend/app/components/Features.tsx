import {
  FileSearch,
  Brain,
  LineChart,
  Target,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    badge: "Resume Intelligence",
    title: "Instant PDF Parsing & Skill Extraction",
    description:
      "Upload your resume once. Our parsing engine extracts your technical proficiencies, frameworks, and domain expertise across dozens of specialized skills in seconds.",
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    border: "group-hover:border-blue-500/40",
  },
  {
    icon: Target,
    badge: "Semantic Matching",
    title: "Sentence-Transformer Vector Match",
    description:
      "Paste any target job description. We generate 384-dimensional dense embeddings to compute your semantic alignment score and pinpoint exact missing skills.",
    gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
    border: "group-hover:border-indigo-500/40",
  },
  {
    icon: Brain,
    badge: "Adaptive LLM",
    title: "Gap-Targeted Interview Generation",
    description:
      "Powered by Gemini, our interviewer customizes every question to target your resume gaps while verifying your claimed strengths across easy, medium, and hard tiers.",
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    border: "group-hover:border-violet-500/40",
  },
  {
    icon: LineChart,
    badge: "Multi-Dimension Scoring",
    title: "5-Tier Answer Evaluation Engine",
    description:
      "Receive transparent ratings (0-10) on Technical Depth, Relevance, Completeness, Clarity, and Communication for every response with instant constructive feedback.",
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    border: "group-hover:border-purple-500/40",
  },
  {
    icon: Layers,
    badge: "Comprehensive Reports",
    title: "Actionable Strengths & Blind Spots",
    description:
      "Finish each round with an in-depth scorecard detailing what you nailed, specific weaknesses observed, and a prioritized study roadmap for what to review next.",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    border: "group-hover:border-emerald-500/40",
  },
  {
    icon: Sparkles,
    badge: "Continuous Progress",
    title: "Historical Progress Tracking",
    description:
      "Track your performance scores over time across Technical, Behavioral, System Design, and DSA rounds to walk into the real interview with 100% confidence.",
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    border: "group-hover:border-amber-500/40",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Powerful Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-5">
            Everything you need to walk in completely ready.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            From resume parsing to vector gap-analysis and real-time AI scoring — practice smarter with tools built for modern hiring standards.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, badge, title, description, gradient, border }) => (
            <div
              key={title}
              className={`group relative p-8 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:-translate-y-1 ${border}`}
            >
              {/* Subtle gradient wash behind card on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 font-mono">
                    {badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {title}
                </h3>

                <p className="text-sm text-zinc-400 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-medium text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity">
                <span>Included in free plan</span>
                <CheckCircle className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
