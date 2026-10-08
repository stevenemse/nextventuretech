/**
 * Dictionnaire FR — source de vérité des clés de traduction.
 * `en.ts` doit respecter exactement ce type (vérifié par TypeScript).
 *
 * Âme de la marque : « Next » (le suivant) + « Venture » (l'aventure) →
 * chaque client est une nouvelle aventure, aussi unique que la précédente.
 */
export const fr = {
  lang: {
    switchLabel: 'Changer de langue',
    fr: 'FR',
    en: 'EN',
  },

  nav: {
    label: 'Navigation principale',
    links: {
      home: 'Accueil',
      services: 'Services',
      pricing: 'Tarifs',
      work: 'Réalisations',
      blog: 'Blog',
      contact: 'Contact',
      book: 'Réserver un Appel',
    },
    cta: 'Démarrer un projet',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },

  common: {
    bookCall: 'Réserver un appel gratuit',
    bookCallShort: 'Réserver un appel',
    contactUs: 'Nous contacter',
    writeUs: 'Nous écrire',
    requestQuote: 'Demander un devis',
    startProject: 'Démarrer votre projet',
    seeMore: 'En savoir plus',
    learnAbout: (title: string) => `En savoir plus sur ${title}`,
    whatsapp: 'WhatsApp',
  },

  footer: {
    label: 'Pied de page',
    servicesLinks: [
      { href: '/services#web-design', label: 'Web Design' },
      { href: '/services#graphic-design', label: 'Graphic Design' },
      { href: '/services#intelligence-artificielle', label: 'Intelligence Artificielle' },
      { href: '/services#montage-video', label: 'Montage Vidéo' },
      { href: '/services#motion-design', label: 'Motion Design' },
    ] as { href: string; label: string }[],
    ctaTitle1: 'Un projet en tête ?',
    ctaTitle2: 'Donnons-lui vie.',
    ctaSub:
      'Obtenez votre devis gratuit en quelques minutes — réponse garantie sous 24h.',
    bookCall: 'Réserver un appel gratuit',
    waMessage: "Bonjour NextVenture Tech, je souhaite discuter d'un projet.",
    tagline:
      "Transformer vos idées en réalité. Chaque client, notre prochaine aventure.",
    colServices: 'Services',
    colCompany: 'Entreprise',
    colContact: 'Contact',
    address: 'Douala, Cameroun',
    hours: 'Lun – Ven, 9h – 18h',
    rights: 'Tous droits réservés.',
    discuss: 'Discuter sur WhatsApp',
  },

  /** Libellés de stats (clés = valeurs stockées en base). */
  stats: {
    sectionLabel: 'Statistiques',
    labels: {
      'Projets Réalisés': 'Projets Réalisés',
      'Clients Satisfaits': 'Clients Satisfaits',
      "Ans d'Expérience": "Ans d'Expérience",
      'Note Moyenne': 'Note Moyenne',
    } as Record<string, string>,
  },

  faq: {
    badge: '— FAQ',
    title1: 'Questions',
    title2: 'fréquentes',
    subtitle: 'Tout ce que vous devez savoir avant de démarrer votre projet avec nous.',
    items: [
      {
        q: 'Quels services propose NextVenture Tech ?',
        a: "Nous proposons des services de développement web, de design graphique (logos, chartes graphiques), d'intelligence artificielle (chatbots, recommandations), de montage vidéo et de motion design.",
      },
      {
        q: 'Où êtes-vous situés ?',
        a: "Notre siège social est situé à Douala, Cameroun. Nous travaillons également avec des clients du monde entier.",
      },
      {
        q: 'Quel type de sites web pouvez-vous créer ?',
        a: 'Nous créons des sites web sur mesure, des boutiques en ligne (e-commerce), des sites vitrines et des plateformes interactives adaptées à vos besoins.',
      },
      {
        q: 'Quelle est la durée moyenne de développement ?',
        a: 'La durée dépend de la complexité du projet. En général, comptez entre 2 et 8 semaines pour un site web, selon les fonctionnalités requises.',
      },
      {
        q: 'Offrez-vous des services de maintenance ?',
        a: 'Oui, nous proposons des contrats de maintenance pour assurer que votre site reste à jour, sécurisé et performant sur le long terme.',
      },
      {
        q: 'Pouvez-vous intégrer un chatbot à mon site existant ?',
        a: 'Absolument. Nous pouvons intégrer un chatbot intelligent à votre site web actuel, quel que soit la technologie utilisée.',
      },
    ] as { q: string; a: string }[],
  },

  home: {
    badge: 'Chaque client, une nouvelle aventure',
    h1Pre: 'Transformer vos idées en',
    h1Highlight: 'réalité',
    heroSub:
      "Next + Venture : la prochaine aventure. Nous concevons sites web, identités visuelles et solutions IA sur mesure — parce que chaque projet mérite une aventure aussi unique que la précédente.",
    seeProjects: 'Voir nos projets',

    cardTextPre: 'Des expériences digitales qui',
    cardTextHighlight: 'convertissent.',
    cardBadge: 'Nouvelle aventure',
    cardStatValue: '30+',
    cardStatLabel: 'Projets livrés',
    strategy: 'Stratégie',
    strategyDesc: "Recherche, analyse d'audience et insights.",

    servicesBadge: '— Services',
    servicesTitle1: 'Ce que nous',
    servicesTitle2: 'offrons',
    seeAllServices: 'Voir tous les services',

    aboutBadge: '— À propos',
    aboutTitle1: "L'histoire derrière",
    aboutTitle2: 'NextVenture Tech',
    aboutText:
      "NextVenture, c'est Next — le suivant — et Venture — l'aventure. Notre conviction : chaque client est une nouvelle aventure, aussi unique que la précédente. Nous aidons les entreprises à grandir grâce au design, à l'innovation et à une approche centrée sur les résultats.",
    values: [
      { title: 'Sites web sur mesure', desc: 'Rapides, modernes et pensés pour convertir.' },
      { title: 'Design professionnel', desc: 'Une identité visuelle qui inspire confiance.' },
      { title: 'Solutions IA', desc: 'Chatbots et automatisations intelligents.' },
      { title: 'Support réactif', desc: 'Une équipe disponible et à votre écoute.' },
    ] as { title: string; desc: string }[],
    contactLink: 'Nous contacter',

    worksBadge: '— Nos derniers projets',
    worksTitle1: 'Explorez notre showcase de',
    worksTitle2: 'projets réalisés',
    worksIntro:
      'Des projets concrets pour des clients réels — chaque aventure a la sienne.',
    seeAllWorks: 'Voir toutes les réalisations',

    ctaBadge: '— Démarrez maintenant',
    ctaSectionLabel: "Appel à l'action",
    ctaTitle1: 'Prêt pour votre',
    ctaTitle2: 'prochaine aventure',
    ctaSub:
      "Réservez un appel gratuit de 30 minutes. Pas d'engagement, juste une conversation.",
    ctaTitle3: ' ?',
    metaTitle: 'Transformer vos idées en réalité',
    metaDescription:
      'NextVenture Tech — Développement web, design graphique et solutions IA. Chaque client, une nouvelle aventure.',
  },

  services: {
    badge: '— Nos services',
    metaDescription:
      'Découvrez nos services : Web Design, Graphic Design, Intelligence Artificielle, Montage Vidéo et Motion Design.',
    title1: 'Des solutions',
    title2: 'sur mesure',
    sub: 'De la conception à la livraison, nous transformons vos idées en produits digitaux qui font la différence.',
    numberBadge: (n: number) => `Service ${String(n).padStart(2, '0')}`,
    pricingCta: 'Voir les tarifs',
    requestCta: 'Demander ce service',
    waMessage: (service: string) =>
      `Bonjour NextVenture Tech ! Je suis interessé(e) par votre service "${service}". Pouvez-vous me donner plus d'informations (delais, tarifs, etapes) ?`,
    ctaTitle1: 'Vous avez un',
    ctaTitle2: 'projet',
    ctaTitle3: 'en tête ?',
    ctaSub: 'Réservez un appel gratuit et parlons-en. Réponse sous 24h.',
    /**
     * Contenus EN des services stockés en base (clés = slug).
     * La base reste la source de vérité en FR ; en EN on surcharge ici.
     */
    overrides: {} as Record<
      string,
      { title: string; description: string; keyPoints: string[] }
    >,
  },

  tarifs: {
    badge: '— Tarification',
    metaDescription: 'Consultez nos plans tarifaires transparents pour chaque service.',
    title1: 'Prix',
    title2: 'transparents',
    sub: 'Des plans clairs pour chaque budget. Pas de frais cachés, pas de surprises.',
    choosePlan: 'Choisissez votre formule',
    empty: 'Les tarifs arrivent bientôt.',
    ctaTitle1: "Besoin d'un",
    ctaTitle2: 'devis personnalisé',
    ctaTitle3: '?',
    ctaSub: 'Décrivez votre projet et nous vous répondrons sous 24h.',
  },

  pricing: {
    popular: 'Populaire',
    customPrice: 'Sur devis',
    startPlan: 'Commencer avec cette formule',
    requestQuote: 'Demander un devis',
    discuss: 'Discuter sur WhatsApp',
    waPriceOnRequest: 'sur devis',
    waMessage: (plan: string, service: string | undefined, price: string) =>
      `Bonjour NextVenture Tech ! Je suis interessé(e) par votre offre "${plan}"${
        service ? ` pour ${service}` : ''
      } (${price}). Pouvez-vous me donner plus de details ?`,
  },

  contact: {
    badge: '— Contact',
    metaDescription: 'Contactez NextVenture Tech pour discuter de votre projet digital.',
    title1: 'Obtenez votre devis',
    title2: 'gratuit',
    sub: 'Répondons à votre message sous 24h. Discutons de votre projet !',
    detailsTitle: 'Nos coordonnées',
    formTitle: 'Décrivez votre projet',
    addressLabel: 'Adresse',
    address: 'Douala, Cameroun',
    emailLabel: 'Email',
    whatsappLabel: 'WhatsApp',
    hoursLabel: 'Horaires',
    hours: 'Lun – Ven, 9h – 18h',
  },

  contactForm: {
    name: 'Nom complet',
    namePlaceholder: 'Jean Dupont',
    email: 'Email',
    emailPlaceholder: 'jean@exemple.com',
    phone: 'Téléphone',
    company: 'Entreprise',
    companyPlaceholder: 'Votre société',
    service: 'Service souhaité',
    chooseService: '— Choisir un service —',
    budget: 'Budget estimé',
    budgetPlaceholder: 'Ex : 150 000 – 300 000 FCFA',
    message: 'Message',
    messagePlaceholder: 'Décrivez votre projet, vos objectifs, vos délais…',
    submit: 'Envoyer ma demande',
    successTitle: 'Demande envoyée !',
    continueWa: 'Continuer sur WhatsApp',
    fasterReply: 'Pour une réponse encore plus rapide',
    presetMessage: (plan: string) =>
      `Bonjour, je suis interessé(e) par votre offre "${plan}". J'aimerais en savoir plus sur les délais et les prochaines étapes.`,
    msgInvalid: 'Données invalides. Veuillez vérifier les champs du formulaire.',
    msgServerError:
      "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.",
    msgRateLimit: 'Trop de tentatives. Veuillez réessayer dans quelques minutes.',
    msgFixFields: 'Veuillez corriger les erreurs dans le formulaire.',
    msgSuccess: 'Votre demande a bien été enregistrée ! Nous vous contacterons rapidement.',
  },

  realisations: {
    badge: '— Nos derniers projets',
    metaDescription: 'Découvrez nos projets réalisés pour nos clients à travers le monde.',
    title1: 'Explorez notre',
    title2: 'showcase',
    sub: 'Chaque projet est une aventure à part entière — voici celles que nous avons menées à bien.',
    empty: 'Nos réalisations arrivent bientôt.',
    emptyLink: 'Contactez-nous pour en savoir plus',
    ctaTitle1: 'Votre projet sera',
    ctaTitle2: 'le prochain',
    ctaSub: "Rejoignez nos clients satisfaits — parlons de votre idée dès aujourd'hui.",
    viewProject: 'Voir le projet',
    viewProjectAria: (title: string) => `Voir le projet : ${title}`,
  },

  reserver: {
    badge: '— Réservation',
    metaDescription: 'Réservez un appel gratuit de 30 minutes avec notre équipe.',
    title1: 'Réservez un appel',
    title2: 'gratuit',
    sub: '30 minutes pour discuter de votre projet et recevoir nos premiers conseils.',
    benefitsTitle: 'Ce que vous obtenez',
    benefits: [
      'Appel gratuit de 30 minutes',
      'Analyse de votre projet',
      'Devis transparent et sans engagement',
      "Conseils d'experts",
    ] as string[],
    immediateTitle: 'Disponibles immédiatement ?',
    immediateText:
      'Contactez-nous directement sur WhatsApp pour une réponse instantanée.',
    openWa: 'Ouvrir WhatsApp →',
    waMessage: 'Bonjour, je souhaite réserver un appel.',
  },

  blog: {
    badge: '— Blog',
    metaDescription:
      'Actualités, conseils et insights tech : web, design, intelligence artificielle et digitalisation — par NextVenture Tech.',
    title1: 'Idées, conseils &',
    title2: 'insights tech',
    sub: 'Web, design, intelligence artificielle et digitalisation — ce que nous apprenons, partagé pour vous aider à grandir.',
    readMore: "Lire l'article",
    featured: 'À la une',
    all: 'Tous',
    allArticles: 'Voir tous les articles',
    breadcrumb: "Fil d'ariane",
    adjacent: 'Articles adjacent',
    notFoundTitle: 'Article introuvable',
    prevArticle: 'Article précédent',
    nextArticle: 'Article suivant',
    readingTime: (minutes: number) => `${minutes} min de lecture`,
    noContent: "Cet article n'a pas encore de contenu.",
    backToBlog: 'Retour au blog',
    emptyCategory: (cat: string) => `Aucun article dans « ${cat} »`,
    empty: 'Aucun article pour le moment',
    emptySub: 'Nos premiers articles arrivent très bientôt — revenez nous voir !',
  },
}

export type Dictionary = typeof fr
