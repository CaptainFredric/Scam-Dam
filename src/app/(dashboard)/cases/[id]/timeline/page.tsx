"use client";

import { useParams } from "next/navigation";
import { useCases } from "@/context/CaseContext";
import TimelineView from "@/components/timeline/TimelineView";
import TimelineForm from "@/components/timeline/TimelineForm";

export default function TimelinePage() {
  const params = useParams();
  const caseId = params.id as string;
  const { timelines, addTimelineEntry, removeTimelineEntry } = useCases();
  const entries = timelines[caseId] ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Timeline of Events</h2>
        <p className="text-slate-400 text-sm">
          Document every interaction chronologically. This forms the narrative of your case.
        </p>
      </div>
      <TimelineView
        entries={entries}
        onRemove={(id) => removeTimelineEntry(caseId, id)}
      />
      <TimelineForm
        caseId={caseId}
        onAdd={addTimelineEntry}
      />
    </div>
  );
}
