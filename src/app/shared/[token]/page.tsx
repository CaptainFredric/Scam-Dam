import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Calendar, Wallet, FileWarning, Lock, AlertTriangle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Case,
  CaseShare,
  TimelineEntry,
  Transaction,
  Evidence,
} from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shared Case",
  description: "A read-only view of a Scam Dam case shared by its owner.",
  robots: { index: false, follow: false },
};

const scamTypeLabels: Record<Case["scam_type"], string> = {
  task_scam: "Task Scam",
  crypto_investment: "Crypto Investment",
  fake_job: "Fake Job",
  romance_scam: "Romance Scam",
  other: "Other",
};

const eventTypeLabels: Record<TimelineEntry["event_type"], string> = {
  first_contact: "First contact",
  deposit: "Deposit",
  withdrawal_blocked: "Withdrawal blocked",
  recharge_demanded: "Recharge demanded",
  reported: "Reported",
  other: "Other",
};

type LoadResult =
  | { kind: "ok"; share: CaseShare; caseData: Case; timeline: TimelineEntry[]; transactions: Transaction[]; evidence: Evidence[] }
  | { kind: "missing" }
  | { kind: "expired" }
  | { kind: "revoked" }
  | { kind: "unconfigured" };

async function load(token: string): Promise<LoadResult> {
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { kind: "unconfigured" };
  }

  const { data: shareRow } = await admin
    .from("case_shares")
    .select("*")
    .eq("id", token)
    .maybeSingle<CaseShare>();
  if (!shareRow) return { kind: "missing" };
  if (shareRow.revoked_at) return { kind: "revoked" };
  if (shareRow.expires_at && new Date(shareRow.expires_at).getTime() < Date.now()) {
    return { kind: "expired" };
  }

  const [{ data: caseData }, { data: timeline }, { data: transactions }, { data: evidence }] = await Promise.all([
    admin.from("cases").select("*").eq("id", shareRow.case_id).maybeSingle<Case>(),
    admin
      .from("timeline_entries")
      .select("*")
      .eq("case_id", shareRow.case_id)
      .order("event_date", { ascending: true }),
    admin
      .from("transactions")
      .select("*")
      .eq("case_id", shareRow.case_id)
      .order("date", { ascending: true }),
    admin
      .from("evidence")
      .select("*")
      .eq("case_id", shareRow.case_id)
      .order("created_at", { ascending: false }),
  ]);
  if (!caseData) return { kind: "missing" };

  // Mint short-lived signed URLs so the public viewer can render images
  // and offer downloads, without making the storage bucket public.
  const evidenceWithUrls = await Promise.all(
    ((evidence ?? []) as Evidence[]).map(async (ev) => {
      if (!ev.storage_path) return ev;
      const { data } = await admin.storage
        .from("evidence")
        .createSignedUrl(ev.storage_path, 60 * 60);
      return { ...ev, url: data?.signedUrl ?? ev.url };
    }),
  );

  // Fire-and-forget telemetry: bump view_count + last_viewed_at.
  void admin
    .from("case_shares")
    .update({
      view_count: shareRow.view_count + 1,
      last_viewed_at: new Date().toISOString(),
    })
    .eq("id", token);

  return {
    kind: "ok",
    share: shareRow,
    caseData,
    timeline: (timeline ?? []) as TimelineEntry[],
    transactions: (transactions ?? []) as Transaction[],
    evidence: evidenceWithUrls,
  };
}

