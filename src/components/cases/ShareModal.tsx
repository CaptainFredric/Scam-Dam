"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Copy, Check, ExternalLink, Trash2, Info } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { CaseShare } from "@/types/database";
import { formatDate } from "@/lib/utils";

type Props = {
  caseId: string;
  open: boolean;
  onClose: () => void;
};

const expiryOptions = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: 0, label: "No expiry" },
];

export default function ShareModal({ caseId, open, onClose }: Props) {
  const [shares, setShares] = useState<CaseShare[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expiresInDays, setExpiresInDays] = useState<number>(30);
  const [note, setNote] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cases/${caseId}/shares`);
      const data = (await res.json()) as { shares?: CaseShare[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not load shares");
        return;
      }
      setShares(data.shares ?? []);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (open) void refresh();
  }, [open, refresh]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await fetch(`/api/cases/${caseId}/shares`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          expiresInDays: expiresInDays || undefined,
          note: note.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { share?: CaseShare; error?: string };
      if (!res.ok || !data.share) {
        setError(data.error ?? "Could not create share");
        return;
      }
      setShares((prev) => [data.share!, ...prev]);
      setNote("");
    } catch {
      setError("Network error");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(share: CaseShare) {
    if (!confirm("Revoke this link? Anyone holding it will lose access immediately.")) return;
    try {
      const res = await fetch(`/api/cases/${caseId}/shares/${share.id}`, {
        method: "DELETE",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not revoke");
        return;
      }
      setShares((prev) =>
        prev.map((s) => (s.id === share.id ? { ...s, revoked_at: new Date().toISOString() } : s)),
      );
    } catch {
      setError("Network error");
    }
  }

  function shareUrl(share: CaseShare) {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/shared/${share.id}`;
  }

  async function copy(share: CaseShare) {
    const url = shareUrl(share);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(share.id);
      setTimeout(() => setCopiedId((c) => (c === share.id ? null : c)), 2000);
    } catch {
      // Fallback: select-and-prompt isn't worth it; show error.
      setError("Could not copy. Long-press the link to copy manually.");
    }
  }

  const activeShares = shares.filter((s) => !s.revoked_at);
  const revokedShares = shares.filter((s) => s.revoked_at);

  return (
    <Modal open={open} onClose={onClose} title="Share this case">
      <div className="space-y-5">
        <div className="bg-slate-800/60 border border-slate-700 rounded-md p-3 flex gap-2 text-xs text-slate-300">
          <Info className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            Anyone with the link gets a <strong>read-only</strong> view of this case —
            timeline, transactions, and evidence files. They can&apos;t edit or download the
            ZIP. Revoke any time.
          </span>
        </div>

        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Expires
              </label>
              <select
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {expiryOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Note (optional)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={280}
                placeholder='e.g. "For Bank of America fraud team"'
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors inline-flex items-center gap-2"
          >
            {creating && <Loader2 className="h-4 w-4 animate-spin" />}
            Create share link
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-2">
            Active links ({activeShares.length})
          </h3>
          {loading ? (
            <p className="text-slate-500 text-sm">Loading…</p>
          ) : activeShares.length === 0 ? (
            <p className="text-slate-500 text-sm">No active links yet.</p>
          ) : (
            <ul className="space-y-2">
              {activeShares.map((share) => (
                <li
                  key={share.id}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <code className="flex-1 text-xs text-slate-300 truncate font-mono bg-slate-950 px-2 py-1.5 rounded border border-slate-800">
                      {shareUrl(share)}
                    </code>
                    <button
                      onClick={() => copy(share)}
                      className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
                      aria-label="Copy link"
                    >
                      {copiedId === share.id ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <a
                      href={shareUrl(share)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
                      aria-label="Open link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleRevoke(share)}
                      className="p-2 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                      aria-label="Revoke"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>Created {formatDate(share.created_at)}</span>
                    <span>
                      {share.expires_at ? `Expires ${formatDate(share.expires_at)}` : "No expiry"}
                    </span>
                    <span>
                      {share.view_count} view{share.view_count === 1 ? "" : "s"}
                    </span>
                  </div>
                  {share.note && (
                    <p className="text-slate-400 text-xs mt-1.5 italic">&ldquo;{share.note}&rdquo;</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {revokedShares.length > 0 && (
          <details className="text-xs">
            <summary className="cursor-pointer text-slate-500 hover:text-slate-300">
              {revokedShares.length} revoked link{revokedShares.length === 1 ? "" : "s"}
            </summary>
            <ul className="mt-2 space-y-1 text-slate-500">
              {revokedShares.map((s) => (
                <li key={s.id}>
                  Revoked · created {formatDate(s.created_at)} · {s.view_count} views
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </Modal>
  );
}
