// Central plan configuration. Stripe Price IDs are env-driven so the
// same code works against test and live modes — set them per environment.
//
// One-shot purchases (Packet) use mode: "payment" + grant a packet_credit.
// Recurring plans (Vault, Pro) use mode: "subscription" + set the tier.

import type { SubscriptionTier } from "@/types/database";

export type PlanKind = "one_time" | "subscription";

export interface PlanConfig {
  tier: SubscriptionTier;
  kind: PlanKind;
  envVar: string;
  priceId: string | undefined;
  label: string;
  blurb: string;
  unit?: string;
}

export const PLANS: Record<Exclude<SubscriptionTier, "free">, PlanConfig> = {
  packet: {
    tier: "packet",
    kind: "one_time",
    envVar: "STRIPE_PRICE_PACKET",
    priceId: process.env.STRIPE_PRICE_PACKET,
    label: "Evidence Packet",
    blurb: "One clean, agency-ready packet for a single case.",
    unit: "one-time / case",
  },
  vault: {
    tier: "vault",
    kind: "subscription",
    envVar: "STRIPE_PRICE_VAULT",
    priceId: process.env.STRIPE_PRICE_VAULT,
    label: "Vault",
    blurb: "Cloud sync, unlimited exports, sharing, reminders.",
    unit: "per month",
  },
  pro: {
    tier: "pro",
    kind: "subscription",
    envVar: "STRIPE_PRICE_PRO",
    priceId: process.env.STRIPE_PRICE_PRO,
    label: "Professional",
    blurb: "For attorneys, recovery firms, and clinics. Per seat.",
    unit: "per seat / month",
  },
};

export function isExportingTier(tier: SubscriptionTier): boolean {
  // Tiers that get watermark-free exports.
  return tier === "vault" || tier === "pro" || tier === "packet";
}

export function tierRank(tier: SubscriptionTier): number {
  return ({ free: 0, packet: 1, vault: 2, pro: 3 } as const)[tier];
}

export function meetsTier(
  current: SubscriptionTier,
  required: SubscriptionTier,
): boolean {
  return tierRank(current) >= tierRank(required);
}

export function planFromTier(
  tier: Exclude<SubscriptionTier, "free">,
): PlanConfig {
  return PLANS[tier];
}
