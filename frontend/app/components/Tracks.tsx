import { Code2, Users, Cpu, Briefcase, Check } from "lucide-react";
import Link from "next/link";

const tracks = [
  {
    icon: Code2,
    title: "Technical Engineering",
    type: "technical",
    badge: "Most Popular",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    description:
      "Deep dive into frameworks, API architectures, databases, concurrency, and performance tuning.",
    topics: [
      "REST & GraphQL API Design",
      "Database Optimization & Indexing",
      "Distributed Caching & Redis",
      "Microservices & Concurrency",
    ],
    sampleQuestion:
      "How would you optimize an SQL query joining tables with 10M rows to avoid full-table scans?",
  },
  {
    icon: Users,
    title: "Behavioral & Leadership",
    type: "behavioral",
    badge: "STAR Method",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    description:
      "Master situational leadership, cross-functional collaboration, tight deadlines, and conflict resolution.",
    topics: [
      "Handling Engineering Disagreements",
      "Managing Urgent Production Outages",
      "Mentoring Junior Teammates",
      "Prioritizing Technical Debt vs Features",
    ],
    sampleQuestion:
      "Tell me about a time when a critical release failed in production. How did you handle stakeholder communications and post-mortem?",
  },
  {
    icon: Cpu,
    title: "DSA & Problem Solving",
    type: "dsa",
    badge: "Algorithmic Depth",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    description:
      "Explain time/space complexity, trade-offs, and algorithmic patterns clearly without getting stuck.",
    topics: [
      "Dynamic Programming & Memoization",
      "Graph Traversals (BFS / DFS / Dijkstra)",
      "Trees & Trie Architectures",
      "Sliding Window & Two-Pointer Patterns",
    ],
    sampleQuestion:
      "Explain how you would design an autocomplete system for search queries using a Trie data structure, and calculate its memory overhead.",
  },
  {
    icon: Briefcase,
    title: "HR & Culture Alignment",
    type: "hr",
    badge: "Confidence & Pitch",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    description:
      "Polish your career narrative, salary expectations, role motivations, and cultural contributions.",
    topics: [
      "Personal Introduction & Elevator Pitch",
      "Why This Company & Role",
      "Long-term Career Aspirations",
      "Work-Life Balance & Self-Management",
    ],
    sampleQuestion:
      "Why are you transitioning from your current role, and what specific impact do you aim to make within your first 90 days here?",
  },
];

export default function Tracks() {
  return (
    <section id="tracks" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Customized Interview Tracks
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-5">
            Tailored for Every Stage of the Hiring Loop
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            Switch between technical, behavioral, and algorithmic rounds with one click.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.map(
            ({ icon: Icon, title, badge, badgeColor, description, topics, sampleQuestion }) => (
              <div
                key={title}
                className="p-7 rounded-2xl bg-zinc-900/40 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        {title}
                      </h3>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeColor}`}
                    >
                      {badge}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    {description}
                  </p>

                  {/* Topics List */}
                  <div className="space-y-2 mb-6">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Key Evaluation Areas:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {topics.map((topic) => (
                        <div key={topic} className="flex items-center gap-2 text-xs text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sample Prompt Box */}
                <div className="mt-4 p-4 rounded-xl bg-zinc-950/70 border border-white/5">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                    Sample Question Preview
                  </span>
                  <p className="text-xs text-zinc-300 italic font-sans leading-relaxed">
                    &ldquo;{sampleQuestion}&rdquo;
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
