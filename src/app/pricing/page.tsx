import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import PricingCta from "@/components/billing/PricingCta";
import type { SubscriptionTier } from "@/types/database";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free to organize your scam evidence. Pay only for polished exports, cloud sync, and pro features.",
  alternates: { canonical: "/pricing" },
};

type Plan = {
  name: string;
  tier: SubscriptionTier;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  href?: string;
  highlight: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    tier: "free",
    price: "$0",
    period: "forever",
    desc: "Organize your evidence at no cost.",
    features: [
      "Unlimited cases",
      "Timeline builder",
      "Transaction ledger",
      "Evidence vault (local storage)",
      "Red flag classifier",
      "Watermarked PDF preview",
    ],
    cta: "Get Started Free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Evidence Packet",
    tier: "packet",
    price: "$19",
    period: "one-time per case",
    desc: "Export a clean, agency-ready packet for a single case.",
    features: [
      "Everything in Free",
      "Watermark-free PDF report",
      "CSV transaction export",
      "ZIP bundle with all evidence",
      "Reporting agency links",
      "Lifetime access to that packet",
    ],
    cta: "Buy Packet — $19",
    highlight: true,
  },
  {
    name: "Vault",
    tier: "vault",
    price: "$8",
    period: "per month, or $79/yr",
    desc: "Ongoing case management with cloud backup and unlimited exports.",
    features: [
      "Everything in Evidence Packet",
      "Cloud evidence storage (encrypted)",
      "Unlimited exports across all cases",
      "Sync across devices",
      "Shareable read-only case links",
      "Email reminders for stalled cases",
    ],
    cta: "Start Vault",
    highlight: false,
  },
  {
    name: "Professional",
    tier: "pro",
    price: "$49",
    period: "per seat / month",
    desc: "For attorneys, recovery firms, investigators, and advocates.",
    features: [
      "Everything in Vault",
      "Bulk case management",
      "Branded PDF reports",
      "Client intake portal",
      "API access",
      "Dedicated support",
    ],
    cta: "Start Professional",
    highlight: false,
  },
];

const faqShort = [
  {
    q: "Is the Free plan really free forever?",
    a: "Yes. Build unlimited cases, log transactions, upload evidence, and use the red-flag classifier. Free includes a watermarked PDF export. We charge only when you need a clean, agency-ready packet or cloud sync.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your dashboard. Subscription access continues to the end of the current billing period. No hold-music phone calls, ever.",
  },
  {
    q: "Do you offer nonprofit / clinic discounts?",
    a: "Yes. Legal aid clinics, AARP chapters, state AG fraud units, and victim-services nonprofits qualify for free or steeply discounted seats. Email partners@scamdam.app.",
  },
  {
    q: "What if I bought a Packet but need cloud sync later?",
    a: "Your Packet purchase credits toward your first month of Vault. Just reach out and we'll apply it.",
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Free to organize. Pay only when you need to export, store, or scale evidence work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 border flex flex-col ${
                  plan.highlight
                    ? "bg-red-600/10 border-red-500"
                    : "bg-slate-800 border-slate-700"
                }`}
              >
                {plan.highlight && (
                  <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">
                    Most Popular
                  </div>
                )}
                <div className="text-lg font-semibold mb-1">{plan.name}</div>
                <div className="text-3xl font-bold text-red-400 mb-1">{plan.price}</div>
                <div className="text-slate-400 text-sm mb-2">{plan.period}</div>
                <p className="text-slate-400 text-sm mb-6">{plan.desc}</p>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <PricingCta
                  tier={plan.tier}
                  label={plan.cta}
                  freeHref={plan.tier === "free" ? plan.href ?? "/signup" : undefined}
                  highlight={plan.highlight}
                />
                {plan.tier === "pro" && (
                  <Link
                    href="/contact"
                    className="block text-center text-xs text-slate-400 hover:text-slate-200 mt-2"
                  >
                    Need volume seats? Talk to sales →
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Pricing FAQ</h2>
            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-800/40 mb-10">
              {faqShort.map((f, i) => (
                <details key={i} className="group p-5">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                    <span className="font-medium text-white">{f.q}</span>
                    <span className="text-slate-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-slate-300 text-sm leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="text-center text-slate-500 text-sm">
              Not legal advice. Scam Dam helps you organize evidence for self-reporting only.
            </p>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
