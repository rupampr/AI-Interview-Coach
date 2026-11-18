import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Tracks from "./components/Tracks";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-blue-600/30 selection:text-blue-200">
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Tracks />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
