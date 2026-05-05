"use client";

import { useParams } from "next/navigation";
import { useCases } from "@/context/CaseContext";
import RedFlagChecker from "@/components/red-flags/RedFlagChecker";

export default function RedFlagsPage() {
  const params = useParams();
  const caseId = params.id as string;
  const { cases } = useCases();
  const caseData = cases.find((c) => c.id === caseId);

  if (!caseData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Red Flag Classifier</h2>
        <p className="text-slate-400 text-sm">
          Identify which warning signs apply to your case. Including these in your report demonstrates a recognized scam pattern.
        </p>
      </div>
      <RedFlagChecker caseData={caseData} />
    </div>
  );
}
