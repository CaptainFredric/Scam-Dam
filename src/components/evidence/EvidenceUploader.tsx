"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { Evidence } from "@/types/database";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Upload } from "lucide-react";

const categoryOptions = [
  { value: "screenshot", label: "Screenshot" },
  { value: "document", label: "Document" },
  { value: "chat_log", label: "Chat Log" },
  { value: "email", label: "Email" },
  { value: "other", label: "Other" },
];

interface EvidenceUploaderProps {
  caseId: string;
  onAdd: (
    ev: Omit<Evidence, "id" | "created_at">,
    file?: File,
  ) => Promise<unknown> | unknown;
}

export default function EvidenceUploader({ caseId, onAdd }: EvidenceUploaderProps) {
  const [category, setCategory] = useState<Evidence["category"]>("screenshot");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    setPending((prev) => [...prev, ...accepted]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "text/*": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    },
    multiple: true,
  });

  const handleUpload = async () => {
    setError(null);
    setUploading(true);
    try {
      for (const file of pending) {
        // The cloud repository uploads to Supabase Storage and replaces this
        // blob URL with a signed URL. In local mode we keep the blob URL.
        const localUrl = URL.createObjectURL(file);
        await onAdd(
          {
            case_id: caseId,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            storage_path: `local/${caseId}/${file.name}`,
            url: localUrl,
            description: description.trim() || null,
            category,
          },
          file,
        );
      }
      setPending([]);
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-white text-sm">Upload Evidence</h3>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg px-6 py-10 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-red-500 bg-red-500/5"
            : "border-slate-600 hover:border-slate-500"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 text-slate-500 mx-auto mb-2" />
        <p className="text-slate-400 text-sm">
          {isDragActive
            ? "Drop files here…"
            : "Drag & drop files here, or click to select"}
        </p>
        <p className="text-slate-600 text-xs mt-1">
          Images, PDFs, text files, Word documents
        </p>
      </div>
      {pending.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-slate-400">{pending.length} file(s) ready:</p>
          {pending.map((f, i) => (
            <div key={i} className="text-xs text-slate-300 bg-slate-900 rounded px-3 py-1.5">
              {f.name} ({(f.size / 1024).toFixed(1)} KB)
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value as Evidence["category"])}
        />
        <div>
          <label className="block text-sm text-slate-300 mb-1">Description (optional)</label>
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Brief description…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
      <Button
        type="button"
        size="sm"
        loading={uploading}
        disabled={pending.length === 0}
        onClick={handleUpload}
      >
        Add to Evidence Vault
      </Button>
    </div>
  );
}
