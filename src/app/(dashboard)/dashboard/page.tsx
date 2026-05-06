"use client";

import { useState, useMemo } from "react";
import { Plus, FolderOpen, Search } from "lucide-react";
import { useCases } from "@/context/CaseContext";
import CaseCard from "@/components/cases/CaseCard";
import Modal from "@/components/ui/Modal";
import NewCaseForm from "@/components/cases/NewCaseForm";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const { cases, syncMode } = useCases();
  const [showNew, setShowNew] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.scam_type.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q),
    );
  }, [cases, query]);

  const totalLost = useMemo(
    () => cases.reduce((sum, c) => sum + (c.total_lost ?? 0), 0),
    [cases],
  );

  const reported = cases.filter((c) => c.status === "reported").length;
  const active = cases.filter((c) => c.status === "active").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Cases</h1>
          <p className="text-slate-400 text-sm mt-1">
            {cases.length === 0
              ? "Create your first case to start organizing evidence."
              : `${cases.length} case${cases.length === 1 ? "" : "s"} · ${active} active · ${reported} reported`}
          </p>
        </div>
        <Button onClick={() => setShowNew(true)} className="flex items-center gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          New Case
        </Button>
      </div>

      {cases.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Stat label="Total cases" value={cases.length.toString()} />
          <Stat label="Reported to authorities" value={reported.toString()} />
          <Stat
            label="Total documented loss"
            value={totalLost.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          />
        </div>
      )}

      {cases.length > 4 && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases by title, type, or status…"
            className="w-full bg-slate-900 border border-slate-700 rounded-md pl-9 pr-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      )}

      {syncMode === "loading" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-slate-800/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl">
          <div className="relative mb-4">
            <FolderOpen className="h-12 w-12 text-slate-600" />
            <div className="absolute inset-0 bg-red-500/20 blur-2xl" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">No cases yet</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-xs">
            A case bundles your timeline, transactions, and evidence files into a
            single packet you can hand to investigators.
          </p>
          <Button onClick={() => setShowNew(true)}>Create First Case</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CaseCard key={c.id} caseData={c} />
          ))}
          {filtered.length === 0 && (
            <p className="text-slate-500 text-sm col-span-full text-center py-12">
              No cases match &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      )}

      <Modal open={showNew} onClose={() => setShowNew(false)} title="New Case">
        <NewCaseForm onClose={() => setShowNew(false)} />
      </Modal>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-5 py-4">
      <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
