"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { SubscriptionTier } from "@/types/database";

type Props = {
  tier: SubscriptionTier;
  label: string;
  freeHref?: string;
  highlight?: boolean;
};

export default function PricingCta({ tier, label, freeHref, highlight }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const className = `text-center px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
    highlight
      ? "bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white"
      : "border border-slate-600 hover:border-slate-500 text-slate-300"
  }`;

  // On the static GitHub Pages preview there is no API server. Fall back
  // to the signup stub so paid CTAs don't 500 against a 404 endpoint.
  const isStaticPreview = process.env.NEXT_PUBLIC_STATIC_ONLY === "true";

  if (tier === "free" || isStaticPreview) {
    return (
      <Link href={freeHref ?? "/signup"} className={className}>
        {label}
      </Link>
    );
  }

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
      if (res.status === 401) {
        // User isn't signed in — send them to sign up first, we'll resume
        // the upgrade after they create an account.
        window.location.href = `/signup?next=/pricing`;
        return;
      }
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
      <button onClick={start} disabled={loading} className={className}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {label}
      </button>
      {error && (
        <p className="text-red-400 text-xs mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
