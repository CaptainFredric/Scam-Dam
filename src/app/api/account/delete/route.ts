import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GDPR / CCPA "right to deletion". Cancels any active Stripe subscription,
// purges Storage objects under the user's prefix, then deletes the auth
// user row — cascading FKs in supabase/schema.sql clean up profiles,
// cases, timeline, transactions, evidence rows.
export async function POST(_request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Account deletion requires server configuration. Contact support." },
      { status: 503 },
    );
  }

  // Best-effort Stripe cancellation. We don't fail the deletion if Stripe
  // is misconfigured — the user wants out, and Stripe billing is independent
  // of identity once the customer record is preserved in their dashboard.
  try {
    if (process.env.STRIPE_SECRET_KEY) {
      const { data: profile } = await admin
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", user.id)
        .maybeSingle<{ stripe_customer_id: string | null }>();
      if (profile?.stripe_customer_id) {
        const { getStripe } = await import("@/lib/stripe");
        const stripe = getStripe();
        const subs = await stripe.subscriptions.list({
          customer: profile.stripe_customer_id,
          status: "all",
          limit: 100,
        });
        await Promise.all(
          subs.data
            .filter((s) => s.status !== "canceled" && s.status !== "incomplete_expired")
            .map((s) => stripe.subscriptions.cancel(s.id)),
        );
      }
    }
  } catch (err) {
    console.error("Stripe cancellation during account delete failed:", err);
  }

  // Storage cleanup: list objects under <user_id>/ and remove them.
  try {
    const { data: objects } = await admin.storage
      .from("evidence")
      .list(user.id, { limit: 1000 });
    if (objects && objects.length > 0) {
      // List is shallow; we need to recurse one level for /case_id/file.
      const { data: subdirs } = await admin.storage
        .from("evidence")
        .list(user.id, { limit: 1000 });
      const toRemove: string[] = [];
      for (const entry of subdirs ?? []) {
        const { data: files } = await admin.storage
          .from("evidence")
          .list(`${user.id}/${entry.name}`, { limit: 1000 });
        for (const f of files ?? []) {
          toRemove.push(`${user.id}/${entry.name}/${f.name}`);
        }
      }
      if (toRemove.length > 0) {
        await admin.storage.from("evidence").remove(toRemove);
      }
    }
  } catch (err) {
    console.error("Storage cleanup during account delete failed:", err);
  }

  const { error: deleteErr } = await admin.auth.admin.deleteUser(user.id);
  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 });
  }

  // Sign out the current session locally so the cookie is cleared.
  await supabase.auth.signOut();

  return NextResponse.json({ deleted: true });
}
