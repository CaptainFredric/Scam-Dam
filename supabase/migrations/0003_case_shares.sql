-- Read-only share links for cases. The id IS the public token, so issuing
-- a new share == inserting a row, and revoking == flipping revoked_at or
-- deleting. The /shared/[token] viewer reads via the service-role client
-- which bypasses RLS — so the public never gets direct PostgREST access.
-- Run after 0002 in your Supabase SQL editor.

CREATE TABLE IF NOT EXISTS case_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  view_count INT NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS case_shares_case_idx ON case_shares(case_id);
CREATE INDEX IF NOT EXISTS case_shares_active_idx ON case_shares(case_id) WHERE revoked_at IS NULL;

ALTER TABLE case_shares ENABLE ROW LEVEL SECURITY;

-- Owner-only read/write. Public access goes through the service-role
-- client server-side, never directly through PostgREST.
CREATE POLICY "Case owner can view their shares"
  ON case_shares FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cases WHERE cases.id = case_shares.case_id AND cases.user_id = auth.uid()
    )
  );

CREATE POLICY "Case owner can create shares"
  ON case_shares FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM cases WHERE cases.id = case_shares.case_id AND cases.user_id = auth.uid()
    )
  );

CREATE POLICY "Case owner can revoke their shares"
  ON case_shares FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM cases WHERE cases.id = case_shares.case_id AND cases.user_id = auth.uid()
    )
  );

CREATE POLICY "Case owner can delete their shares"
  ON case_shares FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM cases WHERE cases.id = case_shares.case_id AND cases.user_id = auth.uid()
    )
  );
