"use client";

import type { Transaction } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { Trash2 } from "lucide-react";

const txTypeColors: Record<Transaction["transaction_type"], "red" | "green" | "yellow" | "slate"> = {
  deposit: "red",
  withdrawal: "green",
  fee: "yellow",
  other: "slate",
};

interface TransactionTableProps {
  transactions: Transaction[];
  onRemove: (id: string) => void;
}

export default function TransactionTable({ transactions, onRemove }: TransactionTableProps) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const total = transactions.reduce((acc, t) => {
    if (t.transaction_type === "deposit" || t.transaction_type === "fee") return acc + t.amount;
    return acc;
  }, 0);

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No transactions yet. Add your first transaction below.
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-left">
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Type</th>
              <th className="py-2 pr-4 font-medium">Amount</th>
              <th className="py-2 pr-4 font-medium">Platform</th>
              <th className="py-2 pr-4 font-medium">Wallet / Exchange</th>
              <th className="py-2 pr-4 font-medium">Notes</th>
              <th className="py-2 font-medium w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {sorted.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-700/20">
                <td className="py-3 pr-4 text-slate-300">{formatDate(tx.date)}</td>
                <td className="py-3 pr-4">
                  <Badge color={txTypeColors[tx.transaction_type]} className="capitalize">
                    {tx.transaction_type}
                  </Badge>
                </td>
                <td className="py-3 pr-4 text-red-400 font-semibold">
                  {formatCurrency(tx.amount, tx.currency)}
                </td>
                <td className="py-3 pr-4 text-slate-300">{tx.platform}</td>
                <td className="py-3 pr-4 text-slate-400 font-mono text-xs max-w-32 truncate">
                  {tx.wallet_address ?? tx.exchange ?? "—"}
                </td>
                <td className="py-3 pr-4 text-slate-400 text-xs max-w-40 truncate">
                  {tx.notes ?? "—"}
                </td>
                <td className="py-3">
                  <button
                    onClick={() => onRemove(tx.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-600">
              <td colSpan={2} className="py-3 pr-4 font-semibold text-slate-300">
                Total Lost
              </td>
              <td className="py-3 pr-4 font-bold text-red-400">
                {formatCurrency(total, transactions[0]?.currency ?? "USD")}
              </td>
              <td colSpan={4} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
