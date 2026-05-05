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
