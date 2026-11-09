-- ============================================================
-- NextVenture Tech — Seed 004 : Setup compte administrateur
-- ============================================================
-- INSTRUCTIONS :
--
-- 1. Aller dans Supabase Dashboard > Authentication > Users
-- 2. Cliquer "Add user" > "Create new user"
-- 3. Renseigner l'email et un mot de passe fort
-- 4. Exécuter ce script dans SQL Editor
--
-- Le script retrouve l'utilisateur par email : pas d'UUID à copier,
-- et il est rejouable sans risque (ON CONFLICT DO UPDATE).
--
-- ⚠️  Ne jamais hardcoder le mot de passe ici.
-- ============================================================

-- L'ancienne version demandait de coller l'UUID à la main : un UUID erroné
-- faisait échouer le script. On le résout désormais par email (idempotent).
DO $$
DECLARE
  v_admin_email TEXT := 'steveemse@gmail.com';
  v_admin_id UUID;
BEGIN
  -- Résoudre l'utilisateur par email
  SELECT id INTO v_admin_id FROM auth.users WHERE email = v_admin_email LIMIT 1;

  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION
      'Aucun utilisateur % dans auth.users. Créez-le d''abord via le Dashboard (Authentication > Users).',
      v_admin_email;
  END IF;

  -- Insérer le rôle admin (idempotent)
  INSERT INTO user_roles (user_id, role)
  VALUES (v_admin_id, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

  RAISE NOTICE 'Rôle admin accordé à l''utilisateur %', v_admin_id;
END;
$$;
