import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Coins,
  Heart,
  Briefcase,
  ListChecks,
  Phone,
  Building,
  CreditCard,
} from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "Scam Resource Library",
  description:
    "Patterns, red flags, and step-by-step reporting guides for the most common scams — task scams, pig butchering, romance scams, fake jobs, and tech support fraud.",
  alternates: { canonical: "/resources" },
};

const scamTypes = [
  {
    icon: <ListChecks className="h-6 w-6 text-orange-400" />,
    border: "border-orange-500",
    title: "Task scams",
    summary:
      "You're recruited via WhatsApp or Telegram to 'review products' or 'optimize app ratings.' Early tasks pay small amounts; then you're pushed to deposit crypto to unlock higher-paying batches that never settle.",
    tells: [
      "Recruited cold via WhatsApp / Telegram / SMS",
      "First few payouts are small but real (the hook)",
      "Required to deposit USDT or BTC to 'unlock' bigger tasks",
      "'Negative balance' that requires more deposits to clear",
    ],
    do: [
      "Stop sending money the moment a deposit is requested",
      "Screenshot every task UI, balance, and chat thread before they delete you",
      "Capture the receiving wallet addresses and any exchange names",
    ],
  },
  {
    icon: <Coins className="h-6 w-6 text-yellow-400" />,
    border: "border-yellow-500",
    title: "Crypto investment / pig butchering",
    summary:
      "A long-game scam. Someone befriends you (often via a 'wrong number' text or dating app) over weeks, then introduces a crypto trading platform showing fake gains. Withdrawal is blocked behind 'taxes,' 'security deposits,' or 'verification fees.'",
    tells: [
      "Long emotional rapport before any money is mentioned",
      "Custom-branded trading app or website with no regulator",
      "Withdrawals blocked behind escalating fees",
      "Pressure to deposit more to 'protect' existing balance",
    ],
    do: [
      "Do not pay another 'fee' to unblock a withdrawal — it is the scam",
      "Save every wallet address you sent funds to (these go to your IC3 report)",
      "Identify the on-ramp (Coinbase / Cash App / Kraken / etc.) — they have fraud teams",
    ],
  },
  {
    icon: <Heart className="h-6 w-6 text-pink-400" />,
    border: "border-pink-500",
    title: "Romance scams",
    summary:
      "A new online relationship that never quite materializes in person, paired with crises that 'only you' can solve with money — medical bills, customs fees, a stuck shipment, an investment opportunity.",
    tells: [
      "Profile photos look professional / model-like",
      "Always travelling, in the military overseas, or 'on a rig'",
      "Crises arrive after rapport is established",
      "Asks for crypto, gift cards, or wire transfers — never bank transfer",
    ],
    do: [
      "Reverse image-search the profile photos",
      "Save the full chat history (Telegram, WhatsApp, Hinge, etc.) — most scammers delete accounts after detection",
      "Check FTC romance scam guidance",
    ],
  },
  {
    icon: <Briefcase className="h-6 w-6 text-blue-400" />,
    border: "border-blue-500",
    title: "Fake job offers",
    summary:
      "An unsolicited remote job offer with high pay and minimal qualifications. You're sent a fake check to 'buy equipment' from a vendor, or asked to pay training fees, or asked to forward packages.",
    tells: [
      "Hired with no real interview",
      "Mailed a check that is larger than expected; asked to forward part",
      "Asked to buy equipment from a specified vendor",
      "Onboarding via Telegram / WhatsApp instead of a corporate email",
    ],
    do: [
      "Do not deposit the check — it will bounce after you wire the 'overage'",
      "Save the offer letter, all email headers, and the phone numbers used",
      "Report to FTC and the actual company being impersonated",
    ],
  },
  {
    icon: <Phone className="h-6 w-6 text-purple-400" />,
    border: "border-purple-500",
    title: "Tech support fraud",
    summary:
      "A pop-up, call, or email claims your computer is infected, your bank account is compromised, or your Amazon order was hijacked. They walk you through 'protecting' your money by moving it to a 'government wallet' — i.e., the scammer's wallet.",
    tells: [
      "Caller claims to be Microsoft / Apple / your bank / the FBI",
      "Asks you to install AnyDesk, TeamViewer, or similar",
      "Tells you to keep the call secret and not tell tellers the real reason",
      "Directs you to a Bitcoin ATM",
    ],
    do: [
      "Hang up. Real agencies will never call you to move money for safety",
      "If you installed remote-access software, disconnect from the internet and have a technician inspect the machine",
      "Save the phone number, caller ID name, and any URLs they sent",
    ],
  },
];

