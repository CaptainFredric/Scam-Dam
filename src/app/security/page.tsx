import type { Metadata } from "next";
import { Lock, Eye, Server, Shield, KeyRound, Trash2 } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How Scam Dam stores, encrypts, and protects scam-victim evidence. Disclosure policy and trust posture.",
  alternates: { canonical: "/security" },
};

const principles = [
  {
    icon: <Lock className="h-5 w-5 text-red-500" />,
    title: "Encryption at rest and in transit",
    desc: "All cloud-stored evidence is encrypted at rest with AES-256, and all traffic is TLS 1.2+ end-to-end. Database connections are mTLS.",
  },
  {
    icon: <Eye className="h-5 w-5 text-red-500" />,
    title: "Least-privilege access",
    desc: "Only a small set of on-call engineers can access production, audited via SSO + hardware-key 2FA. No engineer accesses your case content for support unless you explicitly attach it to a ticket.",
  },
  {
    icon: <Server className="h-5 w-5 text-red-500" />,
    title: "Local-first by default",
    desc: "Free-plan cases stay in your browser. Nothing is uploaded to our servers unless you explicitly upgrade to Vault or Professional.",
  },
  {
    icon: <Shield className="h-5 w-5 text-red-500" />,
    title: "Row-level isolation",
    desc: "Cloud storage uses Supabase Row Level Security so a user can only ever read or write their own cases. Verified by automated tests on every deploy.",
  },
  {
    icon: <KeyRound className="h-5 w-5 text-red-500" />,
    title: "Authentication",
    desc: "Email + password with strong-password requirements. We support magic links and TOTP-based 2FA on paid plans. Sessions rotate on suspicious activity.",
  },
  {
    icon: <Trash2 className="h-5 w-5 text-red-500" />,
    title: "Right to deletion",
    desc: "Delete a case and its evidence at any time from your dashboard. Account-wide deletion purges all rows and storage objects within 30 days.",
  },
];

export default function SecurityPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Security &amp; trust</h1>
          <p className="text-lg text-slate-300 mb-10">
            Scam Dam holds the most sensitive moments of someone&apos;s life — what they lost,
            who they trusted, what they sent. We treat that data accordingly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {principles.map((p) => (
              <div key={p.title} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  {p.icon}
                  <h2 className="font-semibold">{p.title}</h2>
                </div>
                <p className="text-slate-400 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-3">Responsible disclosure</h2>
          <p className="text-slate-300 mb-3">
            If you believe you&apos;ve found a vulnerability, please email{" "}
            <a className="text-red-400 hover:text-red-300" href="mailto:security@scamdam.app">
              security@scamdam.app
            </a>
            . We commit to:
          </p>
          <ul className="space-y-2 text-slate-300 mb-10 text-sm">
            <li>• Acknowledge your report within 24 hours.</li>
            <li>• Provide an initial triage within 3 business days.</li>
            <li>• Keep you informed through remediation, and credit you publicly if you&apos;d like.</li>
            <li>• Not pursue legal action against good-faith research that follows this policy.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">Out of scope</h2>
          <ul className="space-y-2 text-slate-300 mb-10 text-sm">
            <li>• Social engineering of Scam Dam employees, partners, or users.</li>
            <li>• Denial of service, brute-force, or volumetric testing against production.</li>
            <li>• Reports based solely on missing security headers without a working exploit.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">Roadmap</h2>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• SOC 2 Type II — in progress, target completion within 12 months of paid-plan launch.</li>
            <li>• End-to-end encrypted evidence vault for Professional tier.</li>
            <li>• Public security overview &amp; subprocessor list.</li>
          </ul>
        </div>
      </section>
    </MarketingShell>
  );
}
