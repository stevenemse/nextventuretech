-- ============================================================
-- NextVenture Tech — Migration 003 : Supabase Storage
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- Crée le bucket 'images' + policies d'accès
-- ============================================================

-- Créer le bucket public 'images'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Lecture publique (images affichées sur le site)
DROP POLICY IF EXISTS "images_public_read" ON storage.objects;
CREATE POLICY "images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Upload réservé aux admins
DROP POLICY IF EXISTS "images_admin_insert" ON storage.objects;
CREATE POLICY "images_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images' AND is_admin());

-- Suppression réservée aux admins
DROP POLICY IF EXISTS "images_admin_delete" ON storage.objects;
CREATE POLICY "images_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images' AND is_admin());

-- Remplacement réservé aux admins
DROP POLICY IF EXISTS "images_admin_update" ON storage.objects;
CREATE POLICY "images_admin_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'images' AND is_admin());
