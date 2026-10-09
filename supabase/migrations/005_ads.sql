-- ─── Espace publicitaire (gestion depuis le dashboard admin) ───────────────
-- À exécuter dans le SQL Editor Supabase (voir README.md).

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS ads_enabled            BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS adsense_publisher_id   TEXT,
  ADD COLUMN IF NOT EXISTS ads_code               TEXT,
  ADD COLUMN IF NOT EXISTS ads_image_url          TEXT,
  ADD COLUMN IF NOT EXISTS ads_image_link         TEXT;

COMMENT ON COLUMN site_settings.ads_enabled          IS 'Active l''espace publicitaire près des articles du blog';
COMMENT ON COLUMN site_settings.adsense_publisher_id IS 'ID éditeur Google AdSense (ca-pub-XXXXXXXXXXXXXXXX) — charge le script de messagerie';
COMMENT ON COLUMN site_settings.ads_code             IS 'Code HTML personnalisé de la publicité (encart AdSense <ins>, bannière autre réseau…)';
COMMENT ON COLUMN site_settings.ads_image_url        IS 'URL de l''image publicitaire (si renseignée, affichée avec le code)';
COMMENT ON COLUMN site_settings.ads_image_link       IS 'URL de destination de l''image publicitaire';
