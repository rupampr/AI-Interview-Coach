"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { RefreshCw } from "lucide-react";

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

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

  // Load Google Identity Services SDK dynamically
  useEffect(() => {
    if (typeof window === "undefined" || !clientId) return;

    if ((window as any).google?.accounts?.oauth2) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [clientId]);

  const handleGoogleSignIn = () => {
    // 1. If client ID is available in frontend, use Google's OAuth2 Popup
    if (clientId && typeof window !== "undefined" && (window as any).google?.accounts?.oauth2) {
      try {
        setLoading(true);
        const google = (window as any).google;
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "openid email profile",
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
                onError?.(err.message || "Failed to authenticate with Google account.");
              } finally {
                setLoading(false);
              }
            }
          },
        });

        tokenClient.requestAccessToken({ prompt: "select_account" });
      } catch (err: any) {
        setLoading(false);
        // Fallback to backend redirect if popup client fails
        window.location.href = `${apiBase}/auth/google/login`;
      }
    } else {
      // 2. Direct server-side Google OAuth 2.0 redirect
      setLoading(true);
      window.location.href = `${apiBase}/auth/google/login`;
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
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
      <span>{loading ? "Connecting to Google..." : label}</span>
    </button>
  );
}
