import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ExternalLink, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/plans";
import type { Profile } from "@/types/database";
import OpenPortalButton from "@/components/billing/OpenPortalButton";
import UpgradeButton from "@/components/billing/UpgradeButton";

export const dynamic = "force-dynamic";

const tierLabel: Record<Profile["subscription_tier"], string> = {
  free: "Free",
  packet: "Evidence Packet",
  vault: "Vault",
  pro: "Professional",
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Not signed in / Supabase not configured: send to login.
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id,email,stripe_customer_id,subscription_tier,subscription_status,current_period_end,packet_credits",
    )
    .eq("id", user.id)
    .maybeSingle<Profile>();

  const tier = profile?.subscription_tier ?? "free";
  const status = profile?.subscription_status ?? "inactive";
  const periodEnd = profile?.current_period_end
    ? new Date(profile.current_period_end).toLocaleDateString()
    : null;
  const credits = profile?.packet_credits ?? 0;
  const hasCustomer = Boolean(profile?.stripe_customer_id);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6">Billing</h1>

      {params.status === "success" && (
        <div className="mb-6 flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 rounded-md px-4 py-3 text-sm">
          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            Payment succeeded. If your plan hasn&apos;t updated yet, give Stripe a
            few seconds and refresh this page.
          </span>
        </div>
      )}
      {params.status === "canceled" && (
        <div className="mb-6 flex items-start gap-2 bg-amber-500/10 border border-amber-500/40 text-amber-200 rounded-md px-4 py-3 text-sm">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Checkout canceled — no charge made.</span>
        </div>
      )}

      <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">
              Current plan
            </div>
            <div className="text-2xl font-bold text-white">{tierLabel[tier]}</div>
            <div className="text-sm text-slate-400 mt-1">
              Status:{" "}
              <span
                className={
                  status === "active" || status === "trialing"
                    ? "text-emerald-400"
                    : status === "past_due"
                      ? "text-amber-400"
                      : "text-slate-300"
                }
              >
                {status.replace("_", " ")}
              </span>
              {periodEnd ? ` · renews ${periodEnd}` : null}
            </div>
            {credits > 0 && (
              <div className="text-sm text-slate-300 mt-2">
                Packet credits available: <strong>{credits}</strong>
              </div>
            )}
          </div>
          {hasCustomer && (
            <OpenPortalButton />
          )}
        </div>
        <p className="text-slate-400 text-sm">
          {tier === "free"
            ? "Upgrade for watermark-free exports, cloud sync across devices, and shareable case links."
            : "Manage payment method, invoices, and cancellation through the Stripe portal."}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(["packet", "vault", "pro"] as const).map((key) => {
          const plan = PLANS[key];
          const current = tier === plan.tier;
          return (
            <div
              key={plan.tier}
              className={`rounded-xl p-5 border flex flex-col ${
                current
                  ? "bg-red-600/10 border-red-500"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              <div className="text-lg font-semibold mb-1">{plan.label}</div>
              <div className="text-slate-400 text-xs mb-3">{plan.unit}</div>
              <p className="text-slate-300 text-sm mb-5 flex-1">{plan.blurb}</p>
              {current ? (
                <span className="text-emerald-400 text-sm font-medium">
                  Active plan
                </span>
              ) : plan.priceId ? (
                <UpgradeButton tier={key} label={`Switch to ${plan.label}`} />
              ) : (
                <span className="text-slate-500 text-xs">
                  Not configured — set <code>{plan.envVar}</code>
                </span>
              )}
            </div>
          );
        })}
      </section>

      <div className="mt-8 text-sm text-slate-400">
        Questions about billing? <Link href="/contact" className="text-red-400 hover:text-red-300">Contact us</Link>.{" "}
        <a
          href="https://stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300"
        >
          Powered by Stripe <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
