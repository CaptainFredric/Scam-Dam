"use client";

import { useState } from "react";
import type { Case, TimelineEntry, Transaction, Evidence } from "@/types/database";
import Button from "@/components/ui/Button";
import { FileText, Table, Archive } from "lucide-react";

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
  const [pdfLoading, setPdfLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);

  const handlePdf = async () => {
    setPdfLoading(true);
    try {
      const { generateReport } = await import("@/lib/generateReport");
      await generateReport(caseData, timeline, transactions, evidence);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleCsv = async () => {
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
    <div className="flex flex-wrap gap-3">
      <Button
        variant="primary"
        onClick={handlePdf}
        loading={pdfLoading}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Export PDF Report
      </Button>
      <Button
        variant="secondary"
        onClick={handleCsv}
        loading={csvLoading}
        className="flex items-center gap-2"
      >
        <Table className="h-4 w-4" />
        Export CSV
      </Button>
      <Button
        variant="secondary"
        onClick={handleZip}
        loading={zipLoading}
        className="flex items-center gap-2"
      >
        <Archive className="h-4 w-4" />
        Export ZIP Bundle
      </Button>
    </div>
  );
}
