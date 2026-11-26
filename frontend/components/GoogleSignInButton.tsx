"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { RefreshCw, KeyRound, Sparkles, X, ExternalLink, ShieldCheck } from "lucide-react";

export function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

interface GoogleSignInButtonProps {
  onError?: (msg: string) => void;
  fullWidth?: boolean;
  label?: string;
}

export function GoogleSignInButton({
  onError,
  fullWidth = false,
  label = "Google",
}: GoogleSignInButtonProps) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customClientId, setCustomClientId] = useState("");
  const [gsiReady, setGsiReady] = useState(false);

  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    (typeof window !== "undefined" ? localStorage.getItem("google_client_id") || "" : "");

  // Dynamically load Google Identity Services script
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ((window as any).google?.accounts?.oauth2) {
      setGsiReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGsiReady(true);
    document.body.appendChild(script);

    return () => {
      // Keep script in body for page transitions
    };
  }, []);

  const triggerGoogleOAuth = (targetClientId: string) => {
    if (!targetClientId) {
      setShowConfigModal(true);
      return;
    }

    try {
      const google = (window as any).google;
      if (!google?.accounts?.oauth2) {
        onError?.("Google Identity Services is still loading. Please retry in a moment.");
        return;
      }

      setLoading(true);
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: targetClientId,
        scope: "email profile openid",
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            setLoading(false);
            onError?.(tokenResponse.error_description || tokenResponse.error || "Google sign-in canceled");
            return;
          }

          if (tokenResponse.access_token) {
            try {
              await loginWithGoogle({ access_token: tokenResponse.access_token });
            } catch (err: any) {
              onError?.(err.message || "Failed to authenticate with backend using Google account.");
            } finally {
              setLoading(false);
            }
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: "consent" });
    } catch (err: any) {
      setLoading(false);
      onError?.(err.message || "Error launching Google authentication window.");
    }
  };

  const handleClick = () => {
    if (!clientId) {
      setShowConfigModal(true);
    } else {
      triggerGoogleOAuth(clientId);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setShowConfigModal(false);
    try {
      await loginWithGoogle({
        credential: "demo-google-credential",
        email: "google.user@example.com",
        full_name: "Google Verified Candidate",
      });
    } catch (err: any) {
      onError?.(err.message || "Demo Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customClientId.trim()) return;
    localStorage.setItem("google_client_id", customClientId.trim());
    setShowConfigModal(false);
    triggerGoogleOAuth(customClientId.trim());
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/80 border border-white/10 hover:border-white/20 text-xs font-semibold text-zinc-300 hover:text-white transition-all shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed ${
          fullWidth ? "w-full" : ""
        }`}
        title="Sign in with your Google account"
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
        ) : (
          <GoogleIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
        )}
        <span>{loading ? "Authenticating..." : label}</span>
      </button>

      {/* Helpful Google OAuth Setup / Demo Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl space-y-5 text-left">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <GoogleIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Google Sign-In</h3>
                <p className="text-xs text-zinc-400">OAuth 2.0 Integration</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-2">
              <div className="font-semibold flex items-center gap-1.5 text-blue-200">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                Backend Endpoint Ready
              </div>
              <p className="text-zinc-300 leading-relaxed">
                The FastAPI backend is fully wired with Google token verification and automatic account creation.
              </p>
            </div>

            {/* Instant Demo Sign In Button */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Instant Test Option:
              </span>
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-xl hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-lg shadow-blue-500/20 transition-all"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Sign In as Demo Google Account (1-Click)</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-zinc-900 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider relative">
                Or connect your Google Cloud Client ID
              </span>
            </div>

            <form onSubmit={handleSaveCustomClientId} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Google Client ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789-xyz.apps.googleusercontent.com"
                  value={customClientId}
                  onChange={(e) => setCustomClientId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-blue-500 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-600 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={!customClientId.trim()}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl disabled:opacity-40 transition-colors"
              >
                Save & Open Google Login
              </button>
            </form>

            <div className="text-[11px] text-zinc-500 border-t border-white/5 pt-3">
              <span>To permanently configure, set </span>
              <code className="text-zinc-300 font-mono bg-zinc-950 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>
              <span> in your Vercel or local </span>
              <code className="text-zinc-300 font-mono bg-zinc-950 px-1 py-0.5 rounded">.env.local</code>.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
