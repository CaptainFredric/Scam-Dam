"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCases } from "@/context/CaseContext";
import CaseSummary from "@/components/cases/CaseSummary";
import ShareCaseButton from "@/components/cases/ShareCaseButton";
import DeleteCaseButton from "@/components/cases/DeleteCaseButton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Timeline", href: "timeline" },
  { label: "Transactions", href: "transactions" },
  { label: "Evidence", href: "evidence" },
  { label: "Red Flags", href: "red-flags" },
  { label: "Report", href: "report" },
];

export default function CaseLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const { cases } = useCases();
  const caseId = params.id as string;
  const caseData = cases.find((c) => c.id === caseId);

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-slate-400">Case not found.</p>
        <Link href="/dashboard" className="text-red-400 hover:text-red-300 text-sm mt-2">
          ← Back to Cases
        </Link>
      </div>
    );
  }

  return (
    <div className="-m-6 md:-m-8">
      <div className="relative">
        <CaseSummary caseData={caseData} />
        <div className="absolute right-6 top-4 flex gap-2">
          <ShareCaseButton caseId={caseId} />
          <DeleteCaseButton caseId={caseId} caseTitle={caseData.title} />
        </div>
      </div>
      <nav className="bg-slate-800 border-b border-slate-700 px-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const href = `/cases/${caseId}/${tab.href}`;
            const isActive = pathname === href;
            return (
              <Link
                key={tab.href}
                href={href}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
                  isActive
                    ? "border-red-500 text-red-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="p-6">{children}</div>
    </div>
  );
}
