import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AI Interview Coach | AI-Powered Mock Interviews & Feedback",
  description: "Upload your resume, match against any job description, and practice realistic mock interviews with real-time AI scoring and feedback.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-zinc-950 text-gray-100 min-h-screen flex flex-col antialiased selection:bg-blue-600/30 selection:text-blue-200">
        <AuthProvider>
          <Navbar />
          <div className="flex-1 w-full flex flex-col">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}