export default async function SharedCasePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await load(token);

  if (result.kind !== "ok") {
    return <SharedError kind={result.kind} />;
  }

  const { share, caseData, timeline, transactions, evidence } = result;
  const total = transactions.reduce((sum, t) => sum + Number(t.amount ?? 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
      </div>

      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            <span className="font-bold tracking-tight">Scam Dam</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Lock className="h-3.5 w-3.5" />
            Read-only shared case
          </span>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <span className="inline-block bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-xs text-slate-300 mb-3">
            {scamTypeLabels[caseData.scam_type]}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {caseData.title}
          </h1>
          {caseData.description && (
            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
              {caseData.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Stat
            label="Documented loss"
            value={formatCurrency(caseData.total_lost ?? 0, caseData.currency)}
            accent
          />
          <Stat label="Timeline entries" value={timeline.length.toString()} />
          <Stat
            label="Tracked outflows"
            value={formatCurrency(total, caseData.currency)}
          />
        </div>

        <Section title="Timeline" icon={<Calendar className="h-5 w-5 text-red-500" />}>
          {timeline.length === 0 ? (
            <p className="text-slate-500 text-sm">No timeline entries.</p>
          ) : (
            <ol className="border-l-2 border-slate-800 ml-2 space-y-5">
              {timeline.map((t) => (
                <li key={t.id} className="pl-5 relative">
                  <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-red-500 ring-4 ring-slate-950" />
                  <div className="text-xs text-slate-500">{formatDate(t.event_date)}</div>
                  <div className="text-sm font-semibold text-white">
                    {eventTypeLabels[t.event_type]}
                  </div>
                  <p className="text-slate-300 text-sm mt-0.5 whitespace-pre-wrap">
                    {t.description}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </Section>

        <Section title="Transactions" icon={<Wallet className="h-5 w-5 text-red-500" />}>
          {transactions.length === 0 ? (
            <p className="text-slate-500 text-sm">No transactions logged.</p>
          ) : (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-800">
                    <th className="px-2 py-2">Date</th>
                    <th className="px-2 py-2">Type</th>
                    <th className="px-2 py-2">Platform</th>
                    <th className="px-2 py-2">Amount</th>
                    <th className="px-2 py-2 hidden sm:table-cell">Wallet / Exchange</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-slate-800/60">
                      <td className="px-2 py-2 text-slate-300">{formatDate(t.date)}</td>
                      <td className="px-2 py-2 text-slate-300 capitalize">{t.transaction_type}</td>
                      <td className="px-2 py-2 text-slate-300">{t.platform}</td>
                      <td className="px-2 py-2 text-white font-medium">
                        {formatCurrency(Number(t.amount), t.currency)}
                      </td>
                      <td className="px-2 py-2 text-slate-400 hidden sm:table-cell">
                        {[t.exchange, t.wallet_address].filter(Boolean).join(" · ") || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        <Section title="Evidence" icon={<FileWarning className="h-5 w-5 text-red-500" />}>
          {evidence.length === 0 ? (
            <p className="text-slate-500 text-sm">No evidence uploaded.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {evidence.map((ev) => (
                <a
                  key={ev.id}
                  href={ev.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-slate-600 transition-colors"
                >
                  {ev.url && ev.file_type?.startsWith("image/") ? (
                    // Public viewer; signed URL expires in 1 hour.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ev.url}
                      alt={ev.file_name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="h-32 rounded bg-slate-800 grid place-items-center mb-2">
                      <FileWarning className="h-8 w-8 text-slate-500" />
                    </div>
                  )}
                  <div className="text-xs uppercase tracking-wider text-slate-500 mb-0.5">
                    {ev.category.replace("_", " ")}
                  </div>
                  <div className="text-sm font-medium text-white truncate">{ev.file_name}</div>
                  {ev.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ev.description}</p>
                  )}
                </a>
              ))}
            </div>
          )}
        </Section>

        {share.note && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-10">
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">
              Note from the case owner
            </div>
            <p className="text-slate-200 text-sm whitespace-pre-wrap">{share.note}</p>
          </div>
        )}

        <div className="border-t border-slate-800 pt-6 mt-10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-slate-500">
          <span>
            Shared {formatDate(share.created_at)}
            {share.expires_at ? ` · expires ${formatDate(share.expires_at)}` : " · no expiry"}
          </span>
          <span>
            Generated with{" "}
            <Link href="/" className="text-red-400 hover:text-red-300">
              Scam Dam
            </Link>
          </span>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-5 py-4">
      <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${accent ? "text-red-400" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function SharedError({ kind }: { kind: "missing" | "expired" | "revoked" | "unconfigured" }) {
  const message =
    kind === "missing"
      ? "This share link doesn't exist or was deleted by the case owner."
      : kind === "expired"
        ? "This share link has expired. Ask the case owner for a fresh one."
        : kind === "revoked"
          ? "The case owner revoked this share link."
          : "Sharing isn't configured on this deployment yet.";

  return (
    <div className="min-h-screen bg-slate-950 text-white grid place-items-center px-6">
      <div className="max-w-md text-center">
        <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Link unavailable</h1>
        <p className="text-slate-400 text-sm mb-6">{message}</p>
        <Link
          href="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm font-medium"
        >
          Back to Scam Dam
        </Link>
      </div>
    </div>
  );
}
