"use client";

import type { Case } from "@/types/database";
import Badge from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

const scamTypeLabels: Record<Case["scam_type"], string> = {
  task_scam: "Task Scam",
  crypto_investment: "Crypto Investment",
  fake_job: "Fake Job",
  romance_scam: "Romance Scam",
  other: "Other",
};

const scamTypeColors: Record<Case["scam_type"], "orange" | "yellow" | "blue" | "purple" | "slate"> = {
  task_scam: "orange",
  crypto_investment: "yellow",
  fake_job: "blue",
  romance_scam: "purple",
  other: "slate",
};

interface CaseSummaryProps {
  caseData: Case;
}

export default function CaseSummary({ caseData }: CaseSummaryProps) {
  return (
    <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold text-white">{caseData.title}</h1>
        <Badge color={scamTypeColors[caseData.scam_type]}>
          {scamTypeLabels[caseData.scam_type]}
        </Badge>
        <Badge color={caseData.status === "active" ? "slate" : caseData.status === "reported" ? "blue" : "green"} className="capitalize">
          {caseData.status}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-4 mt-2 text-sm">
        <span className="text-red-400 font-semibold">
          {formatCurrency(caseData.total_lost, caseData.currency)} lost
        </span>
        <span className="text-slate-400">Created {formatDate(caseData.created_at)}</span>
        {caseData.description && (
          <span className="text-slate-400 italic line-clamp-1">{caseData.description}</span>
        )}
      </div>
    </div>
  );
}
