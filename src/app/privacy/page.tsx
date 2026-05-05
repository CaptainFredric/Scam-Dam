import type { Metadata } from "next";
import MarketingShell from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Scam Dam collects, uses, stores, and protects your personal information and case evidence.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto prose prose-invert prose-slate">
          <h1 className="text-4xl font-bold mb-2 text-white">Privacy Policy</h1>
          <p className="text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

          <p className="text-slate-300 mb-6">
            This Privacy Policy explains what information Scam Dam (&quot;we&quot;, &quot;us&quot;) collects,
            how we use it, and the rights you have. Plain English first; defined terms only
            where unavoidable.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-3 text-white">1. The short version</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-300 mb-6">
            <li>We do not sell your personal information.</li>
            <li>We do not share your case evidence with anyone other than service providers strictly necessary to run the product (e.g., our hosting provider).</li>
            <li>We do not use your case content to train AI models.</li>
            <li>On the Free plan, your case data stays on your device unless you choose to export it.</li>
            <li>You can delete your account and all associated data at any time.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-3 text-white">2. Information we collect</h2>
          <p className="text-slate-300 mb-3"><strong>Account information.</strong> Email address, password hash, plan tier, and payment status. Payments are processed by Stripe; we do not store full card numbers.</p>
          <p className="text-slate-300 mb-3"><strong>Case content.</strong> Anything you enter into a case: timeline entries, transactions, descriptions, files you upload (screenshots, documents). On Free, this is stored locally in your browser. On Vault and Professional, it is stored in our encrypted cloud database under your user ID.</p>
          <p className="text-slate-300 mb-3"><strong>Usage data.</strong> Standard server logs (IP, user agent, timestamps), product analytics events (pages visited, features used), and error reports. We use these to keep the service reliable and to debug issues — not to profile you.</p>
          <p className="text-slate-300 mb-3"><strong>Cookies.</strong> A small number of cookies are required for authentication and session management. We do not use third-party advertising cookies.</p>

          <h2 className="text-2xl font-bold mt-10 mb-3 text-white">3. How we use information</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-300 mb-6">
            <li>Operate, maintain, and secure the service.</li>
            <li>Process payments and manage subscriptions.</li>
            <li>Send transactional emails (verification, receipts, security alerts). Marketing emails are opt-in and you can unsubscribe at any time.</li>
            <li>Respond to support requests.</li>
            <li>Comply with legal obligations and enforce our Terms.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-3 text-white">4. Service providers</h2>
          <p className="text-slate-300 mb-3">We use a small set of vendors that process data on our behalf under contractual confidentiality and data-protection obligations. Current subprocessors:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300 mb-6">
            <li><strong>Supabase</strong> — database and file storage.</li>
            <li><strong>Stripe</strong> — payment processing.</li>
            <li><strong>Vercel</strong> — application hosting and edge delivery.</li>
            <li><strong>Email provider</strong> — transactional email delivery.</li>
          </ul>
          <p className="text-slate-300 mb-6">An updated subprocessor list is maintained on our <a className="text-red-400 hover:text-red-300" href="/security">Security page</a>.</p>

          <h2 className="text-2xl font-bold mt-10 mb-3 text-white">5. Your rights</h2>
          <p className="text-slate-300 mb-3">Regardless of where you live, you have the following rights with respect to your data:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300 mb-6">
            <li><strong>Access &amp; portability</strong> — export a copy of your account and case data at any time.</li>
            <li><strong>Correction</strong> — edit your account information from the dashboard.</li>
            <li><strong>Deletion</strong> — delete a case immediately; close your account to delete all data within 30 days.</li>
            <li><strong>Objection &amp; restriction</strong> — applicable to EU/UK residents under GDPR.</li>
            <li><strong>Do not sell or share</strong> — applicable to California residents. We do not sell or share personal information for cross-context behavioral advertising.</li>
          </ul>
          <p className="text-slate-300 mb-6">Email <a className="text-red-400 hover:text-red-300" href="mailto:privacy@scamdam.app">privacy@scamdam.app</a> to exercise any right.</p>

          <h2 className="text-2xl font-bold mt-10 mb-3 text-white">6. Retention</h2>
          <p className="text-slate-300 mb-6">We retain account and case data for as long as your account is active. After account closure, data is purged within 30 days, except where retention is required by law (e.g., tax records).</p>

          <h2 className="text-2xl font-bold mt-10 mb-3 text-white">7. Children</h2>
          <p className="text-slate-300 mb-6">Scam Dam is not directed to children under 13 (or 16 in the EEA). If you believe a child has provided personal information, please contact us so we can delete it.</p>

          <h2 className="text-2xl font-bold mt-10 mb-3 text-white">8. Changes</h2>
          <p className="text-slate-300 mb-6">If we make material changes, we&apos;ll notify users by email and update the &quot;Last updated&quot; date above before the changes take effect.</p>

          <h2 className="text-2xl font-bold mt-10 mb-3 text-white">9. Contact</h2>
          <p className="text-slate-300 mb-6">Questions: <a className="text-red-400 hover:text-red-300" href="mailto:privacy@scamdam.app">privacy@scamdam.app</a>.</p>
        </div>
      </section>
    </MarketingShell>
  );
}
