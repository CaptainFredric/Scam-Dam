"use client";

import type { Case, TimelineEntry, Transaction, Evidence } from "@/types/database";
import type { CaseRepository } from "./repository";

const KEYS = {
  cases: "scamdam_cases",
  timelines: "scamdam_timelines",
  transactions: "scamdam_transactions",
  evidence: "scamdam_evidence",
} as const;

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded — silently ignore
  }
}

export function createLocalRepository(): CaseRepository {
  return {
    mode: "local",

    async list() {
      return {
        cases: load<Case[]>(KEYS.cases, []),
        timelines: load<Record<string, TimelineEntry[]>>(KEYS.timelines, {}),
        transactions: load<Record<string, Transaction[]>>(KEYS.transactions, {}),
        evidence: load<Record<string, Evidence[]>>(KEYS.evidence, {}),
      };
    },

    async createCase(c) {
      const cases = load<Case[]>(KEYS.cases, []);
      save(KEYS.cases, [c, ...cases]);
    },

    async updateCase(id, patch) {
      const cases = load<Case[]>(KEYS.cases, []);
      save(
        KEYS.cases,
        cases.map((c) =>
          c.id === id ? { ...c, ...patch, updated_at: new Date().toISOString() } : c,
        ),
      );
    },

    async deleteCase(id) {
      save(
        KEYS.cases,
        load<Case[]>(KEYS.cases, []).filter((c) => c.id !== id),
      );
      const timelines = load<Record<string, TimelineEntry[]>>(KEYS.timelines, {});
      delete timelines[id];
      save(KEYS.timelines, timelines);
      const transactions = load<Record<string, Transaction[]>>(KEYS.transactions, {});
      delete transactions[id];
      save(KEYS.transactions, transactions);
      const evidence = load<Record<string, Evidence[]>>(KEYS.evidence, {});
      delete evidence[id];
      save(KEYS.evidence, evidence);
    },

    async addTimeline(entry) {
      const all = load<Record<string, TimelineEntry[]>>(KEYS.timelines, {});
      all[entry.case_id] = [entry, ...(all[entry.case_id] ?? [])];
      save(KEYS.timelines, all);
    },

    async removeTimeline(caseId, entryId) {
      const all = load<Record<string, TimelineEntry[]>>(KEYS.timelines, {});
      all[caseId] = (all[caseId] ?? []).filter((e) => e.id !== entryId);
      save(KEYS.timelines, all);
    },

    async addTransaction(tx) {
      const all = load<Record<string, Transaction[]>>(KEYS.transactions, {});
      all[tx.case_id] = [tx, ...(all[tx.case_id] ?? [])];
      save(KEYS.transactions, all);
    },

    async removeTransaction(caseId, txId) {
      const all = load<Record<string, Transaction[]>>(KEYS.transactions, {});
      all[caseId] = (all[caseId] ?? []).filter((t) => t.id !== txId);
      save(KEYS.transactions, all);
    },

    async addEvidence(ev) {
      const all = load<Record<string, Evidence[]>>(KEYS.evidence, {});
      all[ev.case_id] = [ev, ...(all[ev.case_id] ?? [])];
      save(KEYS.evidence, all);
      return ev;
    },

    async removeEvidence(caseId, evId) {
      const all = load<Record<string, Evidence[]>>(KEYS.evidence, {});
      all[caseId] = (all[caseId] ?? []).filter((e) => e.id !== evId);
      save(KEYS.evidence, all);
    },
  };
}
