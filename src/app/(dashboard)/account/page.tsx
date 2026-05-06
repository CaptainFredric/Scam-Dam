import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountSettings from "@/components/account/AccountSettings";
import BrandingCard from "@/components/account/BrandingCard";
import NotificationsCard from "@/components/account/NotificationsCard";
import type { Branding, SubscriptionTier } from "@/types/database";
import { meetsTier } from "@/lib/plans";

export const dynamic = "force-dynamic";

const BUCKET = "brand_assets";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "subscription_tier, subscription_status, current_period_end, org_name, brand_logo_path, brand_color, brand_footer, notify_stalled_cases, notify_marketing",
    )
    .eq("id", user.id)
    .maybeSingle<{
      subscription_tier: SubscriptionTier;
      subscription_status: string;
      current_period_end: string | null;
      org_name: string | null;
      brand_logo_path: string | null;
      brand_color: string | null;
      brand_footer: string | null;
      notify_stalled_cases: boolean;
      notify_marketing: boolean;
    }>();

  const tier = profile?.subscription_tier ?? "free";
  const isPro = meetsTier(tier, "pro");

  let initialBranding: Branding | null = null;
  if (isPro) {
    const { data: logo } = profile?.brand_logo_path
      ? supabase.storage.from(BUCKET).getPublicUrl(profile.brand_logo_path)
      : { data: null };
    initialBranding = {
      org_name: profile?.org_name ?? null,
      brand_logo_url: logo?.publicUrl ?? null,
      brand_color: profile?.brand_color ?? null,
      brand_footer: profile?.brand_footer ?? null,
    };
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Account</h1>
      <p className="text-slate-400 text-sm mb-8">
        Manage your password, branding, notifications, exports, and account.
      </p>
      <div className="space-y-6">
        <NotificationsCard
          initialStalled={profile?.notify_stalled_cases ?? true}
          initialMarketing={profile?.notify_marketing ?? false}
        />
        {isPro && initialBranding && <BrandingCard initial={initialBranding} />}
        <AccountSettings
          email={user.email ?? ""}
          createdAt={user.created_at}
          emailConfirmedAt={user.email_confirmed_at ?? null}
          tier={tier}
        />
      </div>
    </div>
  );
}
