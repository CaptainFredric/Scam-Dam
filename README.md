# Scam Dam

> Organize your scam evidence. Fight back.

A web application that helps scam victims, families helping older relatives, legal-aid groups, and consumer-protection clinics build a clean, structured evidence packet for reporting to IC3, FTC, police, banks, crypto exchanges, and state consumer-protection agencies.

## Features

- **Timeline Builder** – Log every interaction chronologically: first contact, deposits, withdrawal blocks, new recharge demands.
- **Transaction Ledger** – Record every payment with date, amount, platform, wallet address, exchange name, and notes.
- **Evidence Vault** – Upload screenshots, PDFs, chat logs, and emails. Categorized and indexed automatically.
- **Red Flag Classifier** – Identify warning signs across task scams, crypto investment fraud, fake job scams, and romance scams.
- **Report Generator** – One-click professional PDF report formatted for IC3, FTC, police, and financial institutions.
- **Multi-format Export** – PDF report, CSV transaction log, or ZIP bundle containing all evidence.

## Scam Types Supported

| Type | Description |
|---|---|
| Task Scams | Fake review/app-rating jobs that demand upfront crypto "fees" |
| Crypto Investment | Pig butchering and fake trading platforms |
| Fake Job Offers | Equipment purchases, training fees, check overpayments |
| Romance Scams | Long-term manipulation leading to crypto gifts or wire transfers |

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database / Auth / Storage**: Supabase
- **Payments**: Stripe
- **PDF Generation**: jsPDF + jspdf-autotable
- **ZIP Export**: JSZip

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase and Stripe credentials.

### 3. Set up the database

Run `supabase/schema.sql` in your Supabase SQL editor to create all tables with Row Level Security policies.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Demo mode**: The app works fully without Supabase configured. All data is stored in `localStorage` so you can explore every feature immediately.

## Deployments

Two targets, two purposes:

- **Marketing site → GitHub Pages.** Pushed automatically via `.github/workflows/deploy-pages.yml` on every push to `main`. Builds a static export of the public pages only (landing, pricing, about, contact, FAQ, resources, security, privacy, terms, sitemap, robots) and publishes to `https://captainfredric.github.io/Scam-Dam`. The dashboard, dynamic case routes, Stripe API routes, and Supabase auth are stripped before build by `scripts/prepare-pages.mjs` (Pages can't run server code), and `/login`, `/signup`, `/dashboard` become "Coming soon" stubs. Paid CTAs link to `/signup` instead of hitting the (nonexistent) checkout API.
- **Full app → Vercel** (or any Node host). Push to a Vercel project; everything works as-is, including dynamic routes, Stripe webhooks, and Supabase. See `.env.example` for required env vars (Supabase URL/anon/service-role keys, Stripe secret/publishable/webhook secrets, and one Stripe Price ID per paid tier).

### Stripe setup

1. Run `supabase/schema.sql` then `supabase/migrations/0002_profiles_subscriptions.sql` in your Supabase SQL editor.
2. In Stripe → Products, create three products with one recurring/one-time price each: Evidence Packet (one-time), Vault (monthly recurring), Professional (monthly recurring per seat). Copy the `price_xxx` IDs into `STRIPE_PRICE_PACKET`, `STRIPE_PRICE_VAULT`, `STRIPE_PRICE_PRO`.
3. Stripe → Webhooks → add endpoint `https://your-domain/api/stripe/webhook` listening for `checkout.session.completed`, `customer.subscription.{created,updated,deleted}`, `invoice.payment_failed`. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
4. Stripe → Customer portal → enable; the `/api/stripe/portal` route uses it for self-service cancellation and invoices.
5. Optional: enable Promotion Codes in Stripe to use the `allow_promotion_codes` field already wired into checkout.

To enable Pages: in the GitHub repo, **Settings → Pages → Build and deployment → Source: GitHub Actions**, then push to `main` (or trigger the workflow manually).

## Pricing

| Tier | Price | Description |
|---|---|---|
| Free | $0 | Unlimited cases, timeline, transactions, evidence vault |
| Evidence Packet | $9–$29 one-time | PDF report, CSV export, ZIP bundle |
| Evidence Vault | $10/month | Cloud storage for evidence files |
| Professional | $99–$299/month | For nonprofits, clinics, and law offices |

## Legal Disclaimer

⚠️ Scam Dam is an evidence organization tool only. It does not provide legal advice, guarantee recovery of funds, or guarantee any outcome from reporting. Always consult a licensed attorney for legal matters.

**Do not use recovery services** — many services claiming to recover scam losses are themselves scams.

## Reporting Resources

- [FBI IC3](https://www.ic3.gov) – Internet Crime Complaint Center
- [FTC Report Fraud](https://reportfraud.ftc.gov) – Federal Trade Commission
- [CFPB Complaint](https://www.consumerfinance.gov/complaint/) – Consumer Financial Protection Bureau
