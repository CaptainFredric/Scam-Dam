import Link from "next/link";
import { Shield } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 px-6 py-14 mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-red-500" />
              <span className="font-bold">Scam Dam</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              A free, structured evidence builder for victims of fraud. Organize the truth.
              Hand officials a packet they can act on.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-white mb-3">Product</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/security" className="hover:text-white">Security</Link></li>
              <li><Link href="/signup" className="hover:text-white">Get started</Link></li>
              <li><Link href="/login" className="hover:text-white">Sign in</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white mb-3">Resources</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/resources" className="hover:text-white">Scam library</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white mb-3">Report a scam</div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.ic3.gov" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
                  FBI IC3 →
                </a>
              </li>
              <li>
                <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
                  FTC Report Fraud →
                </a>
              </li>
              <li>
                <a href="https://www.consumerfinance.gov/complaint/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
                  CFPB Complaint →
                </a>
              </li>
              <li>
                <a href="https://www.aarp.org/money/scams-fraud/helpline/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
                  AARP Fraud Watch →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <p className="text-slate-500 text-xs max-w-2xl">
            <strong className="text-slate-300">Disclaimer:</strong> Scam Dam is an evidence
            organization tool. It does not provide legal advice, guarantee recovery of funds,
            or guarantee any outcome from reporting. Always consult a licensed attorney for
            legal matters. Not affiliated with any government agency.
          </p>
          <div className="flex gap-4 text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/security" className="hover:text-white">Security</Link>
          </div>
        </div>
        <p className="text-slate-600 text-xs mt-4">
          © {new Date().getFullYear()} Scam Dam. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
