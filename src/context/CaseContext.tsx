"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Case, TimelineEntry, Transaction, Evidence } from "@/types/database";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function now(): string {
  return new Date().toISOString();
}

function getDemoUserId(): string {
  if (typeof window === "undefined") return "demo";
  const stored = localStorage.getItem("scamdam_demo_user_id");
  if (stored) return stored;
  const id = "demo-" + Math.random().toString(36).slice(2, 10);
  localStorage.setItem("scamdam_demo_user_id", id);
  return id;
}

interface CaseContextValue {
  cases: Case[];
  activeCase: Case | null;
  setActiveCase: (c: Case | null) => void;
  createCase: (data: Omit<Case, "id" | "user_id" | "created_at" | "updated_at">) => Case;
  updateCase: (id: string, data: Partial<Case>) => void;
  deleteCase: (id: string) => void;

  timelines: Record<string, TimelineEntry[]>;
  addTimelineEntry: (entry: Omit<TimelineEntry, "id" | "created_at">) => TimelineEntry;
  removeTimelineEntry: (caseId: string, entryId: string) => void;

  transactions: Record<string, Transaction[]>;
  addTransaction: (tx: Omit<Transaction, "id" | "created_at">) => Transaction;
  removeTransaction: (caseId: string, txId: string) => void;

  evidenceMap: Record<string, Evidence[]>;
  addEvidence: (ev: Omit<Evidence, "id" | "created_at">) => Evidence;
  removeEvidence: (caseId: string, evId: string) => void;
}

const CaseContext = createContext<CaseContextValue | null>(null);

const STORAGE_KEYS = {
  cases: "scamdam_cases",
  timelines: "scamdam_timelines",
  transactions: "scamdam_transactions",
  evidence: "scamdam_evidence",
};

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

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [timelines, setTimelines] = useState<Record<string, TimelineEntry[]>>({});
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});
  const [evidenceMap, setEvidenceMap] = useState<Record<string, Evidence[]>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCases(load<Case[]>(STORAGE_KEYS.cases, []));
    setTimelines(load<Record<string, TimelineEntry[]>>(STORAGE_KEYS.timelines, {}));
    setTransactions(load<Record<string, Transaction[]>>(STORAGE_KEYS.transactions, {}));
    setEvidenceMap(load<Record<string, Evidence[]>>(STORAGE_KEYS.evidence, {}));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(STORAGE_KEYS.cases, cases);
  }, [cases, hydrated]);

  useEffect(() => {
    if (hydrated) save(STORAGE_KEYS.timelines, timelines);
  }, [timelines, hydrated]);

  useEffect(() => {
    if (hydrated) save(STORAGE_KEYS.transactions, transactions);
  }, [transactions, hydrated]);

  useEffect(() => {
    if (hydrated) save(STORAGE_KEYS.evidence, evidenceMap);
  }, [evidenceMap, hydrated]);

  const createCase = useCallback(
    (data: Omit<Case, "id" | "user_id" | "created_at" | "updated_at">) => {
      const newCase: Case = {
        ...data,
        id: generateId(),
        user_id: getDemoUserId(),
        created_at: now(),
        updated_at: now(),
      };
      setCases((prev) => [newCase, ...prev]);
      return newCase;
    },
    []
  );

  const updateCase = useCallback((id: string, data: Partial<Case>) => {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data, updated_at: now() } : c))
    );
  }, []);

  const deleteCase = useCallback((id: string) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
    setTimelines((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setTransactions((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setEvidenceMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const addTimelineEntry = useCallback(
    (entry: Omit<TimelineEntry, "id" | "created_at">) => {
      const newEntry: TimelineEntry = { ...entry, id: generateId(), created_at: now() };
      setTimelines((prev) => ({
        ...prev,
        [entry.case_id]: [newEntry, ...(prev[entry.case_id] ?? [])],
      }));
      return newEntry;
    },
    []
  );

  const removeTimelineEntry = useCallback((caseId: string, entryId: string) => {
    setTimelines((prev) => ({
      ...prev,
      [caseId]: (prev[caseId] ?? []).filter((e) => e.id !== entryId),
    }));
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, "id" | "created_at">) => {
    const newTx: Transaction = { ...tx, id: generateId(), created_at: now() };
    setTransactions((prev) => ({
      ...prev,
      [tx.case_id]: [newTx, ...(prev[tx.case_id] ?? [])],
    }));
    return newTx;
  }, []);

  const removeTransaction = useCallback((caseId: string, txId: string) => {
    setTransactions((prev) => ({
      ...prev,
      [caseId]: (prev[caseId] ?? []).filter((t) => t.id !== txId),
    }));
  }, []);

  const addEvidence = useCallback((ev: Omit<Evidence, "id" | "created_at">) => {
    const newEv: Evidence = { ...ev, id: generateId(), created_at: now() };
    setEvidenceMap((prev) => ({
      ...prev,
      [ev.case_id]: [newEv, ...(prev[ev.case_id] ?? [])],
    }));
    return newEv;
  }, []);

  const removeEvidence = useCallback((caseId: string, evId: string) => {
    setEvidenceMap((prev) => ({
      ...prev,
      [caseId]: (prev[caseId] ?? []).filter((e) => e.id !== evId),
    }));
  }, []);

  return (
    <CaseContext.Provider
      value={{
        cases,
        activeCase,
        setActiveCase,
        createCase,
        updateCase,
        deleteCase,
        timelines,
        addTimelineEntry,
        removeTimelineEntry,
        transactions,
        addTransaction,
        removeTransaction,
        evidenceMap,
        addEvidence,
        removeEvidence,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCases(): CaseContextValue {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCases must be used within CaseProvider");
  return ctx;
}
