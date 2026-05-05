import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about Scam Dam — what it does, what it can't do, how it handles your evidence, and how to actually get scams reported.",
  alternates: { canonical: "/faq" },
};

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "Will Scam Dam recover my money?",
    a: (
      <>
        No. No honest service can promise that. Scam Dam helps you build a clean evidence
        packet so that the people who <em>can</em> potentially help — your bank, the
        receiving exchange, IC3, FTC, your local police, or an attorney — have what they
        need to act quickly. Recovery is rare; well-organized reports meaningfully improve
        the odds.
      </>
    ),
  },
  {
    q: "Is it actually free?",
    a: (
      <>
        Yes. You can build unlimited cases, log every transaction, upload every screenshot,
        and use the red-flag classifier without paying. Paid plans only kick in when you
        want a polished, watermark-free PDF, cloud sync across devices, or pro features for
        legal/recovery work. See <Link href="/pricing" className="text-red-400 hover:text-red-300">pricing</Link>.
      </>
    ),
  },
  {
    q: "Where is my evidence stored?",
    a: (
      <>
        On the Free plan, everything stays on your device in your browser&apos;s local storage —
        nothing is uploaded. On Vault and Professional plans, evidence is stored in
        encrypted cloud storage (Supabase) under your account. You can delete a case and its
        files at any time. See <Link href="/security" className="text-red-400 hover:text-red-300">security</Link> and{" "}
        <Link href="/privacy" className="text-red-400 hover:text-red-300">privacy</Link>.
      </>
    ),
  },
  {
    q: "Will agencies actually accept the PDF?",
    a: (
      <>
        The PDF is structured the way agency intakes prefer: cover summary, chronological
        timeline, transaction ledger with wallet addresses and exchange names, evidence
        index, and a signed disclaimer. You attach it to an IC3 / FTC submission, hand it
        to a bank fraud officer, or share it with an attorney. Agencies still run their own
        process; we make sure you walk in prepared instead of empty-handed.
      </>
    ),
  },
  {
    q: "I already filed with IC3 / FTC. Should I still use Scam Dam?",
    a: (
      <>
        Yes — many victims need to escalate to a bank, an exchange, a credit bureau, or
        local police after the initial agency report. A consistent packet you can hand to
        each one shortens that loop dramatically.
      </>
    ),
  },
  {
    q: "What kinds of scams do you support?",
    a: (
      <>
        Today: pig-butchering / fake crypto investment, romance scams, task scams,
        fake-job &amp; check-overpayment scams, tech-support fraud, phishing /
        account-takeover, and impersonation of trusted brands. The case structure adapts —
        you don&apos;t need a category that fits perfectly.
      </>
    ),
  },
  {
    q: "Can I share a case with my lawyer or family?",
    a: (
      <>
        On Vault and Professional plans, yes — you can generate a read-only share link or
        export a single ZIP containing the PDF, CSV, and all evidence files. On Free, you
        can export the PDF and email/print it manually.
      </>
    ),
  },
  {
    q: "Is this legal advice?",
    a: (
      <>
        No. Scam Dam is a documentation tool. Nothing here constitutes legal, financial,
        tax, or investigative advice. For legal action, talk to a licensed attorney in your
        jurisdiction. For tax write-offs of fraud losses, talk to a CPA.
      </>
    ),
  },
  {
    q: "Someone is impersonating Scam Dam on Telegram / WhatsApp. What do I do?",
    a: (
      <>
        Recovery scams target scam victims aggressively. We will <em>never</em> message you
        on social media or messaging apps. Forward suspected impersonation to{" "}
        <a className="text-red-400 hover:text-red-300" href="mailto:security@scamdam.app">
          security@scamdam.app
        </a>{" "}
        and report the account to the platform.
      </>
    ),
  },
  {
    q: "Do you train AI models on my case?",
    a: <>No. Your case data is never used to train AI. See <Link href="/privacy" className="text-red-400 hover:text-red-300">privacy</Link>.</>,
  },
  {
    q: "I&apos;m a nonprofit / clinic / state agency — can we get a bulk license?",
    a: (
      <>
        Yes. We offer discounted and free seats for legal aid clinics, AARP chapters, state
        AG fraud programs, and victim-services nonprofits. Reach out at{" "}
        <a className="text-red-400 hover:text-red-300" href="mailto:partners@scamdam.app">
          partners@scamdam.app
        </a>
        .
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently asked questions</h1>
          <p className="text-lg text-slate-300 mb-10">
            Don&apos;t see your question? <Link href="/contact" className="text-red-400 hover:text-red-300">Get in touch</Link>.
          </p>

          <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-800/40">
            {faqs.map((f, i) => (
              <details key={i} className="group p-5">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                  <span className="font-medium text-white">{f.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <div className="mt-3 text-slate-300 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
