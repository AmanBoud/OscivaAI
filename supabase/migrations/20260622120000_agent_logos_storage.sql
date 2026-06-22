-- Storage bucket for agent header logos that owners upload from the Appearance tab.
-- Public READ (the widget header + chat config need a publicly reachable URL),
-- but WRITE/UPDATE/DELETE are restricted to the owner's own folder (`<uid>/...`)
-- so owners can't touch each other's files. The Appearance tab uploads here and
-- drops the resulting public URL into agents.logo_url (existing column).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'agent-logos',
  'agent-logos',
  true,
  2097152, -- 2 MB cap
  ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Anyone can read (bucket is public; this policy makes the intent explicit).
DROP POLICY IF EXISTS "Agent logos are publicly readable" ON storage.objects;
CREATE POLICY "Agent logos are publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'agent-logos');

-- Authenticated users may upload only into their own top-level folder (`<uid>/...`).
DROP POLICY IF EXISTS "Users upload own agent logos" ON storage.objects;
CREATE POLICY "Users upload own agent logos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'agent-logos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users update own agent logos" ON storage.objects;
CREATE POLICY "Users update own agent logos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'agent-logos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users delete own agent logos" ON storage.objects;
CREATE POLICY "Users delete own agent logos" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'agent-logos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
