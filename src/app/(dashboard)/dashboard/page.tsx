"use client";

import { useState } from "react";
import { Plus, FolderOpen } from "lucide-react";
import { useCases } from "@/context/CaseContext";
import CaseCard from "@/components/cases/CaseCard";
import Modal from "@/components/ui/Modal";
import NewCaseForm from "@/components/cases/NewCaseForm";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const { cases } = useCases();
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Cases</h1>
          <p className="text-slate-400 text-sm mt-1">
            {cases.length === 0
              ? "No cases yet. Create your first case to get started."
              : `${cases.length} case${cases.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Button onClick={() => setShowNew(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Case
        </Button>
      </div>

      {cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen className="h-12 w-12 text-slate-600 mb-4" />
          <h2 className="text-lg font-semibold text-slate-400 mb-2">No cases yet</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-xs">
            Create a case to start organizing your evidence. Your data is saved locally in your browser.
          </p>
          <Button onClick={() => setShowNew(true)}>
            Create First Case
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c) => (
            <CaseCard key={c.id} caseData={c} />
          ))}
        </div>
      )}

      <Modal open={showNew} onClose={() => setShowNew(false)} title="New Case">
        <NewCaseForm onClose={() => setShowNew(false)} />
      </Modal>
    </div>
  );
}
