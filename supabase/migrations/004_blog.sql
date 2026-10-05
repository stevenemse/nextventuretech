-- ============================================================
-- NextVenture Tech — Migration 004 : Module Blog
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT,                        -- Résumé pour les cartes et meta description
  content         TEXT,                        -- Corps de l'article (Markdown ou HTML)
  cover_image_url TEXT,
  author          TEXT NOT NULL DEFAULT 'NextVenture Tech',
  category        TEXT,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  is_published    BOOLEAN NOT NULL DEFAULT false,
  published_at    TIMESTAMPTZ,                 -- Null tant que brouillon
  seo_title       TEXT,                        -- Titre SEO override (optionnel)
  seo_description TEXT,                        -- Meta description override
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_blog_slug        ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published   ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_category    ON blog_posts(category);

-- Trigger updated_at
DROP TRIGGER IF EXISTS trg_blog_updated_at ON blog_posts;
CREATE TRIGGER trg_blog_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── RLS ────────────────────────────────────────────────────
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Lecture publique des articles publiés uniquement
DROP POLICY IF EXISTS "blog_public_select"  ON blog_posts;
DROP POLICY IF EXISTS "blog_admin_select"   ON blog_posts;
DROP POLICY IF EXISTS "blog_admin_insert"   ON blog_posts;
DROP POLICY IF EXISTS "blog_admin_update"   ON blog_posts;
DROP POLICY IF EXISTS "blog_admin_delete"   ON blog_posts;

CREATE POLICY "blog_public_select"
  ON blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "blog_admin_select"
  ON blog_posts FOR SELECT
  USING (is_admin());

CREATE POLICY "blog_admin_insert"
  ON blog_posts FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "blog_admin_update"
  ON blog_posts FOR UPDATE
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "blog_admin_delete"
  ON blog_posts FOR DELETE
  USING (is_admin());
