"use client";

import type { Case, TimelineEntry, Transaction, Evidence } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ReportPreviewProps {
  caseData: Case;
  timeline: TimelineEntry[];
  transactions: Transaction[];
  evidence: Evidence[];
}

const scamTypeLabels: Record<Case["scam_type"], string> = {
  task_scam: "Task Scam",
  crypto_investment: "Crypto Investment Scam",
  fake_job: "Fake Job Offer Scam",
  romance_scam: "Romance Scam",
  other: "Other Scam",
};

export default function ReportPreview({
  caseData,
  timeline,
  transactions,
  evidence,
}: ReportPreviewProps) {
  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );
  const sortedTx = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const totalLost = transactions
    .filter((t) => t.transaction_type === "deposit" || t.transaction_type === "fee")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="bg-white text-gray-900 rounded-xl p-8 max-w-3xl mx-auto text-sm leading-relaxed shadow-lg">
      <div className="border-b-4 border-red-600 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scam Evidence Report</h1>
        <p className="text-gray-500 text-xs mt-1">
          Generated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} via Scam Dam
        </p>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">Case Summary</h2>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr><td className="py-1.5 pr-4 font-medium text-gray-500 w-40">Case Title</td><td className="py-1.5 text-gray-800">{caseData.title}</td></tr>
            <tr><td className="py-1.5 pr-4 font-medium text-gray-500">Scam Type</td><td className="py-1.5 text-gray-800">{scamTypeLabels[caseData.scam_type]}</td></tr>
            <tr><td className="py-1.5 pr-4 font-medium text-gray-500">Status</td><td className="py-1.5 capitalize text-gray-800">{caseData.status}</td></tr>
            <tr><td className="py-1.5 pr-4 font-medium text-gray-500">Total Lost</td><td className="py-1.5 font-bold text-red-600">{formatCurrency(caseData.total_lost, caseData.currency)}</td></tr>
            <tr><td className="py-1.5 pr-4 font-medium text-gray-500">Case Opened</td><td className="py-1.5 text-gray-800">{formatDate(caseData.created_at)}</td></tr>
          </tbody>
        </table>
        {caseData.description && (
          <p className="mt-3 text-gray-600 italic">{caseData.description}</p>
        )}
      </section>

      {sortedTimeline.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
            Timeline of Events ({sortedTimeline.length})
          </h2>
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50"><th className="py-2 px-3 text-left font-medium text-gray-500">Date</th><th className="py-2 px-3 text-left font-medium text-gray-500">Event</th><th className="py-2 px-3 text-left font-medium text-gray-500">Description</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {sortedTimeline.map((e) => (
                <tr key={e.id}><td className="py-2 px-3 whitespace-nowrap">{formatDate(e.event_date)}</td><td className="py-2 px-3 whitespace-nowrap capitalize">{e.event_type.replace(/_/g, " ")}</td><td className="py-2 px-3">{e.description}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {sortedTx.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
            Transactions ({sortedTx.length})
          </h2>
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50"><th className="py-2 px-3 text-left font-medium text-gray-500">Date</th><th className="py-2 px-3 text-left font-medium text-gray-500">Type</th><th className="py-2 px-3 text-left font-medium text-gray-500">Amount</th><th className="py-2 px-3 text-left font-medium text-gray-500">Platform</th><th className="py-2 px-3 text-left font-medium text-gray-500">Wallet / Exchange</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {sortedTx.map((t) => (
                <tr key={t.id}><td className="py-2 px-3">{formatDate(t.date)}</td><td className="py-2 px-3 capitalize">{t.transaction_type}</td><td className="py-2 px-3 font-semibold text-red-600">{formatCurrency(t.amount, t.currency)}</td><td className="py-2 px-3">{t.platform}</td><td className="py-2 px-3 font-mono text-xs">{t.wallet_address ?? t.exchange ?? "—"}</td></tr>
              ))}
            </tbody>
            <tfoot><tr className="border-t-2 border-gray-300"><td colSpan={2} className="py-2 px-3 font-bold">Total Lost</td><td className="py-2 px-3 font-bold text-red-600">{formatCurrency(totalLost, transactions[0]?.currency ?? "USD")}</td><td colSpan={2} /></tr></tfoot>
          </table>
        </section>
      )}

      {evidence.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
            Evidence Index ({evidence.length} files)
          </h2>
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50"><th className="py-2 px-3 text-left font-medium text-gray-500">#</th><th className="py-2 px-3 text-left font-medium text-gray-500">File Name</th><th className="py-2 px-3 text-left font-medium text-gray-500">Category</th><th className="py-2 px-3 text-left font-medium text-gray-500">Description</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {evidence.map((ev, i) => (
                <tr key={ev.id}><td className="py-2 px-3">{i + 1}</td><td className="py-2 px-3 font-mono">{ev.file_name}</td><td className="py-2 px-3 capitalize">{ev.category.replace("_", " ")}</td><td className="py-2 px-3">{ev.description ?? "—"}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">Reporting Agencies</h2>
        <ul className="space-y-1.5 text-xs text-gray-600">
          <li>🔗 <strong>FBI IC3:</strong> https://www.ic3.gov</li>
          <li>🔗 <strong>FTC Report Fraud:</strong> https://reportfraud.ftc.gov</li>
          <li>🔗 <strong>CFPB Complaint:</strong> https://www.consumerfinance.gov/complaint/</li>
          <li>🔗 <strong>CISA:</strong> https://www.cisa.gov/report</li>
        </ul>
      </section>

      <div className="border-t border-gray-200 pt-4 mt-6">
        <p className="text-xs text-gray-400 italic">
          ⚠️ This document was generated by Scam Dam to assist with evidence organization and self-reporting.
          It is not legal advice and does not guarantee any outcome. Always consult a licensed attorney for legal matters.
        </p>
      </div>
    </div>
  );
}
