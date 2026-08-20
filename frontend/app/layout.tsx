import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AI Interview Coach",
  description: "Practice interviews with AI-powered feedback",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-indigo-950/90 text-gray-100 min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="max-w-4xl mx-auto p-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}