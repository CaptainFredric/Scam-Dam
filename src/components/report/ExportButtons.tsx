"use client";

import { useState } from "react";
import type { Case, TimelineEntry, Transaction, Evidence } from "@/types/database";
import Button from "@/components/ui/Button";
import { FileText, Table, Archive, Lock } from "lucide-react";
import { useSubscription } from "@/lib/useSubscription";
import { isExportingTier } from "@/lib/plans";
import UpsellModal from "@/components/billing/UpsellModal";

interface ExportButtonsProps {
  caseData: Case;
  timeline: TimelineEntry[];
  transactions: Transaction[];
  evidence: Evidence[];
}

export default function ExportButtons({
  caseData,
  timeline,
  transactions,
  evidence,
}: ExportButtonsProps) {
  const subscription = useSubscription();
  const canExportClean =
    isExportingTier(subscription.tier) || subscription.packetCredits > 0;

  const [pdfLoading, setPdfLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);
  const [upsell, setUpsell] = useState<null | string>(null);

  const handlePdf = async () => {
    setPdfLoading(true);
    try {
      const { generateReport } = await import("@/lib/generateReport");
      // Pro users get branded reports (logo + org + brand color +
      // footer line). Best-effort — if branding fetch fails, render the
      // default Scam Dam cover.
      let branding: import("@/types/database").Branding | undefined;
      if (subscription.tier === "pro") {
        try {
          const res = await fetch("/api/account/branding", { cache: "no-store" });
          if (res.ok) {
            const data = (await res.json()) as {
              branding?: import("@/types/database").Branding;
            };
            branding = data.branding;
          }
        } catch {
          /* ignore */
        }
      }
      // Free tier still gets a PDF — generator stamps a watermark when
      // passed `watermark: true`. Clean export is unlocked by any paid
      // tier or an unspent packet credit.
      await generateReport(caseData, timeline, transactions, evidence, {
        watermark: !canExportClean,
        branding,
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleCsv = async () => {
    if (!canExportClean) {
      setUpsell("Exporting the CSV transaction ledger");
      return;
    }
    setCsvLoading(true);
    try {
      const { exportCsv } = await import("@/lib/exportCsv");
      exportCsv(caseData, transactions);
    } catch (err) {
      console.error("CSV export failed:", err);
    } finally {
      setCsvLoading(false);
    }
  };

  const handleZip = async () => {
    if (!canExportClean) {
      setUpsell("Exporting the full ZIP bundle with evidence files");
      return;
    }
    setZipLoading(true);
    try {
      const { exportZip } = await import("@/lib/exportZip");
      await exportZip(caseData, timeline, transactions, evidence);
    } catch (err) {
      console.error("ZIP export failed:", err);
      alert("ZIP export failed. Please try again.");
    } finally {
      setZipLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {!canExportClean && (
        <div className="text-xs text-slate-400 bg-slate-800/60 border border-slate-700 rounded-md px-3 py-2 inline-flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-amber-400" />
          Free plan: PDF is watermarked. CSV and ZIP require a paid plan.
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={handlePdf}
          loading={pdfLoading}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Export PDF Report{canExportClean ? "" : " (Watermarked)"}
        </Button>
        <Button
          variant="secondary"
          onClick={handleCsv}
          loading={csvLoading}
          className="flex items-center gap-2"
        >
          {canExportClean ? (
            <Table className="h-4 w-4" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          Export CSV
        </Button>
        <Button
          variant="secondary"
          onClick={handleZip}
          loading={zipLoading}
          className="flex items-center gap-2"
        >
          {canExportClean ? (
            <Archive className="h-4 w-4" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          Export ZIP Bundle
        </Button>
      </div>
      <UpsellModal
        open={upsell !== null}
        onClose={() => setUpsell(null)}
        feature={upsell ?? ""}
      />
    </div>
  );
}
