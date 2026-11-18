import { TrendingUp, Award, Zap, Brain } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: "94%",
    label: "Interview Pass Rate",
    description: "Candidates reported feeling significantly more prepared",
  },
  {
    icon: Zap,
    value: "< 1.5s",
    label: "Real-time AI Feedback",
    description: "Instant dimensional evaluation after every answer",
  },
  {
    icon: Brain,
    value: "50+",
    label: "Tech & Soft Skills Tracked",
    description: "From System Design & PyTorch to STAR behavioral",
  },
  {
    icon: Award,
    value: "100%",
    label: "Customized to Your Resume",
    description: "Adaptive probing focused strictly on your skill gaps",
  },
];

export default function Stats() {
  return (
    <section className="py-14 border-y border-white/10 bg-zinc-900/40 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, value, label, description }) => (
            <div
              key={label}
              className="flex flex-col items-center sm:items-start text-center sm:text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                {value}
              </div>
              <div className="text-sm font-semibold text-zinc-300 mb-1">
                {label}
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
