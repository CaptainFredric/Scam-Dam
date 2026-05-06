"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Download, Trash2, KeyRound, CheckCircle } from "lucide-react";

type Props = {
  email: string;
  createdAt: string;
  emailConfirmedAt: string | null;
  tier: string;
};

export default function AccountSettings({ email, createdAt, emailConfirmedAt, tier }: Props) {
  return (
    <div className="space-y-6">
      <ProfileCard
        email={email}
        createdAt={createdAt}
        emailConfirmedAt={emailConfirmedAt}
        tier={tier}
      />
      <ChangePasswordCard />
      <ExportDataCard />
      <DeleteAccountCard email={email} />
    </div>
  );
}

function ProfileCard({
  email,
  createdAt,
  emailConfirmedAt,
  tier,
}: {
  email: string;
  createdAt: string;
  emailConfirmedAt: string | null;
  tier: string;
}) {
  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wider text-slate-500 mb-1">Email</dt>
          <dd className="text-white">{email}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-slate-500 mb-1">Email verified</dt>
          <dd className="text-white">
            {emailConfirmedAt ? (
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                Verified
              </span>
            ) : (
              <span className="text-amber-400">Not yet verified</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-slate-500 mb-1">Plan</dt>
          <dd className="text-white capitalize">{tier}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-slate-500 mb-1">Account created</dt>
          <dd className="text-white">{new Date(createdAt).toLocaleDateString()}</dd>
        </div>
      </dl>
    </section>
  );
}

function ChangePasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next.length < 8) {
      setMsg({ kind: "err", text: "New password must be at least 8 characters." });
      return;
    }
    if (next !== confirm) {
      setMsg({ kind: "err", text: "New passwords don't match." });
      return;
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setMsg({ kind: "err", text: "Password change requires Supabase configuration." });
      return;
    }
    setBusy(true);
    try {
      const { createBrowserClient } = await import("@supabase/ssr");
      const supabase = createBrowserClient(url, key);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) {
        setMsg({ kind: "err", text: "Not signed in." });
        return;
      }
      // Re-authenticate first to validate the current password — Supabase
      // doesn't require it for updateUser, but we want defense-in-depth.
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: current,
      });
      if (signInError) {
        setMsg({ kind: "err", text: "Current password is incorrect." });
        return;
      }
      const { error: updateError } = await supabase.auth.updateUser({ password: next });
      if (updateError) {
        setMsg({ kind: "err", text: updateError.message });
        return;
      }
      setMsg({ kind: "ok", text: "Password updated." });
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch {
      setMsg({ kind: "err", text: "Something went wrong. Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <KeyRound className="h-5 w-5 text-red-500" />
        <h2 className="text-lg font-semibold text-white">Change password</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <Field
          id="current-password"
          label="Current password"
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={setCurrent}
          required
        />
        <Field
          id="new-password"
          label="New password"
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={setNext}
          required
        />
        <Field
          id="confirm-password"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
          required
        />
        {msg && (
          <p
            className={`text-sm rounded-md px-3 py-2 ${
              msg.kind === "ok"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            {msg.text}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Update password
        </button>
      </form>
    </section>
  );
}

function ExportDataCard() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account/export");
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Could not generate export");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scam-dam-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <Download className="h-5 w-5 text-red-500" />
        <h2 className="text-lg font-semibold text-white">Export your data</h2>
      </div>
      <p className="text-slate-400 text-sm mb-4">
        Download a JSON dump of every case, timeline entry, transaction, and evidence
        record you&apos;ve created. Includes 1-hour signed URLs for any file uploads.
      </p>
      <button
        onClick={handleExport}
        disabled={busy}
        className="border border-slate-600 hover:border-slate-500 text-slate-200 px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2 disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Download export (JSON)
      </button>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </section>
  );
}

function DeleteAccountCard({ email }: { email: string }) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const phrase = "delete my account";

  async function handleDelete() {
    if (confirmText.trim().toLowerCase() !== phrase) {
      setError(`Type "${phrase}" to confirm.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { error?: string; deleted?: boolean };
      if (!res.ok || !data.deleted) {
        setError(data.error ?? "Could not delete account. Contact support.");
        return;
      }
      // Belt-and-suspenders local cleanup.
      try {
        localStorage.clear();
      } catch {
        /* ignore */
      }
      router.push("/?account_deleted=1");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-red-950/20 border border-red-900/40 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <Trash2 className="h-5 w-5 text-red-400" />
        <h2 className="text-lg font-semibold text-white">Delete account</h2>
      </div>
      <p className="text-slate-300 text-sm mb-2">
        Permanently delete <strong>{email}</strong> and all associated cases, timeline
        entries, transactions, and evidence files. Active subscriptions are
        cancelled.
      </p>
      <p className="text-slate-400 text-xs mb-4">
        This cannot be undone. Export your data first if you want a copy.
      </p>
      <div className="space-y-3 max-w-md">
        <Field
          id="confirm-delete"
          label={`Type "${phrase}" to confirm`}
          type="text"
          value={confirmText}
          onChange={setConfirmText}
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          onClick={handleDelete}
          disabled={busy || confirmText.trim().toLowerCase() !== phrase}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete account permanently
        </button>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-slate-300 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
      />
    </div>
  );
}
