# NextVenture Tech

Site web professionnel + dashboard administrateur pour NextVenture Tech.

**Stack :** Next.js 16 · TypeScript · Tailwind CSS v4 · Supabase · Vercel

---

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env.local
# → Remplir NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, etc.

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Structure du projet

```
src/
├── app/
│   ├── (public)/          # Pages publiques (accueil, services, tarifs…)
│   ├── admin/             # Dashboard administrateur (protégé)
│   ├── actions/           # Server Actions (contact, auth, CRUD…)
│   └── api/               # Route Handlers (API REST)
├── components/
│   ├── ui/                # Composants primitifs (Button, Input, Badge…)
│   ├── layout/            # Navbar, Footer
│   ├── public/            # Composants pages publiques
│   └── admin/             # Composants dashboard
├── lib/
│   ├── supabase/          # Clients Supabase (browser, server, admin)
│   ├── auth/              # Guards d'authentification
│   ├── validations/       # Schemas Zod
│   ├── rate-limit/        # Rate limiter
│   └── utils/             # Helpers (cn, slugify, format, whatsapp)
├── services/              # Couche d'accès aux données
├── types/                 # Types TypeScript
└── config/                # Configuration publique du site
```

---

## Base de données Supabase

Exécuter les migrations dans l'ordre dans **SQL Editor** :

| Fichier | Description |
|---|---|
| `supabase/migrations/001_schema.sql` | Tables + index + triggers |
| `supabase/migrations/002_rls.sql` | RLS + fonction `is_admin()` + policies |
| `supabase/migrations/003_storage.sql` | Bucket images + policies storage |
| `supabase/migrations/004_blog.sql` | Tables blog (articles, tables de liaison) |
| `supabase/migrations/005_ads.sql` | Colonnes espace publicitaire (`site_settings`) |
| `supabase/seed/003_seed.sql` | Données initiales (services, tarifs, réalisations…) |
| `supabase/seed/004_admin_setup.sql` | Créer le compte admin |

### Créer le compte administrateur

1. Aller dans **Authentication → Users → Add user**
2. Créer un compte avec email + mot de passe fort
3. Copier l'UUID affiché
4. Dans `supabase/seed/004_admin_setup.sql`, remplacer `REMPLACER-PAR-UUID-ADMIN`
5. Exécuter le script

---

## Déploiement sur Vercel

```bash
# 1. Pousser sur GitHub
git add .
git commit -m "feat: NextVenture Tech — production ready"
git push origin main

# 2. Connecter le repo sur vercel.com
# 3. Ajouter les variables d'environnement dans Vercel Dashboard
# 4. Déployer
```

### Variables d'environnement Vercel

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique anon |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role (secret) |
| `NEXT_PUBLIC_SITE_URL` | URL de production (ex: `https://nextventuretech.vercel.app`) |

---

## Scripts disponibles

```bash
npm run dev      # Serveur de développement (Turbopack)
npm run build    # Build production
npm run start    # Démarrer le build production
npm run lint     # Linter ESLint
npx tsc --noEmit # Vérification TypeScript
```

---

## Accès au dashboard

URL : `/admin/login` (non affiché dans la navigation publique)

> **Note sécurité** : La confidentialité de l'URL n'est pas une mesure de sécurité.
> Toute la zone admin est protégée par Supabase Auth + vérification du rôle serveur.

---

## Configurer Calendly

1. Créer un compte sur [calendly.com](https://calendly.com)
2. Copier l'URL de votre événement (ex: `https://calendly.com/votre-nom/30min`)
3. Dans le dashboard : **Paramètres → URL Calendly**

---

## Contact

**Email :** nextventuretech237@gmail.com  
**WhatsApp :** +237 6 86 03 37 89  
**Localisation :** Douala, Cameroun
