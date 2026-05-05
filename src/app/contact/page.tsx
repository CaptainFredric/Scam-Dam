import type { Metadata } from "next";
import { Mail, AlertTriangle, Building2, Newspaper, LifeBuoy } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Scam Dam for support, partnerships, press, or security disclosures. We do not provide legal advice or recover funds.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: <LifeBuoy className="h-5 w-5 text-red-500" />,
    title: "Support",
    desc: "Trouble with your account, exports, or evidence upload.",
    email: "support@scamdam.app",
    sla: "Reply within 1–2 business days.",
  },
  {
    icon: <Building2 className="h-5 w-5 text-red-500" />,
    title: "Partnerships",
    desc: "Nonprofits, legal aid clinics, recovery firms, and state agencies.",
    email: "partners@scamdam.app",
    sla: "Reply within 3 business days.",
  },
  {
    icon: <Newspaper className="h-5 w-5 text-red-500" />,
    title: "Press & research",
    desc: "Journalists, researchers, and academic studies on fraud trends.",
    email: "press@scamdam.app",
    sla: "Reply within 3 business days.",
  },
  {
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    title: "Security disclosure",
    desc: "Vulnerabilities, abuse reports, or impersonation of Scam Dam.",
    email: "security@scamdam.app",
    sla: "Acknowledge within 24 hours.",
  },
];

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact us</h1>
          <p className="text-lg text-slate-300 mb-10">
            We read every message. Pick the right channel below so we can route your note to
            someone who can actually help.
          </p>

          <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-5 mb-10 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-100">
              <strong>Beware of fake &ldquo;recovery agents.&rdquo;</strong> Scam Dam will{" "}
              <em>never</em> DM you on Telegram, WhatsApp, Instagram, or Facebook offering to
              recover your funds for a fee. If someone claims to be us anywhere except the
              addresses below, please report it to{" "}
              <a className="underline hover:text-white" href="mailto:security@scamdam.app">
                security@scamdam.app
              </a>
              .
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {channels.map((c) => (
              <div key={c.title} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  {c.icon}
                  <h2 className="font-semibold">{c.title}</h2>
                </div>
                <p className="text-slate-400 text-sm mb-3">{c.desc}</p>
                <a
                  href={`mailto:${c.email}`}
                  className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  <Mail className="h-4 w-4" />
                  {c.email}
                </a>
                <p className="text-slate-500 text-xs mt-2">{c.sla}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-2">Need to report a scam right now?</h2>
            <p className="text-slate-400 text-sm mb-4">
              Scam Dam is a tool, not a reporting agency. File directly with:
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.ic3.gov" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
                  FBI Internet Crime Complaint Center (IC3) →
                </a>
              </li>
              <li>
                <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
                  FTC Report Fraud →
                </a>
              </li>
              <li>
                <a href="https://www.consumerfinance.gov/complaint/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
                  CFPB Complaint Portal →
                </a>
              </li>
              <li className="text-slate-400">
                Local police — non-emergency line. Bring your Scam Dam packet.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
