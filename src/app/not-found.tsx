import Link from "next/link";
import { ShieldOff } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";

export default function NotFound() {
  return (
    <MarketingShell>
      <section className="px-6 py-32 text-center">
        <div className="max-w-xl mx-auto">
          <ShieldOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-3">404</h1>
          <p className="text-xl text-slate-300 mb-2">This page doesn&apos;t exist.</p>
          <p className="text-slate-400 mb-8">
            The link may be outdated, or it never existed in the first place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors"
            >
              Back to home
            </Link>
            <Link
              href="/resources"
              className="border border-slate-600 hover:border-slate-500 text-slate-300 px-6 py-2.5 rounded-md font-medium transition-colors"
            >
              Browse the scam library
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
