"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useCases } from "@/context/CaseContext";

export default function DeleteCaseButton({
  caseId,
  caseTitle,
}: {
  caseId: string;
  caseTitle: string;
}) {
  const router = useRouter();
  const { deleteCase } = useCases();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (confirmText !== caseTitle) {
      setError(`Type the case title exactly to confirm: "${caseTitle}"`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await deleteCase(caseId);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the case");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setError(null);
          setConfirmText("");
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 border border-slate-700 hover:border-red-500/60 hover:text-red-300 text-slate-400 text-sm px-3 py-1.5 rounded-md transition-colors"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete this case?">
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">
            This permanently removes <strong>{caseTitle}</strong>, including its timeline,
            transactions, and evidence files. This cannot be undone.
          </p>
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Type the case title to confirm
            </label>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={caseTitle}
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setOpen(false)}
              disabled={busy}
              className="px-4 py-2 rounded-md text-sm border border-slate-600 hover:border-slate-500 text-slate-200 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={busy || confirmText !== caseTitle}
              className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white inline-flex items-center gap-2"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete case
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
