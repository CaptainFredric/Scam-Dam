-- Adds Pro-tier report branding (logo, org name, brand color, footer line)
-- and per-user notification preferences. Run after 0003 in the Supabase
-- SQL editor.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS org_name TEXT,
  ADD COLUMN IF NOT EXISTS brand_logo_path TEXT,
  ADD COLUMN IF NOT EXISTS brand_color TEXT,
  ADD COLUMN IF NOT EXISTS brand_footer TEXT,
  ADD COLUMN IF NOT EXISTS notify_stalled_cases BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notify_marketing BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_stalled_notification_at TIMESTAMPTZ;

-- Brand assets bucket. Public bucket OK because logos are intentionally
-- shared on exported PDFs anyway.
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand_assets', 'brand_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: users can only manage objects under their own user-id prefix.
CREATE POLICY "Users can upload their brand assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'brand_assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view brand assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'brand_assets');

CREATE POLICY "Users can update their brand assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'brand_assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their brand assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'brand_assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
