"use client";

import { useParams } from "next/navigation";
import { useCases } from "@/context/CaseContext";
import ReportPreview from "@/components/report/ReportPreview";
import ExportButtons from "@/components/report/ExportButtons";

export default function ReportPage() {
  const params = useParams();
  const caseId = params.id as string;
  const { cases, timelines, transactions, evidenceMap } = useCases();
  const caseData = cases.find((c) => c.id === caseId);
  const timeline = timelines[caseId] ?? [];
  const txList = transactions[caseId] ?? [];
  const evidenceList = evidenceMap[caseId] ?? [];

  if (!caseData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Report Generator</h2>
        <p className="text-slate-400 text-sm">
          Preview your evidence report and export in your preferred format.
        </p>
      </div>
      <ExportButtons
        caseData={caseData}
        timeline={timeline}
        transactions={txList}
        evidence={evidenceList}
      />
      <ReportPreview
        caseData={caseData}
        timeline={timeline}
        transactions={txList}
        evidence={evidenceList}
      />
    </div>
  );
}
