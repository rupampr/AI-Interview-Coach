import Link from "next/link";

export default function Hero() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 text-center mt-20 mb-32">
      <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
        Nail your next interview.
      </h1>
      <p className="text-lg text-gray-400 max-w-xl mb-10">
        Upload your resume and get tailored mock interviews, instant feedback, and actionable insights powered by AI.
      </p>
      <Link href="/signup" className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-8 rounded-lg border border-white/20 hover:border-white/40 shadow-xl transition-all duration-300">
        Start Coaching Now
      </Link>
    </main>
  );
}
