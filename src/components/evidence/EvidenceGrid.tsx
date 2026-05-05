"use client";

import type { Evidence } from "@/types/database";
import Badge from "@/components/ui/Badge";
import { Trash2, FileText, Image as ImageIcon, MessageSquare, Mail, File } from "lucide-react";
import { formatDate } from "@/lib/utils";

const categoryIcons: Record<Evidence["category"], React.ReactNode> = {
  screenshot: <ImageIcon className="h-5 w-5" />,
  document: <FileText className="h-5 w-5" />,
  chat_log: <MessageSquare className="h-5 w-5" />,
  email: <Mail className="h-5 w-5" />,
  other: <File className="h-5 w-5" />,
};

const categoryColors: Record<Evidence["category"], "blue" | "slate" | "green" | "yellow" | "orange"> = {
  screenshot: "blue",
  document: "slate",
  chat_log: "green",
  email: "yellow",
  other: "orange",
};

interface EvidenceGridProps {
  evidence: Evidence[];
  onRemove: (id: string) => void;
}

export default function EvidenceGrid({ evidence, onRemove }: EvidenceGridProps) {
  if (evidence.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No evidence uploaded yet. Use the uploader below to add files.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {evidence.map((ev) => (
        <div key={ev.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-slate-400">
              {categoryIcons[ev.category]}
              <Badge color={categoryColors[ev.category]} className="capitalize">
                {ev.category.replace("_", " ")}
              </Badge>
            </div>
            <button
              onClick={() => onRemove(ev.id)}
              className="text-slate-500 hover:text-red-400 transition-colors"
              aria-label="Remove evidence"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {ev.url && ev.file_type.startsWith("image/") && (
            <div className="mb-2 rounded overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ev.url}
                alt={ev.file_name}
                className="w-full h-32 object-cover"
              />
            </div>
          )}
          <p className="font-medium text-sm text-white truncate">{ev.file_name}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {(ev.file_size / 1024).toFixed(1)} KB · {formatDate(ev.created_at)}
          </p>
          {ev.description && (
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">{ev.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
