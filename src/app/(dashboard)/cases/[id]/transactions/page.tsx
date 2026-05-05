"use client";

import { useParams } from "next/navigation";
import { useCases } from "@/context/CaseContext";
import TransactionTable from "@/components/transactions/TransactionTable";
import TransactionForm from "@/components/transactions/TransactionForm";

export default function TransactionsPage() {
  const params = useParams();
  const caseId = params.id as string;
  const { transactions, addTransaction, removeTransaction } = useCases();
  const txList = transactions[caseId] ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Transaction Ledger</h2>
        <p className="text-slate-400 text-sm">
          Record every payment — deposits, withdrawal attempts, fees demanded. Include wallet addresses and exchange names.
        </p>
      </div>
      <TransactionTable
        transactions={txList}
        onRemove={(id) => removeTransaction(caseId, id)}
      />
      <TransactionForm
        caseId={caseId}
        onAdd={addTransaction}
      />
    </div>
  );
}
