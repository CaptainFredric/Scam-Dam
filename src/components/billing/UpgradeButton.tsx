"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { SubscriptionTier } from "@/types/database";

type Props = {
  tier: Exclude<SubscriptionTier, "free">;
  label?: string;
  className?: string;
};

export default function UpgradeButton({ tier, label, className }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tier,
          successPath: "/billing?status=success",
          cancelPath: "/pricing?status=canceled",
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={start}
        disabled={loading}
        className={
          className ??
          "w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
        }
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {label ?? "Upgrade"}
      </button>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