const reportingChannels = [
  {
    icon: <Building className="h-6 w-6 text-red-400" />,
    title: "Federal — file these first",
    items: [
      { label: "FBI IC3 (Internet Crime Complaint Center)", href: "https://www.ic3.gov", note: "Required for most cyber-enabled fraud." },
      { label: "FTC ReportFraud", href: "https://reportfraud.ftc.gov", note: "Goes to a database used by 3,000+ law enforcement agencies." },
      { label: "CFPB Complaint Portal", href: "https://www.consumerfinance.gov/complaint/", note: "If a bank, credit union, or financial product is involved." },
      { label: "SEC TCR (investment fraud)", href: "https://www.sec.gov/tcr", note: "Investment platforms / unlicensed brokers." },
    ],
  },
  {
    icon: <CreditCard className="h-6 w-6 text-red-400" />,
    title: "Financial — within 60 days of last transfer",
    items: [
      { label: "Your bank's fraud department", href: "", note: "Reg E (debit) and Reg Z (credit) protections often have a 60-day clock." },
      { label: "The receiving exchange (Coinbase, Kraken, Cash App, etc.)", href: "", note: "Provide wallet addresses + transaction hashes from your packet." },
      { label: "Wire-transfer recall (if applicable)", href: "", note: "Time-critical — call your bank within 24–72 hours." },
      { label: "Equifax / Experian / TransUnion", href: "https://www.identitytheft.gov", note: "Place a fraud alert if any identity info was shared." },
    ],
  },
  {
    icon: <AlertTriangle className="h-6 w-6 text-red-400" />,
    title: "State & local",
    items: [
      { label: "Your State Attorney General's consumer protection office", href: "", note: "Many run dedicated elder fraud and cyber units." },
      { label: "Local police non-emergency line", href: "", note: "Bring a printed Scam Dam packet. Get a report number." },
      { label: "AARP Fraud Watch Helpline", href: "https://www.aarp.org/money/scams-fraud/helpline/", note: "Free counselor support: 1-877-908-3360." },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Scam resource library
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-3xl">
            Plain-English breakdowns of how the most common scams work, the early tells, the
            evidence to capture before they ghost you, and where to actually file a report.
          </p>

          <h2 className="text-2xl font-bold mb-6">Scam patterns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {scamTypes.map((s) => (
              <article
                key={s.title}
                className={`bg-slate-800 border-t-4 ${s.border} border-x border-b border-slate-700 rounded-xl p-6`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {s.icon}
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                </div>
                <p className="text-slate-300 text-sm mb-4">{s.summary}</p>
                <div className="mb-4">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Tells</div>
                  <ul className="space-y-1">
                    {s.tells.map((t) => (
                      <li key={t} className="text-slate-300 text-sm flex gap-2">
                        <span className="text-red-400">•</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">What to do now</div>
                  <ul className="space-y-1">
                    {s.do.map((t) => (
                      <li key={t} className="text-slate-300 text-sm flex gap-2">
                        <span className="text-emerald-400">✓</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6">Where to report</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {reportingChannels.map((c) => (
              <div key={c.title} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  {c.icon}
                  <h3 className="font-semibold">{c.title}</h3>
                </div>
                <ul className="space-y-3">
                  {c.items.map((item) => (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-400 hover:text-red-300 text-sm font-medium block"
                        >
                          {item.label} →
                        </a>
                      ) : (
                        <span className="text-slate-200 text-sm font-medium block">{item.label}</span>
                      )}
                      <span className="text-slate-400 text-xs">{item.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-red-600/20 to-red-500/5 border border-red-500/40 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to build your packet?</h2>
            <p className="text-slate-300 mb-5">
              Free to start. Most victims complete a full case in 20–40 minutes.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Start a case
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
