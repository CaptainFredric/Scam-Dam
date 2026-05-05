import Link from "next/link";
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

const statusColors: Record<Case["status"], "slate" | "green" | "blue"> = {
  active: "slate",
  reported: "blue",
  resolved: "green",
};

interface CaseCardProps {
  caseData: Case;
}

export default function CaseCard({ caseData }: CaseCardProps) {
  return (
    <Link
      href={`/cases/${caseData.id}/timeline`}
      className="block bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-1">
          {caseData.title}
        </h3>
        <Badge color={statusColors[caseData.status]} className="ml-2 flex-shrink-0 capitalize">
          {caseData.status}
        </Badge>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Badge color={scamTypeColors[caseData.scam_type]}>
          {scamTypeLabels[caseData.scam_type]}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-red-400 font-semibold">
          {formatCurrency(caseData.total_lost, caseData.currency)} lost
        </span>
        <span className="text-slate-500">{formatDate(caseData.created_at)}</span>
      </div>
      {caseData.description && (
        <p className="mt-3 text-slate-400 text-xs line-clamp-2">{caseData.description}</p>
      )}
    </Link>
  );
}
