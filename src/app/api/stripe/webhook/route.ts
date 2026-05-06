import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import type { SubscriptionTier, SubscriptionStatus } from "@/types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProfileUpdate = {
  subscription_tier?: SubscriptionTier;
  subscription_status?: SubscriptionStatus;
  current_period_end?: string | null;
  stripe_customer_id?: string;
  packet_credits?: number;
};

function statusFromStripe(s: Stripe.Subscription.Status): SubscriptionStatus {
  switch (s) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    default:
      return "inactive";
  }
}

function tierFromMetadata(meta: Stripe.Metadata | null): SubscriptionTier | null {
  const t = meta?.tier;
  if (t === "packet" || t === "vault" || t === "pro" || t === "free") return t;
  return null;
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const [{ getStripe }, { createAdminClient }] = await Promise.all([
    import("@/lib/stripe"),
    import("@/lib/supabase/admin"),
  ]);
  const stripe = getStripe();

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bad signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    // Admin client not configured — accept the event so Stripe stops retrying,
    // but surface that nothing was applied.
    return NextResponse.json({ received: true, applied: false });
  }

  const updateProfileByUser = async (userId: string, patch: ProfileUpdate) => {
    if (!userId) return;
    await supabase.from("profiles").update(patch).eq("id", userId);
  };

  const updateProfileByCustomer = async (customerId: string, patch: ProfileUpdate) => {
    if (!customerId) return;
    await supabase.from("profiles").update(patch).eq("stripe_customer_id", customerId);
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId =
          (session.metadata?.supabase_user_id as string | undefined) ??
          (session.client_reference_id as string | undefined) ??
          "";
        const tier = tierFromMetadata(session.metadata);
        const customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;

        if (session.mode === "payment" && tier === "packet") {
          // One-time Packet purchase: increment packet credit, do not change tier.
          if (userId) {
            const { data: existing } = await supabase
              .from("profiles")
              .select("packet_credits")
              .eq("id", userId)
              .maybeSingle<{ packet_credits: number }>();
            const credits = (existing?.packet_credits ?? 0) + 1;
            await updateProfileByUser(userId, {
              packet_credits: credits,
              ...(customerId ? { stripe_customer_id: customerId } : {}),
            });
          }
        } else if (session.mode === "subscription" && tier && tier !== "free") {
          await updateProfileByUser(userId, {
            subscription_tier: tier,
            subscription_status: "active",
            ...(customerId ? { stripe_customer_id: customerId } : {}),
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        const tier = tierFromMetadata(sub.metadata) ?? null;
        // Stripe moved current_period_end onto subscription items; fall back
        // safely if there are no items yet (during creation).
        const periodEndUnix = sub.items?.data?.[0]?.current_period_end ?? null;
        const periodEnd = periodEndUnix
          ? new Date(periodEndUnix * 1000).toISOString()
          : null;
        const patch: ProfileUpdate = {
          subscription_status: statusFromStripe(sub.status),
          current_period_end: periodEnd,
        };
        if (tier && tier !== "free") patch.subscription_tier = tier;
        await updateProfileByCustomer(customerId, patch);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        await updateProfileByCustomer(customerId, {
          subscription_tier: "free",
          subscription_status: "canceled",
          current_period_end: null,
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? "";
        if (customerId) {
          await updateProfileByCustomer(customerId, {
            subscription_status: "past_due",
          });
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true, applied: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
