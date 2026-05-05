"use client";

import type { TimelineEntry } from "@/types/database";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { Trash2 } from "lucide-react";

const eventLabels: Record<TimelineEntry["event_type"], string> = {
  first_contact: "First Contact",
  deposit: "Deposit Made",
  withdrawal_blocked: "Withdrawal Blocked",
  recharge_demanded: "Recharge Demanded",
  reported: "Reported to Agency",
  other: "Other",
};

const eventColors: Record<TimelineEntry["event_type"], "blue" | "red" | "yellow" | "orange" | "green" | "slate"> = {
  first_contact: "blue",
  deposit: "red",
  withdrawal_blocked: "orange",
  recharge_demanded: "yellow",
  reported: "green",
  other: "slate",
};

interface TimelineViewProps {
  entries: TimelineEntry[];
  onRemove: (id: string) => void;
}

export default function TimelineView({ entries, onRemove }: TimelineViewProps) {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No timeline entries yet. Add your first event below.
      </div>
    );
  }

  return (
    <ol className="relative border-l border-slate-700 space-y-6 ml-3">
      {sorted.map((entry) => (
        <li key={entry.id} className="ml-6">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 ring-4 ring-slate-900">
            <span className="h-2 w-2 rounded-full bg-red-500" />
          </span>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge color={eventColors[entry.event_type]}>
                  {eventLabels[entry.event_type]}
                </Badge>
                <time className="text-slate-400 text-xs">{formatDate(entry.event_date)}</time>
              </div>
              <button
                onClick={() => onRemove(entry.id)}
                className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                aria-label="Remove entry"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-slate-300 text-sm">{entry.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
