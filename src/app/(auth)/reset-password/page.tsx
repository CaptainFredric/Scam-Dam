"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [recoverySession, setRecoverySession] = useState<"checking" | "ok" | "missing">("checking");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) {
        if (!cancelled) setRecoverySession("missing");
        return;
      }
      try {
        const { createBrowserClient } = await import("@supabase/ssr");
        const supabase = createBrowserClient(url, key);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        setRecoverySession(user ? "ok" : "missing");
      } catch {
        if (!cancelled) setRecoverySession("missing");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) throw new Error("Supabase not configured");
      const { createBrowserClient } = await import("@supabase/ssr");
      const supabase = createBrowserClient(url, key);
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) {
        setError(authError.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (recoverySession === "checking") {
    return <p className="text-slate-400 text-sm">Verifying reset link…</p>;
  }

  if (recoverySession === "missing") {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Link expired or invalid</h1>
        <p className="text-slate-400 text-sm mb-6">
          Reset links expire after 1 hour and can only be used once. Request a new one
          to continue.
        </p>
        <Link
          href="/forgot-password"
          className="block text-center w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Set a new password</h1>
      <p className="text-slate-400 text-sm mb-6">
        Pick something at least 8 characters. You&apos;ll be signed in once you save.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm text-slate-300 mb-1">New password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm text-slate-300 mb-1">Confirm password</label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
          />
        </div>
        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-2 px-4 rounded-md font-medium transition-colors text-sm"
        >
          {submitting ? "Saving…" : "Save new password"}
        </button>
      </form>
    </div>
  );
}
