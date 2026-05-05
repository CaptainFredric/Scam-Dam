"use client";

import { useState } from "react";
import type { TimelineEntry } from "@/types/database";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";

const eventTypeOptions = [
  { value: "first_contact", label: "First Contact" },
  { value: "deposit", label: "Deposit Made" },
  { value: "withdrawal_blocked", label: "Withdrawal Blocked" },
  { value: "recharge_demanded", label: "Recharge Demanded" },
  { value: "reported", label: "Reported to Agency" },
  { value: "other", label: "Other" },
];

interface TimelineFormProps {
  caseId: string;
  onAdd: (entry: Omit<TimelineEntry, "id" | "created_at">) => void;
}

export default function TimelineForm({ caseId, onAdd }: TimelineFormProps) {
  const [eventType, setEventType] = useState<TimelineEntry["event_type"]>("first_contact");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!eventDate) { setError("Date is required."); return; }
    if (!description.trim()) { setError("Description is required."); return; }
    onAdd({ case_id: caseId, event_type: eventType, event_date: eventDate, description: description.trim() });
    setEventDate("");
    setDescription("");
    setEventType("first_contact");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-white text-sm">Add Timeline Event</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Event Type"
          options={eventTypeOptions}
          value={eventType}
          onChange={(e) => setEventType(e.target.value as TimelineEntry["event_type"])}
        />
        <Input
          label="Date"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-1">Description</label>
        <textarea
          className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          rows={3}
          placeholder="Describe what happened…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <Button type="submit" size="sm">Add Event</Button>
    </form>
  );
}
