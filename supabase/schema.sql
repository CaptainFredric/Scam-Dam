-- Scam Dam Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  scam_type TEXT NOT NULL CHECK (scam_type IN ('task_scam', 'crypto_investment', 'fake_job', 'romance_scam', 'other')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reported', 'resolved')),
  description TEXT,
  total_lost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Timeline entries table
CREATE TABLE IF NOT EXISTS timeline_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('first_contact', 'deposit', 'withdrawal_blocked', 'recharge_demanded', 'reported', 'other')),
  event_date DATE NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount NUMERIC(18, 8) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  platform TEXT NOT NULL,
  wallet_address TEXT,
  exchange TEXT,
  screenshot_url TEXT,
  notes TEXT,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'fee', 'other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Evidence table
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('screenshot', 'document', 'chat_log', 'email', 'other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

-- Cases RLS policies
CREATE POLICY "Users can view their own cases"
  ON cases FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cases"
  ON cases FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cases"
  ON cases FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cases"
  ON cases FOR DELETE USING (auth.uid() = user_id);

-- Timeline RLS policies
CREATE POLICY "Users can view timeline entries for their cases"
  ON timeline_entries FOR SELECT
  USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can insert timeline entries for their cases"
  ON timeline_entries FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can delete timeline entries for their cases"
  ON timeline_entries FOR DELETE
  USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_id AND cases.user_id = auth.uid()));

-- Transactions RLS policies
CREATE POLICY "Users can view transactions for their cases"
  ON transactions FOR SELECT
  USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can insert transactions for their cases"
  ON transactions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can delete transactions for their cases"
  ON transactions FOR DELETE
  USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_id AND cases.user_id = auth.uid()));

-- Evidence RLS policies
CREATE POLICY "Users can view evidence for their cases"
  ON evidence FOR SELECT
  USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can insert evidence for their cases"
  ON evidence FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_id AND cases.user_id = auth.uid()));

CREATE POLICY "Users can delete evidence for their cases"
  ON evidence FOR DELETE
  USING (EXISTS (SELECT 1 FROM cases WHERE cases.id = case_id AND cases.user_id = auth.uid()));

-- Storage bucket for evidence files
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence', 'evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Users can upload evidence"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their evidence"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their evidence"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
