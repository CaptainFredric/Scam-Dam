"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Trash2, Palette } from "lucide-react";
import type { Branding } from "@/types/database";

type Props = {
  initial: Branding;
};

export default function BrandingCard({ initial }: Props) {
  const [orgName, setOrgName] = useState(initial.org_name ?? "");
  const [brandColor, setBrandColor] = useState(initial.brand_color ?? "#ef4444");
  const [brandFooter, setBrandFooter] = useState(initial.brand_footer ?? "");
  const [logoUrl, setLogoUrl] = useState(initial.brand_logo_url);
  const [busy, setBusy] = useState(false);
  const [logoBusy, setLogoBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (msg?.kind === "ok") {
      const t = setTimeout(() => setMsg(null), 2500);
      return () => clearTimeout(t);
    }
  }, [msg]);

  async function saveDetails() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/account/branding", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          org_name: orgName.trim(),
          brand_color: brandColor,
          brand_footer: brandFooter.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setMsg({ kind: "err", text: data.error ?? "Could not save" });
        return;
      }
      setMsg({ kind: "ok", text: "Branding saved." });
    } catch {
      setMsg({ kind: "err", text: "Network error" });
    } finally {
      setBusy(false);
    }
  }

  async function uploadLogo(file: File) {
    setLogoBusy(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("logo", file);
      const res = await fetch("/api/account/branding", { method: "PATCH", body: fd });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setMsg({ kind: "err", text: data.error ?? "Upload failed" });
        return;
      }
      // Re-fetch to get the new public URL.
      const refresh = await fetch("/api/account/branding", { cache: "no-store" });
      if (refresh.ok) {
        const refreshed = (await refresh.json()) as { branding?: Branding };
        setLogoUrl(refreshed.branding?.brand_logo_url ?? null);
      }
      setMsg({ kind: "ok", text: "Logo uploaded." });
    } catch {
      setMsg({ kind: "err", text: "Network error" });
    } finally {
      setLogoBusy(false);
    }
  }

  async function clearLogo() {
    if (!confirm("Remove your uploaded logo?")) return;
    setLogoBusy(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("clear_logo", "1");
      const res = await fetch("/api/account/branding", { method: "PATCH", body: fd });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setMsg({ kind: "err", text: data.error ?? "Could not remove logo" });
        return;
      }
      setLogoUrl(null);
      setMsg({ kind: "ok", text: "Logo removed." });
    } catch {
      setMsg({ kind: "err", text: "Network error" });
    } finally {
      setLogoBusy(false);
    }
  }

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="h-5 w-5 text-red-500" />
        <h2 className="text-lg font-semibold text-white">Report branding</h2>
        <span className="text-xs text-slate-500 ml-1">Professional plan</span>
      </div>
      <p className="text-slate-400 text-sm mb-5">
        Your logo, organization name, accent color, and footer line appear on the cover
        page of every PDF report you export.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
            Logo
          </label>
          <div className="flex items-start gap-3">
            <div className="h-20 w-32 rounded-md border border-slate-700 bg-slate-950 grid place-items-center overflow-hidden flex-shrink-0">
              {logoUrl ? (
                // Pro-controlled asset; same security model as their export.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-slate-600 text-xs">No logo</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={logoBusy}
                className="inline-flex items-center gap-2 border border-slate-600 hover:border-slate-500 text-slate-200 text-sm px-3 py-1.5 rounded-md transition-colors disabled:opacity-60"
              >
                {logoBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {logoUrl ? "Replace logo" : "Upload logo"}
              </button>
              {logoUrl && (
                <button
                  type="button"
                  onClick={clearLogo}
                  disabled={logoBusy}
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-red-400 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadLogo(file);
                  e.target.value = "";
                }}
              />
              <p className="text-slate-500 text-xs">PNG, JPEG, or WEBP · under 1.5 MB.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Organization name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              maxLength={120}
              placeholder="Smith & Partners Recovery LLP"
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Accent color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="h-9 w-12 bg-slate-950 border border-slate-700 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                pattern="^#[0-9a-fA-F]{6}$"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Footer line
            </label>
            <input
              type="text"
              value={brandFooter}
              onChange={(e) => setBrandFooter(e.target.value)}
              maxLength={200}
              placeholder="Prepared by Smith & Partners · 555 Main St · (212) 555-0100"
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {msg && (
        <p
          className={`mt-4 text-sm rounded-md px-3 py-2 ${
            msg.kind === "ok"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {msg.text}
        </p>
      )}

      <button
        onClick={saveDetails}
        disabled={busy}
        className="mt-5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Save branding
      </button>
    </section>
  );
}
