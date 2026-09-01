-- ============================================================
-- NextVenture Tech — Seed 004 : Setup compte administrateur
-- ============================================================
-- INSTRUCTIONS :
--
-- 1. Aller dans Supabase Dashboard > Authentication > Users
-- 2. Cliquer "Add user" > "Create new user"
-- 3. Renseigner l'email et un mot de passe fort
-- 4. Copier l'UUID affiché dans la colonne "User UID"
-- 5. Remplacer 'REMPLACER-PAR-UUID-ADMIN' ci-dessous par cet UUID
-- 6. Exécuter ce script dans SQL Editor
--
-- ⚠️  Ne jamais hardcoder le mot de passe ici.
-- ⚠️  Ne jamais committer ce fichier avec un vrai UUID en production.
-- ============================================================

DO $$
DECLARE
  v_admin_id UUID := 'REMPLACER-PAR-UUID-ADMIN';
BEGIN
  -- Vérifier que l'UUID a bien été remplacé
  IF v_admin_id = 'REMPLACER-PAR-UUID-ADMIN' THEN
    RAISE EXCEPTION
      'Vous devez remplacer REMPLACER-PAR-UUID-ADMIN par le vrai UUID de votre compte admin.';
  END IF;

  -- Vérifier que l'utilisateur existe dans auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_admin_id) THEN
    RAISE EXCEPTION
      'Utilisateur avec l''UUID % introuvable dans auth.users. Créez-le d''abord via le Dashboard.',
      v_admin_id;
  END IF;

  -- Insérer le rôle admin (idempotent)
  INSERT INTO user_roles (user_id, role)
  VALUES (v_admin_id, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

  RAISE NOTICE 'Rôle admin accordé à l''utilisateur %', v_admin_id;
END;
$$;
