import { FileSearch, MessagesSquare, LineChart } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Resume analysis",
    description:
      "Upload your resume once. We extract your skills, experience, and gaps against any job description in seconds.",
  },
  {
    icon: MessagesSquare,
    title: "Adaptive mock interviews",
    description:
      "Questions that adjust to your role and level in real time, covering technical, behavioral, and role-specific rounds.",
  },
  {
    icon: LineChart,
    title: "Actionable feedback",
    description:
      "Get scored on clarity, technical depth, and communication after every answer, with concrete ways to improve.",
  },
];

export default function About() {
  return (
    <section className="px-6 py-24 border-t border-white/10 bg-zinc-900/40">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Everything you need to walk in ready.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            One platform that studies your resume, builds a realistic
            interview around it, and tells you exactly what to work on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/10 border border-white/20 mb-5">
                <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
