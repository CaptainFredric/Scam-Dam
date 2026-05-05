#!/usr/bin/env node
// Prepares the project for a GitHub Pages static export.
// Pages can only host the marketing site; routes that need a Node runtime
// (API handlers, the auth-gated dashboard, the dynamic case-detail pages)
// are removed before `next build` so `output: "export"` succeeds.
//
// In their place we drop simple "Coming soon" static pages so marketing
// CTAs ("Sign In", "Get Started Free") still resolve.
//
// Run inside the GitHub Actions deploy workflow only. Do NOT run in dev.

import {
  rmSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());

const removals = [
  "src/app/api",
  "src/app/(dashboard)",
  "src/app/(auth)",
  "src/proxy.ts",
  "src/lib/supabase",
  "src/lib/stripe.ts",
  "src/lib/exportZip.ts",
  "src/lib/exportCsv.ts",
  "src/lib/generateReport.ts",
  "src/context",
  "src/components/cases",
  "src/components/evidence",
  "src/components/red-flags",
  "src/components/report",
  "src/components/timeline",
  "src/components/transactions",
  "src/components/layout",
];

for (const rel of removals) {
  const abs = resolve(root, rel);
  if (existsSync(abs)) {
    rmSync(abs, { recursive: true, force: true });
    console.log(`removed ${rel}`);
  }
}

const stubPage = (heading, sub) => `import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: ${JSON.stringify(heading)},
  description: ${JSON.stringify(sub)},
};

export default function Page() {
  return (
    <MarketingShell>
      <section className="px-6 py-32 text-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">${heading}</h1>
          <p className="text-slate-300 mb-8">${sub}</p>
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
`;

const stubs = [
  {
    dir: "src/app/login",
    h: "Sign in is launching soon",
    s: "The Scam Dam case builder isn’t live yet on this preview site. Watch this page — we’ll update it the moment it’s open.",
  },
  {
    dir: "src/app/signup",
    h: "The case builder is on its way",
    s: "We’re finishing the secure cloud version of the case builder. In the meantime, browse the scam library — the patterns, evidence checklists, and reporting channels are all here.",
  },
  {
    dir: "src/app/dashboard",
    h: "Dashboard is launching soon",
    s: "The Scam Dam dashboard isn’t available on this preview site. Until then, the resource library has every red-flag pattern and reporting channel you need.",
  },
];

for (const { dir, h, s } of stubs) {
  const abs = resolve(root, dir);
  mkdirSync(abs, { recursive: true });
  writeFileSync(resolve(abs, "page.tsx"), stubPage(h, s));
  console.log(`stub ${dir}/page.tsx`);
}

// GitHub Pages serves from a subpath and won't run Jekyll on our output.
// `.nojekyll` is needed so files starting with `_` (Next chunks) are served verbatim.
const outDir = resolve(root, "out");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, ".nojekyll"), "");

console.log("Pages prep complete.");
