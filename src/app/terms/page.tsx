import type { Metadata } from "next";
import MarketingShell from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The agreement between Scam Dam and its users — what we promise, what we don't, and the rules of the road.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-slate-400 mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-5 mb-10 text-sm text-amber-100">
            <strong>Plain language:</strong> Scam Dam is a documentation tool. We do not
            give legal advice, recover funds, or guarantee any outcome from filing a report.
            Use Scam Dam to organize your evidence and report through proper channels.
          </div>

          <section className="space-y-8 text-slate-300">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">1. Who&apos;s who</h2>
              <p>&quot;Scam Dam,&quot; &quot;we,&quot; &quot;us&quot; refers to Scam Dam and its operators. &quot;You&quot; means the person or organization using the service. By creating an account or using Scam Dam you agree to these Terms.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">2. The service</h2>
              <p>Scam Dam helps you organize evidence about a suspected scam and produce a report you can submit to agencies, banks, exchanges, attorneys, and other recipients of your choosing. The service is provided &quot;as is&quot; and &quot;as available.&quot;</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">3. Not legal, financial, or recovery advice</h2>
              <p>Nothing on this site or in any output of the service constitutes legal, financial, tax, accounting, investigative, or recovery advice. We are not your lawyer. We do not represent you in any matter. Decisions you make based on Scam Dam outputs are your own. For legal advice, consult a licensed attorney in your jurisdiction.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">4. Accounts</h2>
              <p>You must be at least 13 (or 16 in the EEA) to create an account. You&apos;re responsible for keeping your credentials secure and for everything that happens under your account. Notify us immediately if you suspect unauthorized access.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">5. Acceptable use</h2>
              <p>Don&apos;t use Scam Dam to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Defame, harass, or knowingly make false accusations against another person.</li>
                <li>Upload content you don&apos;t have a right to upload (e.g., others&apos; private communications obtained illegally).</li>
                <li>Reverse-engineer, scrape, or attempt to bypass access controls.</li>
                <li>Resell, white-label, or sublicense the service without a written agreement.</li>
                <li>Violate applicable law or rights of others.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">6. Your content</h2>
              <p>You retain all ownership of evidence and information you submit. You grant us a limited license to host, display, and process your content solely to operate the service for you. We will not use your case content to train AI models, sell it, or share it except as required to run the product or comply with valid legal process.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">7. Plans, billing, refunds</h2>
              <p>Paid plans renew automatically until cancelled. Cancel any time from your dashboard; access continues to the end of the billing period. One-time exports (e.g., Evidence Packet) are non-refundable once the export has been generated, except where required by law. Subscription refunds are available within 14 days if you have not used a paid feature.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">8. Termination</h2>
              <p>You can close your account at any time. We may suspend or terminate accounts that violate these Terms, on notice where reasonable. Sections that by their nature should survive (IP, disclaimers, liability, indemnity, governing law) survive termination.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">9. Disclaimers</h2>
              <p className="uppercase text-sm tracking-wide text-slate-400">
                The service is provided &quot;as is.&quot; To the maximum extent permitted by law, we
                disclaim all warranties — express or implied — including merchantability,
                fitness for a particular purpose, and non-infringement. We do not warrant
                that the service will be uninterrupted or error-free, or that any specific
                outcome (including fund recovery or successful prosecution) will result from
                using it.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">10. Limitation of liability</h2>
              <p>To the maximum extent permitted by law, Scam Dam will not be liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, lost data, or business interruption. Our total liability for any claim is limited to the amount you paid us in the 12 months preceding the claim, or US $100, whichever is greater.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">11. Indemnification</h2>
              <p>You agree to indemnify Scam Dam against claims arising from your misuse of the service or your violation of these Terms.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">12. Changes</h2>
              <p>We may update these Terms from time to time. Material changes will be communicated by email or in-app notice at least 14 days before they take effect.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">13. Governing law</h2>
              <p>These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict-of-laws principles. Disputes will be resolved in the state or federal courts located in Delaware, except where applicable consumer-protection law gives you the right to bring claims locally.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">14. Contact</h2>
              <p>Questions about these Terms: <a className="text-red-400 hover:text-red-300" href="mailto:legal@scamdam.app">legal@scamdam.app</a>.</p>
            </div>
          </section>
        </div>
      </section>
    </MarketingShell>
  );
}
