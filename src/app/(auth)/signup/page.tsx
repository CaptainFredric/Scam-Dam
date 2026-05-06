"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function safeNext(raw: string | null): string {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      localStorage.setItem("scamdam_demo_user", JSON.stringify({ email, id: "demo" }));
      document.cookie = `scamdam_demo_user=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      router.push(next);
      router.refresh();
      return;
    }

    try {
      const { createBrowserClient } = await import("@supabase/ssr");
      const supabase = createBrowserClient(supabaseUrl, supabaseKey);
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo },
      });
      if (authError) {
        setError(authError.message);
        return;
      }
      // If email confirmation is enabled in Supabase, the user has no
      // session yet — show a "check your email" state. Otherwise we have
      // a session and can drop them on the dashboard.
      if (data.session) {
        router.push(next);
        router.refresh();
      } else {
        setVerificationSent(true);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-slate-400 text-sm mb-4">
          We&apos;ve sent a verification link to{" "}
          <strong className="text-white">{email}</strong>. Click it to finish setting
          up your account.
        </p>
        <p className="text-slate-500 text-xs mb-6">
          Don&apos;t see it? Check spam, or wait a minute and try resending below.
        </p>
        <button
          onClick={() => setVerificationSent(false)}
          className="block text-center w-full border border-slate-600 hover:border-slate-500 text-slate-200 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Use a different email
        </button>
      </div>
    );
  }

  const isDemoMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div>
      {isDemoMode && (
        <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-md px-4 py-3 text-yellow-400 text-sm">
          <strong>Demo Mode</strong> — Supabase is not configured. Data is saved
          locally in your browser.
        </div>
      )}
      <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
      <p className="text-slate-400 text-sm mb-6">
        Already have an account?{" "}
        <Link href="/login" className="text-red-400 hover:text-red-300">
          Sign in
        </Link>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-slate-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-slate-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm text-slate-300 mb-1">
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            placeholder="••••••••"
          />
        </div>
        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-2 px-4 rounded-md font-medium transition-colors text-sm"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
