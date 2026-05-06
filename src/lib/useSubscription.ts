"use client";

import { useEffect, useState } from "react";
import type { Profile, SubscriptionTier } from "@/types/database";

export interface SubscriptionState {
  tier: SubscriptionTier;
  status: Profile["subscription_status"];
  packetCredits: number;
  loading: boolean;
}

const FREE: SubscriptionState = {
  tier: "free",
  status: "inactive",
  packetCredits: 0,
  loading: false,
};

// Best-effort client-side subscription read. Falls back to "free" when
// Supabase isn't configured (demo mode), the user isn't signed in, or the
// profile row hasn't been provisioned yet.
export function useSubscription(): SubscriptionState {
  const [state, setState] = useState<SubscriptionState>({ ...FREE, loading: true });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) {
        if (!cancelled) setState(FREE);
        return;
      }
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          if (!cancelled) setState(FREE);
          return;
        }
        const { data: profile } = await supabase
          .from("profiles")
          .select(
            "subscription_tier,subscription_status,packet_credits",
          )
          .eq("id", user.id)
          .maybeSingle<
            Pick<
              Profile,
              "subscription_tier" | "subscription_status" | "packet_credits"
            >
          >();
        if (cancelled) return;
        setState({
          tier: profile?.subscription_tier ?? "free",
          status: profile?.subscription_status ?? "inactive",
          packetCredits: profile?.packet_credits ?? 0,
          loading: false,
        });
      } catch {
        if (!cancelled) setState(FREE);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
