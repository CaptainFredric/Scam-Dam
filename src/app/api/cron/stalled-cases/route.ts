import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import type { Profile, Case } from "@/types/database";

// Fires once a day on Vercel Cron (see vercel.json). Walks every Vault+
// account that opted into stalled-case reminders, finds their oldest case
// not touched in 14+ days, and sends one email per user per 7 days max.

const STALL_THRESHOLD_DAYS = 14;
const COOLDOWN_DAYS = 7;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://scamdam.app";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorize(request: NextRequest): boolean {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>. Skip the check
  // when CRON_SECRET isn't set so local cURL works in dev.
  const expected = process.env.CRON_SECRET;
  if (!expected) return true;
  const got = request.headers.get("authorization");
  return got === `Bearer ${expected}`;
}

export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Server is missing SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 },
    );
  }

  const cooldownCutoff = new Date(Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString();

  // Vault and Pro tiers, opted-in, not nudged in the cooldown window.
  const { data: profiles, error: profileErr } = await admin
    .from("profiles")
    .select("id, email, subscription_tier, last_stalled_notification_at, notify_stalled_cases")
    .in("subscription_tier", ["vault", "pro"])
    .eq("notify_stalled_cases", true)
    .or(`last_stalled_notification_at.is.null,last_stalled_notification_at.lt.${cooldownCutoff}`);

  if (profileErr) {
    return NextResponse.json({ error: profileErr.message }, { status: 500 });
  }

  const stallCutoff = new Date(Date.now() - STALL_THRESHOLD_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const sent: Array<{ user: string; case: string; email: string }> = [];
  const skipped: Array<{ user: string; reason: string }> = [];

  for (const profile of (profiles ?? []) as Profile[]) {
    if (!profile.email) {
      skipped.push({ user: profile.id, reason: "no email" });
      continue;
    }

    const { data: stalledCases } = await admin
      .from("cases")
      .select("id, title, updated_at, status")
      .eq("user_id", profile.id)
      .eq("status", "active")
      .lt("updated_at", stallCutoff)
      .order("updated_at", { ascending: true })
      .limit(1);

    const stalled = (stalledCases ?? []) as Pick<Case, "id" | "title" | "updated_at" | "status">[];
    if (stalled.length === 0) {
      skipped.push({ user: profile.id, reason: "no stalled cases" });
      continue;
    }

    const stale = stalled[0];
    const daysSince = Math.floor(
      (Date.now() - new Date(stale.updated_at).getTime()) / (24 * 60 * 60 * 1000),
    );
    const caseUrl = `${SITE_URL}/cases/${stale.id}/timeline`;
    const result = await sendEmail({
      to: profile.email,
      subject: `Your "${stale.title}" case has gone quiet`,
      text:
        `Hi,\n\nYour case "${stale.title}" hasn't been updated in ${daysSince} days.\n\n` +
        `If something new came up — a refund, a fresh contact, a bank reply — log it now while it's fresh:\n${caseUrl}\n\n` +
        `If the case is wrapped up, mark it as Reported or Resolved on the dashboard so we stop nudging you.\n\n` +
        `You're receiving this because you have stalled-case reminders on. Turn them off any time at ${SITE_URL}/account.\n\n` +
        `— Scam Dam`,
      html:
        `<div style="font-family:system-ui,sans-serif;color:#1f2937;max-width:520px">` +
        `<p>Hi,</p>` +
        `<p>Your case <strong>${escapeHtml(stale.title)}</strong> hasn't been updated in <strong>${daysSince} days</strong>.</p>` +
        `<p>If something new came up — a refund, a fresh contact, a bank reply — log it now while it's fresh.</p>` +
        `<p><a href="${caseUrl}" style="background:#dc2626;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;display:inline-block">Open the case</a></p>` +
        `<p>If the case is wrapped up, mark it as Reported or Resolved so we stop nudging you.</p>` +
        `<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">` +
        `<p style="color:#6b7280;font-size:12px">You're receiving this because you have stalled-case reminders on. ` +
        `<a href="${SITE_URL}/account" style="color:#dc2626">Turn them off</a> any time.</p>` +
        `</div>`,
    });

    if (result.ok) {
      await admin
        .from("profiles")
        .update({ last_stalled_notification_at: new Date().toISOString() })
        .eq("id", profile.id);
      sent.push({ user: profile.id, case: stale.id, email: profile.email });
    } else {
      skipped.push({ user: profile.id, reason: result.error ?? "send failed" });
    }
  }

  return NextResponse.json({
    ran_at: new Date().toISOString(),
    candidates: profiles?.length ?? 0,
    sent: sent.length,
    skipped: skipped.length,
    details: { sent, skipped },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
