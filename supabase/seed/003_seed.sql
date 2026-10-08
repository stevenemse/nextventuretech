-- ============================================================
-- NextVenture Tech — Seed 003 : Données initiales
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- APRÈS 001_schema.sql et 002_rls.sql
-- Utilise INSERT ... ON CONFLICT DO NOTHING (idempotent)
-- ============================================================

-- ─── site_settings (singleton) ──────────────────────────────
INSERT INTO site_settings (
  id, site_name, whatsapp, email, phone, calendly_url, social_links
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'NextVenture Tech',
  '+237686033789',
  'nextventuretech237@gmail.com',
  '+237 6 86 03 37 89',
  '',
  '{"facebook": "", "instagram": "", "linkedin": "", "twitter": ""}'
) ON CONFLICT (id) DO NOTHING;

-- ─── site_statistics ────────────────────────────────────────
INSERT INTO site_statistics (value, label, display_order, is_active) VALUES
  ('50+', 'Projets Réalisés',    1, true),
  ('30+', 'Clients Satisfaits',  2, true),
  ('5+',  'Ans d''Expérience',   3, true)
ON CONFLICT DO NOTHING;

-- ─── services ───────────────────────────────────────────────
INSERT INTO services (id, title, slug, description, key_points, icon, display_order, is_published) VALUES
(
  'aaaaaaaa-0000-0000-0000-000000000001',
  'Web Design',
  'web-design',
  'Sites web sur mesure, modernes et réactifs. Nous concevons des expériences digitales qui convertissent vos visiteurs en clients.',
  ARRAY['Website Design', 'E-Commerce Store', 'Authentification', 'Support Client'],
  'Globe',
  1,
  true
),
(
  'aaaaaaaa-0000-0000-0000-000000000002',
  'Graphic Design',
  'graphic-design',
  'Visuels attrayants et professionnels qui renforcent votre image de marque et captent l''attention.',
  ARRAY['Logos', 'Brochures', 'Bannières', 'Publicités'],
  'Palette',
  2,
  true
),
(
  'aaaaaaaa-0000-0000-0000-000000000003',
  'Intelligence Artificielle',
  'intelligence-artificielle',
  'Solutions IA pour optimiser votre entreprise. Automatisez vos processus et améliorez l''expérience client.',
  ARRAY['Recommandation Automatisée', 'Chatbot SOP', 'Association Produits', 'Assistant E-commerce', 'Chatbot Location', 'Génération de Leads'],
  'Brain',
  3,
  true
),
(
  'aaaaaaaa-0000-0000-0000-000000000004',
  'Montage Vidéo',
  'montage-video',
  'Montage professionnel pour vos vidéos. Donnez vie à vos contenus avec un rendu cinématographique.',
  ARRAY['Vidéos Promotionnelles', 'Publicités TV', 'Contenus Réseaux Sociaux', 'Color Grading', 'Effets Spéciaux', 'Sous-titrage'],
  'Video',
  4,
  true
),
(
  'aaaaaaaa-0000-0000-0000-000000000005',
  'Motion Design',
  'motion-design',
  'Animations et graphismes en mouvement pour captiver votre audience et transmettre vos messages.',
  ARRAY['Vidéos Explicatives', 'Intros Animées', 'Publicités Animées', 'Logo Animation', 'Infographies Animées', 'Contenus Réseaux Sociaux'],
  'Sparkles',
  5,
  true
)
ON CONFLICT (id) DO NOTHING;

-- ─── pricing_plans ──────────────────────────────────────────
INSERT INTO pricing_plans (
  service_id, name, description, price, currency,
  features, is_custom_quote, is_popular, display_order, is_active
) VALUES

-- Web Design
(
  'aaaaaaaa-0000-0000-0000-000000000001', 'Site Vitrine',
  'Idéal pour présenter votre activité professionnellement.',
  150000, 'FCFA',
  ARRAY['5 pages', 'Design responsive', 'Hébergement 1 an inclus', 'Certificat SSL', 'Support email'],
  false, false, 1, true
),
(
  'aaaaaaaa-0000-0000-0000-000000000001', 'E-Commerce',
  'Lancez votre boutique en ligne avec toutes les fonctionnalités.',
  350000, 'FCFA',
  ARRAY['10+ pages', 'Paiement intégré', 'Gestion de stock', 'SEO optimisé', 'Support prioritaire', 'Maintenance 3 mois'],
  false, true, 2, true
),
(
  'aaaaaaaa-0000-0000-0000-000000000001', 'Sur Mesure',
  'Solution entièrement personnalisée selon vos besoins.',
  NULL, 'FCFA',
  ARRAY['Analyse des besoins', 'Architecture sur mesure', 'Intégrations API', 'Performance optimisée'],
  true, false, 3, true
),

