"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCases } from "@/context/CaseContext";
import type { Case } from "@/types/database";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const scamTypeOptions = [
  { value: "task_scam", label: "Task Scam" },
  { value: "crypto_investment", label: "Crypto Investment" },
  { value: "fake_job", label: "Fake Job Offer" },
  { value: "romance_scam", label: "Romance Scam" },
  { value: "other", label: "Other" },
];

const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD (C$)" },
  { value: "AUD", label: "AUD (A$)" },
  { value: "JPY", label: "JPY (¥)" },
];

interface NewCaseFormProps {
  onClose: () => void;
}

export default function NewCaseForm({ onClose }: NewCaseFormProps) {
  const { createCase } = useCases();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [scamType, setScamType] = useState<Case["scam_type"]>("task_scam");
  const [description, setDescription] = useState("");
  const [totalLost, setTotalLost] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    const amount = parseFloat(totalLost) || 0;
    setSubmitting(true);
    try {
      const newCase = await createCase({
        title: title.trim(),
        scam_type: scamType,
        status: "active",
        description: description.trim() || null,
        total_lost: amount,
        currency,
      });
      onClose();
      router.push(`/cases/${newCase.id}/timeline`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create case");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Case Title"
        placeholder="e.g., MetaSwap Investment Scam – Jan 2024"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Select
        label="Scam Type"
        options={scamTypeOptions}
        value={scamType}
        onChange={(e) => setScamType(e.target.value as Case["scam_type"])}
      />
      <div>
        <label className="block text-sm text-slate-300 mb-1">Description</label>
        <textarea
          className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          rows={3}
          placeholder="Brief description of how the scam occurred…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <Input
          label="Total Lost"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={totalLost}
          onChange={(e) => setTotalLost(e.target.value)}
          className="flex-1"
        />
        <Select
          label="Currency"
          options={currencyOptions}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1" disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" loading={submitting}>
          Create Case
        </Button>
      </div>
    </form>
  );
}
