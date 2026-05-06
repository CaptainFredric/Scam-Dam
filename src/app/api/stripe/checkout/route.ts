import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PLANS } from "@/lib/plans";
import type { SubscriptionTier } from "@/types/database";

type Body = {
  tier: Exclude<SubscriptionTier, "free">;
  successPath?: string;
  cancelPath?: string;
};

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const plan = body.tier && PLANS[body.tier];
  if (!plan) {
    return NextResponse.json({ error: "Unknown tier" }, { status: 400 });
  }
  if (!plan.priceId) {
    return NextResponse.json(
      { error: `Missing ${plan.envVar} env var for ${plan.label}` },
      { status: 503 },
    );
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";
  const successUrl = `${origin}${body.successPath ?? "/billing?status=success"}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}${body.cancelPath ?? "/pricing?status=canceled"}`;

  try {
    const [{ getStripe }, { createClient }] = await Promise.all([
      import("@/lib/stripe"),
      import("@/lib/supabase/server"),
    ]);
    const stripe = getStripe();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let customerId: string | undefined;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", user.id)
        .maybeSingle<{ stripe_customer_id: string | null }>();
      customerId = profile?.stripe_customer_id ?? undefined;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email ?? undefined,
          metadata: { supabase_user_id: user.id },
        });
        customerId = customer.id;
        // Best-effort save; webhook will reconcile if this fails.
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id);
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: plan.kind === "one_time" ? "payment" : "subscription",
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: successUrl.includes("?")
        ? successUrl
        : `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer: customerId,
      client_reference_id: user?.id ?? undefined,
      metadata: {
        tier: plan.tier,
        supabase_user_id: user?.id ?? "",
      },
      ...(plan.kind === "subscription"
        ? {
            subscription_data: {
              metadata: {
                tier: plan.tier,
                supabase_user_id: user?.id ?? "",
              },
            },
          }
        : {}),
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
