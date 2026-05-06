import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountSettings from "@/components/account/AccountSettings";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, subscription_status, current_period_end")
    .eq("id", user.id)
    .maybeSingle<{
      subscription_tier: string;
      subscription_status: string;
      current_period_end: string | null;
    }>();

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Account</h1>
      <p className="text-slate-400 text-sm mb-8">
        Manage your password, export your data, or delete your account.
      </p>
      <AccountSettings
        email={user.email ?? ""}
        createdAt={user.created_at}
        emailConfirmedAt={user.email_confirmed_at ?? null}
        tier={profile?.subscription_tier ?? "free"}
      />
    </div>
  );
}
