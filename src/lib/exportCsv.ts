import type { Case, Transaction } from "@/types/database";
import { formatDate } from "@/lib/utils";

export function exportCsvString(caseData: Case, transactions: Transaction[]): string {
  const headers = [
    "Date",
    "Type",
    "Amount",
    "Currency",
    "Platform",
    "Wallet Address",
    "Exchange",
    "Notes",
  ];

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const rows = sorted.map((t) => [
    formatDate(t.date),
    t.transaction_type,
    String(t.amount),
    t.currency,
    t.platform,
    t.wallet_address ?? "",
    t.exchange ?? "",
    t.notes ?? "",
  ]);

  const totalLost = sorted
    .filter((t) => t.transaction_type === "deposit" || t.transaction_type === "fee")
    .reduce((acc, t) => acc + t.amount, 0);

  rows.push(["", "TOTAL LOST", String(totalLost), caseData.currency, "", "", "", ""]);

  return [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
}

export function exportCsv(caseData: Case, transactions: Transaction[]): void {
  const csvContent = exportCsvString(caseData, transactions);

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `transactions-${caseData.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
