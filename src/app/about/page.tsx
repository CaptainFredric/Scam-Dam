import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Heart, Target, Users } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Scam Dam exists, who we serve, and how we approach evidence, privacy, and trust.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 text-sm text-red-400 mb-6">
            <Heart className="h-4 w-4" />
            Built for victims, not for headlines
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Most fraud reports never get filed —{" "}
            <span className="text-red-500">because organizing the evidence is brutal.</span>
          </h1>
          <p className="text-lg text-slate-300 mb-6">
            After someone is scammed, they sit on a pile of screenshots, half-remembered
            dates, scattered transaction confirmations, and a Telegram thread that suddenly
            went dark. The next 72 hours matter — banks need exact amounts, exchanges need
            wallet addresses, IC3 wants a structured timeline. Most people give up before
            they get there.
          </p>
          <p className="text-lg text-slate-300 mb-10">
            Scam Dam is the boring, careful tool that gets victims from{" "}
            <em>&ldquo;I think I was scammed&rdquo;</em> to{" "}
            <em>&ldquo;here is a 12-page packet ready for the FBI, my bank, and my lawyer.&rdquo;</em>{" "}
            That&apos;s it. That&apos;s the whole product.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
            {[
              {
                icon: <Target className="h-6 w-6 text-red-500" />,
                title: "Single purpose",
                desc: "One job: turn chaos into a packet officials accept on the first try.",
              },
              {
                icon: <Shield className="h-6 w-6 text-red-500" />,
                title: "Privacy by default",
                desc: "Your case is yours. We never sell, share, or train models on your data.",
              },
              {
                icon: <Users className="h-6 w-6 text-red-500" />,
                title: "Free where it matters",
                desc: "Organizing evidence is always free. We charge only when you need polished exports or cloud sync.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="mb-3">{v.icon}</div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-slate-400 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4">Who we serve</h2>
          <ul className="space-y-3 text-slate-300 mb-10">
            <li>
              <strong className="text-white">Direct victims</strong> — anyone who lost money,
              identity, or access to an account through fraud or social engineering.
            </li>
            <li>
              <strong className="text-white">Family members</strong> — adult children helping
              older parents document a romance scam or tech-support fraud.
            </li>
            <li>
              <strong className="text-white">Recovery firms &amp; attorneys</strong> — legal
              professionals who need a clean intake packet from clients before billable work
              starts.
            </li>
            <li>
              <strong className="text-white">Nonprofits &amp; agencies</strong> — fraud
              clinics, AARP chapters, legal aid groups, and state AG offices that intake
              dozens of scam reports a week.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">What we won&apos;t do</h2>
          <ul className="space-y-3 text-slate-300 mb-10">
            <li>• We don&apos;t promise to recover your money. No honest tool can.</li>
            <li>• We don&apos;t refer you to &ldquo;recovery agents&rdquo; who DM you on Telegram. Those are scams targeting scam victims.</li>
            <li>• We don&apos;t sell or share your evidence. Ever. (See our <Link href="/privacy" className="text-red-400 hover:text-red-300">privacy policy</Link>.)</li>
            <li>• We don&apos;t pretend to be law enforcement or an arm of one. We help you reach the real ones.</li>
          </ul>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-10">
            <h2 className="text-xl font-bold mb-2">A note from the team</h2>
            <p className="text-slate-300 text-sm">
              Scam Dam started after watching a relative spend three weekends rebuilding a
              timeline of a pig-butchering case in a Google Doc, only to have the bank reject
              the report because the wallet addresses weren&apos;t formatted right. The next time
              someone you know is scammed, they shouldn&apos;t have to figure this out alone.
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/signup"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Start a case for free
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
