export interface Case {
  id: string;
  user_id: string;
  title: string;
  scam_type: "task_scam" | "crypto_investment" | "fake_job" | "romance_scam" | "other";
  status: "active" | "reported" | "resolved";
  description: string | null;
  total_lost: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface TimelineEntry {
  id: string;
  case_id: string;
  event_type:
    | "first_contact"
    | "deposit"
    | "withdrawal_blocked"
    | "recharge_demanded"
    | "reported"
    | "other";
  event_date: string;
  description: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  case_id: string;
  date: string;
  amount: number;
  currency: string;
  platform: string;
  wallet_address: string | null;
  exchange: string | null;
  screenshot_url: string | null;
  notes: string | null;
  transaction_type: "deposit" | "withdrawal" | "fee" | "other";
  created_at: string;
}

export interface Evidence {
  id: string;
  case_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  url: string | null;
  description: string | null;
  category: "screenshot" | "document" | "chat_log" | "email" | "other";
  created_at: string;
}

export interface RedFlag {
  id: string;
  label: string;
  description: string;
  scam_types: string[];
}

export type SubscriptionTier = "free" | "packet" | "vault" | "pro";

export type SubscriptionStatus =
  | "inactive"
  | "active"
  | "past_due"
  | "canceled"
  | "trialing";

export interface CaseShare {
  id: string;
  case_id: string;
  created_by: string;
  expires_at: string | null;
  revoked_at: string | null;
  view_count: number;
  last_viewed_at: string | null;
  note: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  stripe_customer_id: string | null;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  current_period_end: string | null;
  packet_credits: number;
  org_name: string | null;
  brand_logo_path: string | null;
  brand_color: string | null;
  brand_footer: string | null;
  notify_stalled_cases: boolean;
  notify_marketing: boolean;
  last_stalled_notification_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Branding {
  org_name: string | null;
  brand_logo_url: string | null;
  brand_color: string | null;
  brand_footer: string | null;
}