-- Graphic Design
(
  'aaaaaaaa-0000-0000-0000-000000000002', 'Logo & Identité',
  'Créez une identité visuelle forte et mémorable.',
  80000, 'FCFA',
  ARRAY['Logo principal', 'Variations de logo', 'Palette de couleurs', 'Typographies', 'Fichiers sources'],
  false, false, 1, true
),
(
  'aaaaaaaa-0000-0000-0000-000000000002', 'Pack Complet',
  'Identité visuelle complète pour votre marque.',
  200000, 'FCFA',
  ARRAY['Logo complet', 'Charte graphique', 'Cartes de visite', 'Brochures', 'Bannières', 'Supports digitaux'],
  false, true, 2, true
),
(
  'aaaaaaaa-0000-0000-0000-000000000002', 'Projet Spécifique',
  'Pour vos besoins graphiques ponctuels.',
  NULL, 'FCFA',
  ARRAY['Consultation gratuite', 'Devis personnalisé', 'Conception sur mesure'],
  true, false, 3, true
),

-- Intelligence Artificielle
(
  'aaaaaaaa-0000-0000-0000-000000000003', 'Chatbot Basique',
  'Automatisez votre service client avec un chatbot intelligent.',
  250000, 'FCFA',
  ARRAY['Chatbot SOP', 'Intégration site web', 'Base de connaissances', 'Support 3 mois'],
  false, false, 1, true
),
(
  'aaaaaaaa-0000-0000-0000-000000000003', 'Solution IA',
  'Solution IA complète adaptée à votre activité.',
  NULL, 'FCFA',
  ARRAY['Analyse des besoins', 'Développement sur mesure', 'Intégration complète', 'Formation équipe', 'Support dédié'],
  true, true, 2, true
),

-- Montage Vidéo
(
  'aaaaaaaa-0000-0000-0000-000000000004', 'Vidéo Courte',
  'Pour vos contenus courts percutants.',
  50000, 'FCFA',
  ARRAY['Vidéo 30–60 secondes', 'Color grading', 'Sous-titrage', '1 révision'],
  false, false, 1, true
),
(
  'aaaaaaaa-0000-0000-0000-000000000004', 'Vidéo Pro',
  'Production vidéo professionnelle et complète.',
  150000, 'FCFA',
  ARRAY['Vidéo 2–5 minutes', 'Color grading avancé', 'Effets spéciaux', 'Musique & sound design', '3 révisions'],
  false, true, 2, true
),
(
  'aaaaaaaa-0000-0000-0000-000000000004', 'Production Complète',
  'De la pré-production à la livraison finale.',
  NULL, 'FCFA',
  ARRAY['Pré-production', 'Tournage', 'Montage complet', 'Post-production'],
  true, false, 3, true
),

-- Motion Design
(
  'aaaaaaaa-0000-0000-0000-000000000005', 'Animation Simple',
  'Pour animer votre logo ou vos messages.',
  70000, 'FCFA',
  ARRAY['Vidéo 15–30 secondes', 'Logo animation', 'Textes animés', '1 révision'],
  false, false, 1, true
),
(
  'aaaaaaaa-0000-0000-0000-000000000005', 'Vidéo Explicative',
  'Expliquez votre produit ou service en animation.',
  200000, 'FCFA',
  ARRAY['Vidéo 60–90 secondes', 'Storyboard', 'Design sur mesure', 'Voix off', '3 révisions'],
  false, true, 2, true
),
(
  'aaaaaaaa-0000-0000-0000-000000000005', 'Projet Complexe',
  'Pour vos projets d''animation ambitieux.',
  NULL, 'FCFA',
  ARRAY['Consultation gratuite', 'Devis personnalisé', 'Production sur mesure'],
  true, false, 3, true
)

ON CONFLICT DO NOTHING;

-- ─── works (réalisations initiales) ─────────────────────────
INSERT INTO works (
  id, title, slug, description, partner, category, display_order, is_published
) VALUES
(
  'bbbbbbbb-0000-0000-0000-000000000001',
  'Plateforme E-commerce — Boutique Mode',
  'ecommerce-boutique-mode',
  'Boutique en ligne complète avec paiement intégré et gestion de stock avancée.',
  'ModeStyle Cameroun',
  'Web Design',
  1,
  true
),
(
  'bbbbbbbb-0000-0000-0000-000000000002',
  'Application Mobile — Livraison',
  'application-mobile-livraison',
  'Application de livraison de repas avec géolocalisation et intégration mobile money.',
  'FastDelivery',
  'Application Mobile',
  2,
  true
),
(
  'bbbbbbbb-0000-0000-0000-000000000003',
  'Chatbot IA — Service Client',
  'chatbot-ia-service-client',
  'Chatbot intelligent pour automatiser le service client et générer des leads qualifiés.',
  'TechSupport SARL',
  'Intelligence Artificielle',
  3,
  true
),
(
  'bbbbbbbb-0000-0000-0000-000000000004',
  'Identité Visuelle — Startup FinTech',
  'identite-visuelle-fintech',
  'Logo, charte graphique complète, cartes de visite et supports digitaux.',
  'FinTech Africa',
  'Graphic Design',
  4,
  true
),
(
  'bbbbbbbb-0000-0000-0000-000000000005',
  'Vidéo Promotionnelle',
  'video-promotionnelle',
  'Vidéo promotionnelle impactante pour une marque locale.',
  NULL,
  'Montage Vidéo',
  5,
  true
)
ON CONFLICT (id) DO NOTHING;
