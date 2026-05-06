import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { meetsTier } from "@/lib/plans";
import type { SubscriptionTier, CaseShare } from "@/types/database";

// Sharing is a Vault-tier feature. Free users see the upsell modal in
// ShareModal before they ever hit this route, but enforce again server-side.
const REQUIRED_TIER: SubscriptionTier = "vault";

async function requireOwner(
  supabase: Awaited<ReturnType<typeof createClient>>,
  caseId: string,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id, user_id")
    .eq("id", caseId)
    .maybeSingle<{ id: string; user_id: string }>();
  if (!caseRow || caseRow.user_id !== user.id) {
    return { error: NextResponse.json({ error: "Case not found" }, { status: 404 }) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .maybeSingle<{ subscription_tier: SubscriptionTier }>();
  const tier = profile?.subscription_tier ?? "free";
  if (!meetsTier(tier, REQUIRED_TIER)) {
    return {
      error: NextResponse.json(
        { error: `Sharing requires the ${REQUIRED_TIER} plan or higher.`, tier },
        { status: 402 },
      ),
    };
  }
  return { user, caseRow };
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: caseId } = await context.params;
  const supabase = await createClient();
  const ok = await requireOwner(supabase, caseId);
  if ("error" in ok) return ok.error;

  const { data, error } = await supabase
    .from("case_shares")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ shares: (data ?? []) as CaseShare[] });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: caseId } = await context.params;
  const supabase = await createClient();
  const ok = await requireOwner(supabase, caseId);
  if ("error" in ok) return ok.error;

  type Body = { expiresInDays?: number; note?: string };
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    /* empty body is fine */
  }

  // Cap expiry at 90 days; clamp negative/zero to "never expires".
  const days =
    typeof body.expiresInDays === "number" && body.expiresInDays > 0
      ? Math.min(Math.floor(body.expiresInDays), 90)
      : null;
  const expires_at = days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString() : null;

  const { data, error } = await supabase
    .from("case_shares")
    .insert({
      case_id: caseId,
      created_by: ok.user.id,
      expires_at,
      note: body.note?.slice(0, 280) ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ share: data as CaseShare }, { status: 201 });
}
