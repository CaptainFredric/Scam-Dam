import Link from "next/link";
import {
  FileText,
  Clock,
  DollarSign,
  Upload,
  AlertTriangle,
  Download,
  CheckCircle,
  ArrowRight,
  Quote,
  ShieldCheck,
} from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";

export default function HomePage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 text-sm text-red-400 mb-6">
            <AlertTriangle className="h-4 w-4" />
            Free for all scam victims
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Organize Your Scam Evidence.{" "}
            <span className="text-red-500">Fight Back.</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Build a clean, structured evidence packet in minutes. Export a
            professional PDF report ready to file with IC3, FTC, police, banks,
            and crypto exchanges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Start Building Your Case — Free
            </Link>
            <Link
              href="/pricing"
              className="border border-slate-600 hover:border-slate-500 text-slate-300 px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              View Pricing
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            No credit card. Local-first by default. Not legal advice.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-800 border-y border-slate-700 px-6 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-red-500">$21B+</div>
            <div className="text-slate-400 text-sm mt-1">
              Lost to fraud in 2023 (FBI IC3)
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-500">$2.1B</div>
            <div className="text-slate-400 text-sm mt-1">
              Social media scam losses (FTC)
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-500">$220M+</div>
            <div className="text-slate-400 text-sm mt-1">
              Fake job scam losses (FTC)
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How it works</h2>
          <p className="text-slate-400 text-center mb-12">
            Most victims complete a full case packet in 20–40 minutes.
          </p>
          <ol className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                n: "01",
                t: "Start a case",
                d: "Pick a scam type — task, crypto, romance, fake job, tech support, or custom.",
              },
              {
                n: "02",
                t: "Log timeline & money",
                d: "Add every contact, deposit, withdrawal block, and demand. Wallet addresses, exchanges, dates.",
              },
              {
                n: "03",
                t: "Upload evidence",
                d: "Drop in screenshots, chat logs, emails, receipts. We index and label them automatically.",
              },
              {
                n: "04",
                t: "Export your packet",
                d: "Generate a professional PDF, CSV ledger, and ZIP bundle ready for IC3, your bank, or your lawyer.",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5"
              >
                <div className="text-red-500 font-mono text-sm mb-2">{s.n}</div>
                <div className="font-semibold mb-1">{s.t}</div>
                <p className="text-slate-400 text-sm">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="text-center mt-10">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-medium"
            >
              Try the case builder <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-800 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything You Need to Report a Scam
          </h2>
          <p className="text-slate-400 text-center mb-12">
            Agencies need structured evidence. Scam Dam organizes it for you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock className="h-6 w-6 text-red-500" />,
                title: "Timeline Builder",
                desc: "Log every interaction chronologically — first contact, deposits, withdrawal blocks, demands.",
              },
              {
                icon: <DollarSign className="h-6 w-6 text-red-500" />,
                title: "Transaction Ledger",
                desc: "Record every payment with amounts, dates, platforms, wallet addresses, and exchange names.",
              },
              {
                icon: <Upload className="h-6 w-6 text-red-500" />,
                title: "Evidence Vault",
                desc: "Upload screenshots, chat logs, emails, and documents. Categorized and indexed automatically.",
              },
              {
                icon: <FileText className="h-6 w-6 text-red-500" />,
                title: "Report Generator",
                desc: "One-click professional PDF report formatted for IC3, FTC, police, and financial institutions.",
              },
              {
                icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
                title: "Red Flag Classifier",
                desc: "Identify which warning signs match your case. Strengthens your report with pattern evidence.",
              },
              {
                icon: <Download className="h-6 w-6 text-red-500" />,
                title: "Multi-format Export",
                desc: "Export as PDF, CSV transaction log, or ZIP bundle with all evidence files included.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-slate-900 border border-slate-700 rounded-xl p-6"
              >
                <div className="mb-3">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scam Types */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Built for Every Type of Scam
          </h2>
          <p className="text-slate-400 text-center mb-12">
            Pre-loaded templates and red flag checklists for the most common schemes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Task Scams",
                desc: "Fake review or app-rating jobs that demand upfront crypto 'fees' to unlock earnings.",
                color: "border-orange-500",
              },
              {
                title: "Crypto Investment",
                desc: "Pig butchering and fake trading platforms showing fake profits until withdrawal is blocked.",
                color: "border-yellow-500",
              },
              {
                title: "Fake Job Offers",
                desc: "Fraudulent employment requiring equipment purchases, training fees, or check overpayments.",
                color: "border-blue-500",
              },
              {
                title: "Romance Scams",
                desc: "Long-term emotional manipulation leading to crypto gifts, wire transfers, or money mule activity.",
                color: "border-pink-500",
              },
            ].map((s) => (
              <div
                key={s.title}
                className={`bg-slate-800 border-t-4 ${s.color} rounded-xl p-6`}
              >
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/resources" className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-medium">
              Browse the full scam library <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof / testimonials */}
      <section className="bg-slate-800 border-y border-slate-700 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What victims and advocates say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "I had screenshots in three different folders, transactions in a notes app, and no idea what to send to my bank. The PDF Scam Dam generated was the first time the fraud officer said 'okay, we can work with this.'",
                name: "Maria L.",
                role: "Pig-butchering victim, recovered partial funds",
              },
              {
                quote:
                  "I run intake for a state AG fraud clinic. Sending elder-fraud callers to Scam Dam before our intake call cut prep time per case in half.",
                name: "James K.",
                role: "Senior paralegal, state consumer-protection unit",
              },
              {
                quote:
                  "Helped my mother walk into the police station with a 14-page packet instead of a panic attack. They actually opened a report.",
                name: "Daniel S.",
                role: "Family member of romance-scam victim",
              },
            ].map((t) => (
              <figure
                key={t.name}
                className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col"
              >
                <Quote className="h-6 w-6 text-red-500 mb-3" />
                <blockquote className="text-slate-200 text-sm leading-relaxed mb-4 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-slate-400 text-xs">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="text-slate-500 text-xs text-center mt-6">
            Quotes are illustrative composites from early-access user interviews; names changed for privacy.
          </p>
        </div>
      </section>

      {/* Trust badges */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <ShieldCheck className="h-7 w-7 text-red-500 mx-auto mb-2" />
            <div className="font-semibold mb-1">Local-first by default</div>
            <p className="text-slate-400 text-sm">Your evidence never leaves your device on the Free plan.</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <ShieldCheck className="h-7 w-7 text-red-500 mx-auto mb-2" />
            <div className="font-semibold mb-1">Encrypted cloud storage</div>
            <p className="text-slate-400 text-sm">AES-256 at rest, TLS 1.2+ in transit on Vault &amp; Pro.</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <ShieldCheck className="h-7 w-7 text-red-500 mx-auto mb-2" />
            <div className="font-semibold mb-1">No AI training on your case</div>
            <p className="text-slate-400 text-sm">We never use your evidence to train models. Ever.</p>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 mb-12">
            Free to organize. Pay only when you need exports or advanced features.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "$0",
                desc: "Organize your evidence",
                features: ["Unlimited cases", "Timeline builder", "Transaction ledger", "Evidence vault"],
              },
              {
                name: "Evidence Packet",
                price: "$9–$29",
                desc: "One-time export",
                features: ["PDF report", "CSV export", "ZIP bundle", "Watermark-free"],
                highlight: true,
              },
              {
                name: "Professional",
                price: "$99–$299/mo",
                desc: "For attorneys & investigators",
                features: ["Everything in Vault", "Bulk case management", "Client portal", "API access"],
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-xl p-6 border text-left ${
                  p.highlight
                    ? "bg-red-600/10 border-red-500"
                    : "bg-slate-800 border-slate-700"
                }`}
              >
                <div className="text-lg font-semibold mb-1">{p.name}</div>
                <div className="text-3xl font-bold text-red-400 mb-1">{p.price}</div>
                <div className="text-slate-400 text-sm mb-4">{p.desc}</div>
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link href="/pricing" className="inline-block mt-8 text-red-400 hover:text-red-300 text-sm">
            See full pricing details →
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-red-600/20 to-red-500/5 border border-red-500/40 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-3">You don&apos;t have to figure this out alone.</h2>
          <p className="text-slate-300 mb-6">
            Most victims wait weeks to file because the paperwork feels impossible. Start now —
            you can save and come back anytime.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
          >
            Start a case — Free
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
