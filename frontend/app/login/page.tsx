"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { saveToken } from "@/lib/auth";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotMsg, setShowForgotMsg] = useState(false);
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isJustRegistered = searchParams.get("registered") === "true";

  useEffect(() => {
    const googleToken = searchParams.get("google_token");
    const oauthError = searchParams.get("error");
    if (oauthError) {
      setError(oauthError);
    } else if (googleToken) {
      setLoading(true);
      saveToken(googleToken);
      window.location.href = "/dashboard";
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("demo@interviewcoach.ai");
    setPassword("DemoPass123!");
    setError("");
  };

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Back Button Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800/80 px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <button
          type="button"
          onClick={handleDemoFill}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all"
          title="Autofill sample test credentials"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Fill Demo</span>
        </button>
      </div>

      {/* Main Glass Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-7 relative">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              AI Interview<span className="text-blue-500">Coach</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Sign in to access your resumes, target roles, and interview scores.
          </p>
        </div>

        {/* Registered Success Banner */}
        {isJustRegistered && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>Account created successfully! Please enter your password to sign in.</span>
          </div>
        )}

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Forgot Password Helper Box */}
        {showForgotMsg && (
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Password Recovery
            </p>
            <p className="text-zinc-400">
              In this environment, you can register a new account or reset your password directly by re-registering your email address.
            </p>
          </div>
        )}

        {/* Google Sign In Button */}
        <div>
          <GoogleSignInButton onError={(msg) => setError(msg)} label="Continue with Google" fullWidth />
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-zinc-900/90 px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider relative">
            Or continue with email
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-950/70 border border-zinc-700 focus:border-blue-500 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder-zinc-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotMsg(!showForgotMsg)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-950/70 border border-zinc-700 focus:border-blue-500 text-white rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder-zinc-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-400 hover:text-zinc-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-700 text-blue-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
              />
              <span>Remember this session</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-xl hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-3"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="text-center pt-2 border-t border-white/5 space-y-2">
          <p className="text-xs sm:text-sm text-zinc-400">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-6 py-12 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      <Suspense fallback={<div className="text-zinc-400 text-sm animate-pulse">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
