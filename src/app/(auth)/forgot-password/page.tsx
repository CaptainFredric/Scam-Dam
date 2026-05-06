"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      // Demo mode has no email backend.
      setError(
        "Password reset is unavailable in demo mode. Configure Supabase to enable email-based reset.",
      );
      return;
    }
    setStatus("sending");
    try {
      const { createBrowserClient } = await import("@supabase/ssr");
      const supabase = createBrowserClient(url, key);
      const redirectTo = `${window.location.origin}/auth/callback?type=recovery`;
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (authError) {
        setError(authError.message);
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-slate-400 text-sm mb-4">
          If an account exists for <strong className="text-white">{email}</strong>, we&apos;ve
          sent a password-reset link. It expires in 1 hour.
        </p>
        <p className="text-slate-500 text-xs mb-6">
          Don&apos;t see it? Check spam, then make sure you used the email you signed up with.
        </p>
        <Link
          href="/login"
          className="block text-center w-full border border-slate-600 hover:border-slate-500 text-slate-200 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Reset your password</h1>
      <p className="text-slate-400 text-sm mb-6">
        Enter the email you signed up with and we&apos;ll send you a link to set a new
        password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-slate-300 mb-1">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            placeholder="you@example.com"
          />
        </div>
        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-2 px-4 rounded-md font-medium transition-colors text-sm"
        >
          {status === "sending" ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <p className="text-slate-500 text-sm mt-6 text-center">
        Remember it?{" "}
        <Link href="/login" className="text-red-400 hover:text-red-300">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
