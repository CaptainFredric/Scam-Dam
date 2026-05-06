// Case repository abstraction. Two implementations: a local-only one
// (browser localStorage, demo mode) and a Supabase-backed one for signed-in
// users. The CaseContext picks the right one at hydration time so the rest
// of the UI doesn't care about the difference.

import type { Case, TimelineEntry, Transaction, Evidence } from "@/types/database";

export interface CaseRepository {
  readonly mode: "local" | "cloud";
  list(): Promise<{
    cases: Case[];
    timelines: Record<string, TimelineEntry[]>;
    transactions: Record<string, Transaction[]>;
    evidence: Record<string, Evidence[]>;
  }>;
  createCase(c: Case): Promise<void>;
  updateCase(id: string, patch: Partial<Case>): Promise<void>;
  deleteCase(id: string): Promise<void>;
  addTimeline(entry: TimelineEntry): Promise<void>;
  removeTimeline(caseId: string, entryId: string): Promise<void>;
  addTransaction(tx: Transaction): Promise<void>;
  removeTransaction(caseId: string, txId: string): Promise<void>;
  addEvidence(ev: Evidence, file?: File): Promise<Evidence>;
  removeEvidence(caseId: string, evId: string, storagePath?: string): Promise<void>;
}
