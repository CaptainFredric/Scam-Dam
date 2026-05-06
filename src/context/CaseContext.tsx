"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Case, TimelineEntry, Transaction, Evidence } from "@/types/database";
import type { CaseRepository } from "@/lib/cases/repository";
import { createLocalRepository } from "@/lib/cases/localRepository";

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

export type SyncMode = "local" | "cloud" | "loading";

interface CaseContextValue {
  cases: Case[];
  activeCase: Case | null;
  setActiveCase: (c: Case | null) => void;
  createCase: (data: Omit<Case, "id" | "user_id" | "created_at" | "updated_at">) => Promise<Case>;
  updateCase: (id: string, data: Partial<Case>) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;

  timelines: Record<string, TimelineEntry[]>;
  addTimelineEntry: (
    entry: Omit<TimelineEntry, "id" | "created_at">,
  ) => Promise<TimelineEntry>;
  removeTimelineEntry: (caseId: string, entryId: string) => Promise<void>;

  transactions: Record<string, Transaction[]>;
  addTransaction: (
    tx: Omit<Transaction, "id" | "created_at">,
  ) => Promise<Transaction>;
  removeTransaction: (caseId: string, txId: string) => Promise<void>;

  evidenceMap: Record<string, Evidence[]>;
  addEvidence: (
    ev: Omit<Evidence, "id" | "created_at">,
    file?: File,
  ) => Promise<Evidence>;
  removeEvidence: (caseId: string, evId: string) => Promise<void>;

  syncMode: SyncMode;
  syncError: string | null;
}

const CaseContext = createContext<CaseContextValue | null>(null);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const repoRef = useRef<CaseRepository | null>(null);
  const userIdRef = useRef<string>("");
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [timelines, setTimelines] = useState<Record<string, TimelineEntry[]>>({});
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});
  const [evidenceMap, setEvidenceMap] = useState<Record<string, Evidence[]>>({});
  const [syncMode, setSyncMode] = useState<SyncMode>("loading");
  const [syncError, setSyncError] = useState<string | null>(null);

  // Pick a repository on mount: cloud when Supabase is configured AND a user
  // is signed in; local otherwise.
  useEffect(() => {
    let cancelled = false;

    async function pick() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        try {
          const [{ createClient }, { createCloudRepository }] = await Promise.all([
            import("@/lib/supabase/client"),
            import("@/lib/cases/cloudRepository"),
          ]);
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const repo = createCloudRepository(supabase, user.id);
            const data = await repo.list();
            if (cancelled) return;
            repoRef.current = repo;
            userIdRef.current = user.id;
            setCases(data.cases);
            setTimelines(data.timelines);
            setTransactions(data.transactions);
            setEvidenceMap(data.evidence);
            setSyncMode("cloud");
            return;
          }
        } catch (err) {
          if (cancelled) return;
          // If cloud setup failed (network, RLS misconfig, missing migration),
          // fall through to local mode rather than locking the user out.
          setSyncError(err instanceof Error ? err.message : "Cloud sync unavailable");
        }
      }

      const repo = createLocalRepository();
      const data = await repo.list();
      if (cancelled) return;
      repoRef.current = repo;
      userIdRef.current = getDemoUserId();
      setCases(data.cases);
      setTimelines(data.timelines);
      setTransactions(data.transactions);
      setEvidenceMap(data.evidence);
      setSyncMode("local");
    }

    void pick();
    return () => {
      cancelled = true;
    };
  }, []);

  const repo = () => {
    if (!repoRef.current) throw new Error("CaseContext used before initialization");
    return repoRef.current;
  };

  const createCase: CaseContextValue["createCase"] = useCallback(async (data) => {
    const newCase: Case = {
      ...data,
      id: generateId(),
      user_id: userIdRef.current,
      created_at: now(),
      updated_at: now(),
    };
    await repo().createCase(newCase);
    setCases((prev) => [newCase, ...prev]);
    return newCase;
  }, []);

  const updateCase: CaseContextValue["updateCase"] = useCallback(async (id, data) => {
    await repo().updateCase(id, data);
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data, updated_at: now() } : c)),
    );
  }, []);

  const deleteCase: CaseContextValue["deleteCase"] = useCallback(async (id) => {
    await repo().deleteCase(id);
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

  const addTimelineEntry: CaseContextValue["addTimelineEntry"] = useCallback(
    async (entry) => {
      const newEntry: TimelineEntry = { ...entry, id: generateId(), created_at: now() };
      await repo().addTimeline(newEntry);
      setTimelines((prev) => ({
        ...prev,
        [entry.case_id]: [newEntry, ...(prev[entry.case_id] ?? [])],
      }));
      return newEntry;
    },
    [],
  );

  const removeTimelineEntry: CaseContextValue["removeTimelineEntry"] = useCallback(
    async (caseId, entryId) => {
      await repo().removeTimeline(caseId, entryId);
      setTimelines((prev) => ({
        ...prev,
        [caseId]: (prev[caseId] ?? []).filter((e) => e.id !== entryId),
      }));
    },
    [],
  );

  const addTransaction: CaseContextValue["addTransaction"] = useCallback(async (tx) => {
    const newTx: Transaction = { ...tx, id: generateId(), created_at: now() };
    await repo().addTransaction(newTx);
    setTransactions((prev) => ({
      ...prev,
      [tx.case_id]: [newTx, ...(prev[tx.case_id] ?? [])],
    }));
    return newTx;
  }, []);

  const removeTransaction: CaseContextValue["removeTransaction"] = useCallback(
    async (caseId, txId) => {
      await repo().removeTransaction(caseId, txId);
      setTransactions((prev) => ({
        ...prev,
        [caseId]: (prev[caseId] ?? []).filter((t) => t.id !== txId),
      }));
    },
    [],
  );

  const addEvidence: CaseContextValue["addEvidence"] = useCallback(async (ev, file) => {
    const newEv: Evidence = { ...ev, id: generateId(), created_at: now() };
    const stored = await repo().addEvidence(newEv, file);
    setEvidenceMap((prev) => ({
      ...prev,
      [stored.case_id]: [stored, ...(prev[stored.case_id] ?? [])],
    }));
    return stored;
  }, []);

  const removeEvidence: CaseContextValue["removeEvidence"] = useCallback(
    async (caseId, evId) => {
      const path = (evidenceMap[caseId] ?? []).find((e) => e.id === evId)?.storage_path;
      await repo().removeEvidence(caseId, evId, path);
      setEvidenceMap((prev) => ({
        ...prev,
        [caseId]: (prev[caseId] ?? []).filter((e) => e.id !== evId),
      }));
    },
    [evidenceMap],
  );

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
        syncMode,
        syncError,
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
