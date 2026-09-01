-- ============================================================
-- NextVenture Tech — Migration 001 : Schéma complet
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- Idempotent : utilise CREATE TABLE IF NOT EXISTS
-- ============================================================

-- ─── Extensions ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Fonction utilitaire : updated_at automatique ───────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ─── services ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  key_points    TEXT[] NOT NULL DEFAULT '{}',
  image_url     TEXT,
  icon          TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_slug      ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_published ON services(is_published, display_order);

DROP TRIGGER IF EXISTS trg_services_updated_at ON services;
CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── works ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS works (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  image_url     TEXT,
  project_url   TEXT,
  partner       TEXT,
  category      TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_works_published  ON works(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_works_category   ON works(category);

DROP TRIGGER IF EXISTS trg_works_updated_at ON works;
CREATE TRIGGER trg_works_updated_at
  BEFORE UPDATE ON works
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── pricing_plans ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id      UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(12, 0),
  currency        TEXT NOT NULL DEFAULT 'FCFA',
  features        TEXT[] NOT NULL DEFAULT '{}',
  is_custom_quote BOOLEAN NOT NULL DEFAULT false,
  is_popular      BOOLEAN NOT NULL DEFAULT false,
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pricing_service  ON pricing_plans(service_id, display_order);
CREATE INDEX IF NOT EXISTS idx_pricing_active   ON pricing_plans(is_active, service_id);

DROP TRIGGER IF EXISTS trg_pricing_updated_at ON pricing_plans;
CREATE TRIGGER trg_pricing_updated_at
  BEFORE UPDATE ON pricing_plans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── work_requests ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS work_requests (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  company    TEXT,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  budget     TEXT,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending','accepted','in_progress','completed','refused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_requests_status    ON work_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_email     ON work_requests(email);
CREATE INDEX IF NOT EXISTS idx_requests_created   ON work_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_service   ON work_requests(service_id);

DROP TRIGGER IF EXISTS trg_requests_updated_at ON work_requests;
CREATE TRIGGER trg_requests_updated_at
  BEFORE UPDATE ON work_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── site_settings (singleton) ──────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name    TEXT NOT NULL DEFAULT 'NextVenture Tech',
  logo_url     TEXT,
  favicon_url  TEXT,
  whatsapp     TEXT DEFAULT '+237686033789',
  email        TEXT DEFAULT 'nextventuretech237@gmail.com',
  phone        TEXT DEFAULT '+237 6 86 03 37 89',
  calendly_url TEXT,
  social_links JSONB NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_settings_updated_at ON site_settings;
CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── site_statistics ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_statistics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value         TEXT NOT NULL,
  label         TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stats_active ON site_statistics(is_active, display_order);

DROP TRIGGER IF EXISTS trg_stats_updated_at ON site_statistics;
CREATE TRIGGER trg_stats_updated_at
  BEFORE UPDATE ON site_statistics
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── user_roles ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_roles (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'admin'
             CHECK (role IN ('admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
