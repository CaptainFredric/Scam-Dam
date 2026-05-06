"use client";

import { useState } from "react";
import { Bell, Loader2 } from "lucide-react";

type Props = {
  initialStalled: boolean;
  initialMarketing: boolean;
};

export default function NotificationsCard({ initialStalled, initialMarketing }: Props) {
  const [stalled, setStalled] = useState(initialStalled);
  const [marketing, setMarketing] = useState(initialMarketing);
  const [busy, setBusy] = useState<null | "stalled" | "marketing">(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function update(
    which: "stalled" | "marketing",
    next: boolean,
    body: { notify_stalled_cases?: boolean; notify_marketing?: boolean },
  ) {
    setBusy(which);
    setMsg(null);
    try {
      const res = await fetch("/api/account/notifications", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setMsg({ kind: "err", text: data.error ?? "Could not save" });
        // Revert on failure.
        if (which === "stalled") setStalled(!next);
        else setMarketing(!next);
        return;
      }
    } catch {
      setMsg({ kind: "err", text: "Network error" });
      if (which === "stalled") setStalled(!next);
      else setMarketing(!next);
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="h-5 w-5 text-red-500" />
        <h2 className="text-lg font-semibold text-white">Email notifications</h2>
      </div>
      <p className="text-slate-400 text-sm mb-5">
        Choose what we&apos;re allowed to email you about. You can change this any time.
      </p>

      <div className="space-y-3">
        <Toggle
          label="Stalled-case reminders"
          description="If a case sits untouched for two weeks, we'll email a single nudge so it doesn't fall through the cracks."
          checked={stalled}
          busy={busy === "stalled"}
          onChange={(next) => {
            setStalled(next);
            void update("stalled", next, { notify_stalled_cases: next });
          }}
        />
        <Toggle
          label="Product updates"
          description="Occasional emails about new features and major scam-pattern updates. Off by default."
          checked={marketing}
          busy={busy === "marketing"}
          onChange={(next) => {
            setMarketing(next);
            void update("marketing", next, { notify_marketing: next });
          }}
        />
      </div>

      {msg && (
        <p
          className={`mt-4 text-sm rounded-md px-3 py-2 ${
            msg.kind === "ok"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {msg.text}
        </p>
      )}
    </section>
  );
}

function Toggle({
  label,
  description,
  checked,
  busy,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  busy: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-4 p-3 rounded-md border border-slate-800 bg-slate-950/50 cursor-pointer hover:border-slate-700 transition-colors">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={busy}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
          checked ? "bg-red-600" : "bg-slate-700"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{label}</span>
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />}
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
    </label>
  );
}
