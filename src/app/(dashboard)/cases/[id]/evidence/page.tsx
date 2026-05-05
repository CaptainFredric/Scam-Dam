"use client";

import { useParams } from "next/navigation";
import { useCases } from "@/context/CaseContext";
import EvidenceGrid from "@/components/evidence/EvidenceGrid";
import EvidenceUploader from "@/components/evidence/EvidenceUploader";

export default function EvidencePage() {
  const params = useParams();
  const caseId = params.id as string;
  const { evidenceMap, addEvidence, removeEvidence } = useCases();
  const evidenceList = evidenceMap[caseId] ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Evidence Vault</h2>
        <p className="text-slate-400 text-sm">
          Upload screenshots, chat logs, emails, and documents. Files are stored locally in demo mode.
        </p>
      </div>
      <EvidenceGrid
        evidence={evidenceList}
        onRemove={(id) => removeEvidence(caseId, id)}
      />
      <EvidenceUploader
        caseId={caseId}
        onAdd={addEvidence}
      />
    </div>
  );
}
