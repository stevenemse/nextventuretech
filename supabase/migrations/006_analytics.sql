-- ============================================================
-- NextVenture Tech — Migration 006 : Analytics first-party
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- Mesure sans cookie : aucune IP brute n'est stockée, seulement
-- une empreinte hachée (IP + user-agent + jour) tronquée.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.page_views (
  id           BIGSERIAL PRIMARY KEY,
  path         TEXT NOT NULL,
  referrer     TEXT,
  device       TEXT CHECK (device IN ('mobile', 'tablet', 'desktop')),
  lang         TEXT,
  visitor_hash TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_views_created ON public.page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path    ON public.page_views (path);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Lecture réservée aux administrateurs (dashboard)
DROP POLICY IF EXISTS "analytics_admin_select" ON public.page_views;
CREATE POLICY "analytics_admin_select"
  ON public.page_views FOR SELECT
  USING (public.is_admin());

-- Écriture depuis le beacon public (même modèle que work_requests).
-- La route /api/analytics valide le chemin et limite le débit par IP.
DROP POLICY IF EXISTS "analytics_public_insert" ON public.page_views;
CREATE POLICY "analytics_public_insert"
  ON public.page_views FOR INSERT
  WITH CHECK (true);

COMMENT ON COLUMN public.page_views.visitor_hash IS
  'SHA-256(ip | user-agent | jour) tronqué — identifie un visiteur unique par jour sans stocker l''IP.';

-- Purge optionnelle des données de plus de 12 mois :
-- DELETE FROM public.page_views WHERE created_at < now() - interval '12 months';
