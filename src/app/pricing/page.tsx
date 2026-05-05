import Link from "next/link";
import { Shield, CheckCircle } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Organize your evidence at no cost.",
    features: [
      "Unlimited cases",
      "Timeline builder",
      "Transaction ledger",
      "Evidence vault (local storage)",
      "Red flag classifier",
      "Basic case summary",
    ],
    cta: "Get Started Free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Evidence Packet",
    price: "$9–$29",
    period: "one-time",
    desc: "Export a clean report for a single case.",
    features: [
      "Everything in Free",
      "PDF evidence report",
      "CSV transaction export",
      "ZIP bundle with evidence",
      "Watermark-free exports",
      "Reporting agency links",
    ],
    cta: "Buy Report Export",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Vault",
    price: "$10",
    period: "per month",
    desc: "Ongoing case management with cloud backup.",
    features: [
      "Everything in Evidence Packet",
      "Cloud evidence storage (Supabase)",
      "Unlimited exports",
      "Case history & audit trail",
      "Shareable case links",
      "Priority support",
    ],
    cta: "Start Vault",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Professional",
    price: "$99–$299",
    period: "per month",
    desc: "For attorneys, investigators, and advocates.",
    features: [
      "Everything in Vault",
      "Bulk case management",
      "Client portal access",
      "Branded PDF reports",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Us",
    href: "/signup",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">Scam Dam</span>
          </Link>
          <Link href="/login" className="text-slate-300 hover:text-white text-sm">
            Sign In
          </Link>
        </div>
      </nav>

      <div className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-slate-400 text-lg">
              Free to organize. Pay only when you need to export or store evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <Link
                  href={plan.href}
                  className={`text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    plan.highlight
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "border border-slate-600 hover:border-slate-500 text-slate-300"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 text-sm mt-12">
            ⚠️ Not legal advice. Scam Dam helps you organize evidence for self-reporting only.
          </p>
        </div>
      </div>
    </div>
  );
}
