"use client";

import { useState } from "react";
import type { Transaction } from "@/types/database";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const txTypeOptions = [
  { value: "deposit", label: "Deposit (Money Sent)" },
  { value: "withdrawal", label: "Withdrawal (Money Returned)" },
  { value: "fee", label: "Fee / Tax Demanded" },
  { value: "other", label: "Other" },
];

const currencyOptions = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "USDT", label: "USDT" },
  { value: "BTC", label: "BTC" },
  { value: "ETH", label: "ETH" },
];

interface TransactionFormProps {
  caseId: string;
  onAdd: (tx: Omit<Transaction, "id" | "created_at">) => void;
}

export default function TransactionForm({ caseId, onAdd }: TransactionFormProps) {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [platform, setPlatform] = useState("");
  const [txType, setTxType] = useState<Transaction["transaction_type"]>("deposit");
  const [walletAddress, setWalletAddress] = useState("");
  const [exchange, setExchange] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!date) { setError("Date is required."); return; }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) { setError("Enter a valid amount."); return; }
    if (!platform.trim()) { setError("Platform is required."); return; }

    onAdd({
      case_id: caseId,
      date,
      amount: amountNum,
      currency,
      platform: platform.trim(),
      transaction_type: txType,
      wallet_address: walletAddress.trim() || null,
      exchange: exchange.trim() || null,
      notes: notes.trim() || null,
      screenshot_url: null,
    });

    setDate(""); setAmount(""); setPlatform(""); setWalletAddress("");
    setExchange(""); setNotes(""); setTxType("deposit");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-white text-sm">Add Transaction</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input label="Amount" type="number" min="0" step="any" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Select label="Currency" options={currencyOptions} value={currency} onChange={(e) => setCurrency(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Transaction Type" options={txTypeOptions} value={txType} onChange={(e) => setTxType(e.target.value as Transaction["transaction_type"])} />
        <Input label="Platform / App" placeholder="e.g., MetaMask, Binance" value={platform} onChange={(e) => setPlatform(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Wallet Address (optional)" placeholder="0x…" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
        <Input label="Exchange (optional)" placeholder="e.g., Coinbase" value={exchange} onChange={(e) => setExchange(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-1">Notes (optional)</label>
        <textarea
          className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          rows={2}
          placeholder="Any additional notes…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <Button type="submit" size="sm">Add Transaction</Button>
    </form>
  );
}
