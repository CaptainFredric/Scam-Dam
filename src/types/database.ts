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

export interface Profile {
  id: string;
  email: string | null;
  stripe_customer_id: string | null;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  current_period_end: string | null;
  packet_credits: number;
  created_at: string;
  updated_at: string;
}
