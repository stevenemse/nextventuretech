-- ============================================================
-- NextVenture Tech — Migration 002 : RLS & Policies
-- À exécuter APRÈS 001_schema.sql
-- Idempotent : DROP POLICY IF EXISTS avant CREATE POLICY
-- ============================================================

-- ─── Activer RLS sur toutes les tables ──────────────────────
ALTER TABLE services       ENABLE ROW LEVEL SECURITY;
ALTER TABLE works          ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans  ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles     ENABLE ROW LEVEL SECURITY;

-- ─── Fonction is_admin() ────────────────────────────────────
-- SECURITY DEFINER : s'exécute avec les droits du propriétaire
-- de la fonction, pas de l'utilisateur appelant.
-- Cela permet de lire user_roles même quand RLS est actif.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
$$;

-- ─── Policies : services ────────────────────────────────────
DROP POLICY IF EXISTS "services_public_select"  ON services;
DROP POLICY IF EXISTS "services_admin_select"   ON services;
DROP POLICY IF EXISTS "services_admin_insert"   ON services;
DROP POLICY IF EXISTS "services_admin_update"   ON services;
DROP POLICY IF EXISTS "services_admin_delete"   ON services;

-- Lecture publique uniquement des services publiés
CREATE POLICY "services_public_select"
  ON services FOR SELECT
  USING (is_published = true);

-- Admin : lecture complète (publiés + brouillons)
CREATE POLICY "services_admin_select"
  ON services FOR SELECT
  USING (is_admin());

-- Admin : écriture complète
CREATE POLICY "services_admin_insert"
  ON services FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "services_admin_update"
  ON services FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "services_admin_delete"
  ON services FOR DELETE
  USING (is_admin());

-- ─── Policies : works ───────────────────────────────────────
DROP POLICY IF EXISTS "works_public_select"  ON works;
DROP POLICY IF EXISTS "works_admin_select"   ON works;
DROP POLICY IF EXISTS "works_admin_insert"   ON works;
DROP POLICY IF EXISTS "works_admin_update"   ON works;
DROP POLICY IF EXISTS "works_admin_delete"   ON works;

CREATE POLICY "works_public_select"
  ON works FOR SELECT
  USING (is_published = true);

CREATE POLICY "works_admin_select"
  ON works FOR SELECT
  USING (is_admin());

CREATE POLICY "works_admin_insert"
  ON works FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "works_admin_update"
  ON works FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "works_admin_delete"
  ON works FOR DELETE
  USING (is_admin());

-- ─── Policies : pricing_plans ───────────────────────────────
DROP POLICY IF EXISTS "pricing_public_select"  ON pricing_plans;
DROP POLICY IF EXISTS "pricing_admin_select"   ON pricing_plans;
DROP POLICY IF EXISTS "pricing_admin_insert"   ON pricing_plans;
DROP POLICY IF EXISTS "pricing_admin_update"   ON pricing_plans;
DROP POLICY IF EXISTS "pricing_admin_delete"   ON pricing_plans;

CREATE POLICY "pricing_public_select"
  ON pricing_plans FOR SELECT
  USING (is_active = true);

CREATE POLICY "pricing_admin_select"
  ON pricing_plans FOR SELECT
  USING (is_admin());

CREATE POLICY "pricing_admin_insert"
  ON pricing_plans FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "pricing_admin_update"
  ON pricing_plans FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "pricing_admin_delete"
  ON pricing_plans FOR DELETE
  USING (is_admin());

-- ─── Policies : work_requests ───────────────────────────────
-- Règle critique : insertion publique autorisée (formulaire contact)
-- Zéro lecture/modification publique
DROP POLICY IF EXISTS "requests_public_insert"  ON work_requests;
DROP POLICY IF EXISTS "requests_admin_select"   ON work_requests;
DROP POLICY IF EXISTS "requests_admin_insert"   ON work_requests;
DROP POLICY IF EXISTS "requests_admin_update"   ON work_requests;
DROP POLICY IF EXISTS "requests_admin_delete"   ON work_requests;

CREATE POLICY "requests_public_insert"
  ON work_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "requests_admin_select"
  ON work_requests FOR SELECT
  USING (is_admin());

CREATE POLICY "requests_admin_insert"
  ON work_requests FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "requests_admin_update"
  ON work_requests FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "requests_admin_delete"
  ON work_requests FOR DELETE
  USING (is_admin());

-- ─── Policies : site_settings ───────────────────────────────
-- Lecture publique totale (navbar, footer ont besoin du logo, tel, etc.)
DROP POLICY IF EXISTS "settings_public_select"  ON site_settings;
DROP POLICY IF EXISTS "settings_admin_insert"   ON site_settings;
DROP POLICY IF EXISTS "settings_admin_update"   ON site_settings;
DROP POLICY IF EXISTS "settings_admin_delete"   ON site_settings;

CREATE POLICY "settings_public_select"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "settings_admin_insert"
  ON site_settings FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "settings_admin_update"
  ON site_settings FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "settings_admin_delete"
  ON site_settings FOR DELETE
  USING (is_admin());

-- ─── Policies : site_statistics ─────────────────────────────
DROP POLICY IF EXISTS "stats_public_select"  ON site_statistics;
DROP POLICY IF EXISTS "stats_admin_select"   ON site_statistics;
DROP POLICY IF EXISTS "stats_admin_insert"   ON site_statistics;
DROP POLICY IF EXISTS "stats_admin_update"   ON site_statistics;
DROP POLICY IF EXISTS "stats_admin_delete"   ON site_statistics;

CREATE POLICY "stats_public_select"
  ON site_statistics FOR SELECT
  USING (is_active = true);

CREATE POLICY "stats_admin_select"
  ON site_statistics FOR SELECT
  USING (is_admin());

CREATE POLICY "stats_admin_insert"
  ON site_statistics FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "stats_admin_update"
  ON site_statistics FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "stats_admin_delete"
  ON site_statistics FOR DELETE
  USING (is_admin());

-- ─── Policies : user_roles ──────────────────────────────────
-- Aucune lecture publique — admin seulement
DROP POLICY IF EXISTS "user_roles_admin_select"  ON user_roles;
DROP POLICY IF EXISTS "user_roles_admin_insert"  ON user_roles;
DROP POLICY IF EXISTS "user_roles_admin_update"  ON user_roles;
DROP POLICY IF EXISTS "user_roles_admin_delete"  ON user_roles;

CREATE POLICY "user_roles_admin_select"
  ON user_roles FOR SELECT
  USING (is_admin() OR auth.uid() = user_id);

CREATE POLICY "user_roles_admin_insert"
  ON user_roles FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "user_roles_admin_update"
  ON user_roles FOR UPDATE
  USING (is_admin());

CREATE POLICY "user_roles_admin_delete"
  ON user_roles FOR DELETE
  USING (is_admin());
