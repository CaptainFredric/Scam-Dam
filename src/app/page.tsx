import Link from "next/link";
import {
  Shield,
  FileText,
  Clock,
  DollarSign,
  Upload,
  AlertTriangle,
  Download,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">Scam Dam</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-slate-300 hover:text-white text-sm">
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-slate-300 hover:text-white text-sm"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 text-sm text-red-400 mb-6">
            <AlertTriangle className="h-4 w-4" />
            Free for all scam victims
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
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
            ⚠️ Not legal advice. This tool helps you organize evidence for self-reporting.
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

      {/* Features */}
      <section className="px-6 py-20">
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
                className="bg-slate-800 border border-slate-700 rounded-xl p-6"
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
      <section className="bg-slate-800 px-6 py-20">
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
                className={`bg-slate-900 border-t-4 ${s.color} rounded-xl p-6`}
              >
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="px-6 py-20">
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
                className={`rounded-xl p-6 border ${
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

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-red-500" />
            <span className="font-bold">Scam Dam</span>
          </div>
          <p className="text-slate-400 text-sm mb-6 max-w-xl">
            ⚠️ <strong>Disclaimer:</strong> Scam Dam is an evidence organization tool only. It does not
            provide legal advice, guarantee recovery of funds, or guarantee any
            outcome from reporting. Always consult a licensed attorney for legal
            matters.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="https://www.ic3.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300"
            >
              FBI IC3 →
            </a>
            <a
              href="https://reportfraud.ftc.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300"
            >
              FTC Report Fraud →
            </a>
            <a
              href="https://www.consumerfinance.gov/complaint/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300"
            >
              CFPB Complaint →
            </a>
          </div>
          <p className="mt-6 text-slate-600 text-xs">
            © {new Date().getFullYear()} Scam Dam. Not affiliated with any government agency.
          </p>
        </div>
      </footer>
    </div>
  );
}
