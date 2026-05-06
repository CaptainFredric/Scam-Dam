"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { useSubscription } from "@/lib/useSubscription";
import { meetsTier } from "@/lib/plans";
import UpsellModal from "@/components/billing/UpsellModal";
import ShareModal from "./ShareModal";

export default function ShareCaseButton({ caseId }: { caseId: string }) {
  const subscription = useSubscription();
  const [open, setOpen] = useState(false);
  const [upsell, setUpsell] = useState(false);

  const canShare = meetsTier(subscription.tier, "vault");

  function onClick() {
    if (subscription.loading) return;
    if (!canShare) {
      setUpsell(true);
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <button
        onClick={onClick}
        className="inline-flex items-center gap-2 border border-slate-600 hover:border-slate-500 text-slate-200 text-sm px-3 py-1.5 rounded-md transition-colors"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>
      <ShareModal caseId={caseId} open={open} onClose={() => setOpen(false)} />
      <UpsellModal
        open={upsell}
        onClose={() => setUpsell(false)}
        feature="Sharing a read-only case link"
      />
    </>
  );
}
