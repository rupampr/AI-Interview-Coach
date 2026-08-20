import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="h-screen w-full flex flex-col bg-zinc-950">
      <Navbar />
      <Hero />
      <About />
      <Footer />
    </div>
  );
}
