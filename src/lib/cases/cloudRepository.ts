"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Case, TimelineEntry, Transaction, Evidence } from "@/types/database";
import type { CaseRepository } from "./repository";

const BUCKET = "evidence";

export function createCloudRepository(
  supabase: SupabaseClient,
  userId: string,
): CaseRepository {
  return {
    mode: "cloud",

    async list() {
      // Pull everything for this user in parallel; RLS makes user_id scoping
      // implicit but we still filter on cases for clarity.
      const [casesRes, timelinesRes, transactionsRes, evidenceRes] = await Promise.all([
        supabase
          .from("cases")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase.from("timeline_entries").select("*").order("event_date", { ascending: true }),
        supabase.from("transactions").select("*").order("date", { ascending: true }),
        supabase.from("evidence").select("*").order("created_at", { ascending: false }),
      ]);

      const cases = (casesRes.data ?? []) as Case[];
      const groupBy = <T extends { case_id: string }>(rows: T[]) =>
        rows.reduce<Record<string, T[]>>((acc, row) => {
          (acc[row.case_id] ??= []).push(row);
          return acc;
        }, {});

      // Resolve signed URLs for evidence files so the UI can render
      // images and download links without a public bucket.
      const rawEvidence = (evidenceRes.data ?? []) as Evidence[];
      const withUrls = await Promise.all(
        rawEvidence.map(async (ev) => {
          if (!ev.storage_path) return ev;
          const { data } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(ev.storage_path, 60 * 60);
          return { ...ev, url: data?.signedUrl ?? ev.url };
        }),
      );

      return {
        cases,
        timelines: groupBy((timelinesRes.data ?? []) as TimelineEntry[]),
        transactions: groupBy((transactionsRes.data ?? []) as Transaction[]),
        evidence: groupBy(withUrls),
      };
    },

    async createCase(c) {
      const { error } = await supabase.from("cases").insert({ ...c, user_id: userId });
      if (error) throw error;
    },

    async updateCase(id, patch) {
      const { error } = await supabase
        .from("cases")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },

    async deleteCase(id) {
      // Storage objects under this case need their own cleanup since they
      // aren't FK-linked to cases.
      const { data: files } = await supabase
        .from("evidence")
        .select("storage_path")
        .eq("case_id", id);
      if (files && files.length > 0) {
        const paths = (files as { storage_path: string }[])
          .map((f) => f.storage_path)
          .filter(Boolean);
        if (paths.length > 0) {
          await supabase.storage.from(BUCKET).remove(paths);
        }
      }
      const { error } = await supabase.from("cases").delete().eq("id", id);
      if (error) throw error;
    },

    async addTimeline(entry) {
      const { error } = await supabase.from("timeline_entries").insert(entry);
      if (error) throw error;
    },

    async removeTimeline(_caseId, entryId) {
      const { error } = await supabase.from("timeline_entries").delete().eq("id", entryId);
      if (error) throw error;
    },

    async addTransaction(tx) {
      const { error } = await supabase.from("transactions").insert(tx);
      if (error) throw error;
    },

    async removeTransaction(_caseId, txId) {
      const { error } = await supabase.from("transactions").delete().eq("id", txId);
      if (error) throw error;
    },

    async addEvidence(ev, file) {
      let storagePath = ev.storage_path;
      let signedUrl: string | null = null;
      if (file) {
        // Object key shape: <user_id>/<case_id>/<evidence_id>-<filename>.
        // The first path segment must be the user id so the storage RLS
        // policy from supabase/schema.sql matches.
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
        storagePath = `${userId}/${ev.case_id}/${ev.id}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, file, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });
        if (upErr) throw upErr;
        const { data } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(storagePath, 60 * 60);
        signedUrl = data?.signedUrl ?? null;
      }

      const row: Evidence = {
        ...ev,
        storage_path: storagePath,
        url: signedUrl ?? ev.url,
      };

      const { error } = await supabase.from("evidence").insert(row);
      if (error) throw error;
      return row;
    },

    async removeEvidence(_caseId, evId, storagePath) {
      if (storagePath) {
        await supabase.storage.from(BUCKET).remove([storagePath]).catch(() => null);
      }
      const { error } = await supabase.from("evidence").delete().eq("id", evId);
      if (error) throw error;
    },
  };
}
