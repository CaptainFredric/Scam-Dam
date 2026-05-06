import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GDPR / CCPA "right to access". Returns a JSON dump of every row this
// user owns plus signed URLs for any evidence files.
export async function GET(_request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const [profileRes, casesRes, timelineRes, transactionsRes, evidenceRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("cases").select("*").eq("user_id", user.id),
    supabase
      .from("timeline_entries")
      .select("*, cases!inner(user_id)")
      .eq("cases.user_id", user.id),
    supabase
      .from("transactions")
      .select("*, cases!inner(user_id)")
      .eq("cases.user_id", user.id),
    supabase
      .from("evidence")
      .select("*, cases!inner(user_id)")
      .eq("cases.user_id", user.id),
  ]);

  // Mint signed URLs (1-hour expiry) so the export is downloadable.
  const evidenceRows = (evidenceRes.data ?? []) as { storage_path: string }[];
  const evidenceWithUrls = await Promise.all(
    evidenceRows.map(async (ev) => {
      if (!ev.storage_path) return ev;
      const { data } = await supabase.storage
        .from("evidence")
        .createSignedUrl(ev.storage_path, 60 * 60);
      return { ...ev, signed_url: data?.signedUrl ?? null };
    }),
  );

  const payload = {
    exported_at: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
    profile: profileRes.data,
    cases: casesRes.data ?? [],
    timeline_entries: timelineRes.data ?? [],
    transactions: transactionsRes.data ?? [],
    evidence: evidenceWithUrls,
    notes:
      "Signed URLs above expire in 1 hour. Download files you need before then; you can re-export at any time.",
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "content-disposition": `attachment; filename="scam-dam-export-${user.id}.json"`,
    },
  });
}
