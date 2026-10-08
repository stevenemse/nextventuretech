import type { Dictionary } from './fr'

/**
 * EN dictionary — must match the shape of `fr.ts` exactly (type-checked).
 * Brand soul: Next (the next one) + Venture (the adventure) —
 * every client is a new adventure, as unique as the last.
 */
export const en: Dictionary = {
  lang: {
    switchLabel: 'Switch language',
    fr: 'FR',
    en: 'EN',
  },

  nav: {
    label: 'Main navigation',
    links: {
      home: 'Home',
      services: 'Services',
      pricing: 'Pricing',
      work: 'Work',
      blog: 'Blog',
      contact: 'Contact',
      book: 'Book a Call',
    },
    cta: 'Start a project',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  common: {
    bookCall: 'Book a free call',
    bookCallShort: 'Book a call',
    contactUs: 'Contact us',
    writeUs: 'Write to us',
    requestQuote: 'Request a quote',
    startProject: 'Start your project',
    seeMore: 'Learn more',
    learnAbout: (title: string) => `Learn more about ${title}`,
    whatsapp: 'WhatsApp',
  },

  footer: {
    label: 'Footer',
    servicesLinks: [
      { href: '/services#web-design', label: 'Web Design' },
      { href: '/services#graphic-design', label: 'Graphic Design' },
      { href: '/services#intelligence-artificielle', label: 'Artificial Intelligence' },
      { href: '/services#montage-video', label: 'Video Editing' },
      { href: '/services#motion-design', label: 'Motion Design' },
    ],
    ctaTitle1: 'Got a project in mind?',
    ctaTitle2: "Let's bring it to life.",
    ctaSub: 'Get your free quote in minutes — reply guaranteed within 24h.',
    bookCall: 'Book a free call',
    waMessage: 'Hello NextVenture Tech, I would like to discuss a project.',
    tagline:
      'Turning your ideas into reality. Every client is our next adventure.',
    colServices: 'Services',
    colCompany: 'Company',
    colContact: 'Contact',
    address: 'Douala, Cameroon',
    hours: 'Mon – Fri, 9am – 6pm',
    rights: 'All rights reserved.',
    discuss: 'Chat on WhatsApp',
  },

  /** Stat labels (keys = values stored in the database). */
  stats: {
    sectionLabel: 'Statistics',
    labels: {
      'Projets Réalisés': 'Projects Delivered',
      'Clients Satisfaits': 'Happy Clients',
      "Ans d'Expérience": 'Years of Experience',
      'Note Moyenne': 'Average Rating',
    } as Record<string, string>,
  },

  faq: {
    badge: '— FAQ',
    title1: 'Frequently asked',
    title2: 'questions',
    subtitle: 'Everything you need to know before starting your project with us.',
    items: [
      {
        q: 'What services does NextVenture Tech offer?',
        a: 'We offer web development, graphic design (logos, brand guidelines), artificial intelligence (chatbots, recommendations), video editing and motion design services.',
      },
      {
        q: 'Where are you located?',
        a: 'Our head office is in Douala, Cameroon. We also work with clients from all over the world.',
      },
      {
        q: 'What kind of websites can you build?',
        a: 'We create custom websites, online stores (e-commerce), landing pages and interactive platforms tailored to your needs.',
      },
      {
        q: 'What is the average development time?',
        a: 'It depends on the complexity of the project. In general, expect 2 to 8 weeks for a website, depending on the required features.',
      },
      {
        q: 'Do you offer maintenance services?',
        a: 'Yes, we offer maintenance contracts to keep your website up to date, secure and performant over time.',
      },
      {
        q: 'Can you integrate a chatbot into my existing website?',
        a: 'Absolutely. We can integrate a smart chatbot into your current website, whatever technology it uses.',
      },
    ] as { q: string; a: string }[],
  },

  home: {
    badge: 'Every client, a new adventure',
    h1Pre: 'Turning your ideas into',
    h1Highlight: 'reality',
    heroSub:
      'Next + Venture: the next adventure. We craft custom websites, visual identities and AI solutions — because every project deserves an adventure as unique as the last.',
    seeProjects: 'See our projects',

    cardTextPre: 'Digital experiences that',
    cardTextHighlight: 'convert.',
    cardBadge: 'New adventure',
    cardStatValue: '30+',
    cardStatLabel: 'Projects delivered',
    strategy: 'Strategy',
    strategyDesc: 'Research, audience analysis and insights.',

    servicesBadge: '— Services',
    servicesTitle1: 'What we',
    servicesTitle2: 'offer',
    seeAllServices: 'See all services',

    aboutBadge: '— About us',
    aboutTitle1: 'The story behind',
    aboutTitle2: 'NextVenture Tech',
    aboutText:
      'NextVenture is Next — the next one — plus Venture — the adventure. Our belief: every client is a new adventure, as unique as the last. We help businesses grow through design, innovation and a results-driven approach.',
    values: [
      { title: 'Custom websites', desc: 'Fast, modern and built to convert.' },
      { title: 'Professional design', desc: 'A visual identity that builds trust.' },
      { title: 'AI solutions', desc: 'Smart chatbots and automations.' },
      { title: 'Responsive support', desc: 'A team that is here for you.' },
    ] as { title: string; desc: string }[],
    contactLink: 'Contact us',

    worksBadge: '— Our latest projects',
    worksTitle1: 'Explore our showcase of',
    worksTitle2: 'completed projects',
    worksIntro:
      'Real projects for real clients — every adventure has its own story.',
    seeAllWorks: 'See all projects',

    ctaBadge: '— Get started now',
    ctaSectionLabel: 'Call to action',
    ctaTitle1: 'Ready for your',
    ctaTitle2: 'next adventure',
    ctaSub:
      'Book a free 30-minute call. No commitment, just a conversation.',
    ctaTitle3: '?',
    metaTitle: 'Turning ideas into reality',
    metaDescription:
      'NextVenture Tech — Web development, graphic design and AI solutions. Every client, a new adventure.',
  },

  services: {
    badge: '— Our services',
    metaDescription:
      'Discover our services: Web Design, Graphic Design, Artificial Intelligence, Video Editing and Motion Design.',
    title1: 'Solutions built',
    title2: 'for you',
    sub: 'From concept to delivery, we turn your ideas into digital products that make a difference.',
    numberBadge: (n: number) => `Service ${String(n).padStart(2, '0')}`,
    pricingCta: 'See pricing',
    requestCta: 'Request this service',
    waMessage: (service: string) =>
      `Hello NextVenture Tech! I'm interested in your "${service}" service. Could you give me more information (timelines, pricing, next steps)?`,
    ctaTitle1: 'Got a',
    ctaTitle2: 'project',
    ctaTitle3: 'in mind?',
    ctaSub: 'Book a free call and let\u2019s talk. Reply within 24h.',
    /** EN overrides for services stored in the database (key = slug). */
    overrides: {
      'web-design': {
        title: 'Web Design',
        description:
          'Custom, modern and responsive websites. We craft digital experiences that turn your visitors into customers.',
        keyPoints: ['Website Design', 'E-Commerce Store', 'Authentication', 'Customer Support'],
      },
      'graphic-design': {
        title: 'Graphic Design',
        description:
          'Eye-catching, professional visuals that strengthen your brand image and capture attention.',
        keyPoints: ['Logos', 'Brochures', 'Banners', 'Ads'],
      },
      'intelligence-artificielle': {
        title: 'Artificial Intelligence',
        description:
          'AI solutions to optimize your business. Automate your processes and improve the customer experience.',
        keyPoints: [
          'Automated Recommendations',
          'Chatbot SOP',
          'Product Pairing',
          'E-commerce Assistant',
          'Rental Chatbot',
          'Lead Generation',
        ],
      },
      'montage-video': {
        title: 'Video Editing',
        description:
          'Professional editing for your videos. Bring your content to life with a cinematic finish.',
        keyPoints: [
          'Promotional Videos',
          'TV Commercials',
          'Social Media Content',
          'Color Grading',
          'Special Effects',
          'Subtitling',
        ],
      },
      'motion-design': {
        title: 'Motion Design',
        description:
          'Motion graphics and animations to captivate your audience and deliver your messages.',
        keyPoints: [
          'Explainer Videos',
          'Animated Intros',
          'Animated Ads',
          'Logo Animation',
          'Animated Infographics',
          'Social Media Content',
        ],
      },
    },
  },

  tarifs: {
    badge: '— Pricing',
    metaDescription: 'Check out our transparent pricing plans for every service.',
    title1: 'Transparent',
    title2: 'pricing',
    sub: 'Clear plans for every budget. No hidden fees, no surprises.',
    choosePlan: 'Choose your plan',
    empty: 'Pricing coming soon.',
    ctaTitle1: 'Need a',
    ctaTitle2: 'custom quote',
    ctaTitle3: '?',
    ctaSub: 'Describe your project and we will get back to you within 24h.',
  },

  pricing: {
    popular: 'Popular',
    customPrice: 'On request',
    startPlan: 'Choose this plan',
    requestQuote: 'Request a quote',
    discuss: 'Chat on WhatsApp',
    waPriceOnRequest: 'on request',
    waMessage: (plan: string, service: string | undefined, price: string) =>
      `Hello NextVenture Tech! I'm interested in your "${plan}" offer${
        service ? ` for ${service}` : ''
      } (${price}). Could you give me more details?`,
  },

  contact: {
    badge: '— Contact',
    metaDescription: 'Contact NextVenture Tech to discuss your digital project.',
    title1: 'Get your free',
    title2: 'quote',
    sub: 'We reply to your message within 24h. Let\u2019s talk about your project!',
    detailsTitle: 'Our details',
    formTitle: 'Describe your project',
    addressLabel: 'Address',
    address: 'Douala, Cameroon',
    emailLabel: 'Email',
    whatsappLabel: 'WhatsApp',
    hoursLabel: 'Hours',
    hours: 'Mon – Fri, 9am – 6pm',
  },

  contactForm: {
    name: 'Full name',
    namePlaceholder: 'John Doe',
    email: 'Email',
    emailPlaceholder: 'john@example.com',
    phone: 'Phone',
    company: 'Company',
    companyPlaceholder: 'Your company',
    service: 'Service needed',
    chooseService: '— Choose a service —',
    budget: 'Estimated budget',
    budgetPlaceholder: 'E.g. 150,000 – 300,000 FCFA',
    message: 'Message',
    messagePlaceholder: 'Describe your project, goals, timeline…',
    submit: 'Send my request',
    successTitle: 'Request sent!',
    continueWa: 'Continue on WhatsApp',
    fasterReply: 'For an even faster reply',
    presetMessage: (plan: string) =>
      `Hello, I'm interested in your "${plan}" offer. I'd like to know more about timelines and next steps.`,
    msgInvalid: 'Invalid data. Please check the form fields.',
    msgServerError:
      'An error occurred while saving. Please try again.',
    msgRateLimit: 'Too many attempts. Please try again in a few minutes.',
    msgFixFields: 'Please fix the errors in the form.',
    msgSuccess: 'Your request has been recorded! We will contact you shortly.',
  },

  realisations: {
    badge: '— Our latest projects',
    metaDescription: 'Discover the projects we have delivered for clients around the world.',
    title1: 'Explore our',
    title2: 'showcase',
    sub: 'Every project is an adventure of its own — here are the ones we have successfully delivered.',
    empty: 'Our projects are coming soon.',
    emptyLink: 'Contact us to learn more',
    ctaTitle1: 'Your project will be',
    ctaTitle2: 'the next one',
    ctaSub: 'Join our happy clients — let\u2019s talk about your idea today.',
    viewProject: 'View project',
    viewProjectAria: (title: string) => `View project: ${title}`,
  },

  reserver: {
    badge: '— Booking',
    metaDescription: 'Book a free 30-minute call with our team.',
    title1: 'Book a free',
    title2: 'call',
    sub: '30 minutes to discuss your project and get our first pieces of advice.',
    benefitsTitle: 'What you get',
    benefits: [
      'Free 30-minute call',
      'Analysis of your project',
      'Transparent quote with no obligation',
      'Expert advice',
    ] as string[],
    immediateTitle: 'Available right now?',
    immediateText:
      'Reach us directly on WhatsApp for an instant answer.',
    openWa: 'Open WhatsApp →',
    waMessage: 'Hello, I would like to book a call.',
  },

  blog: {
    badge: '— Blog',
    metaDescription:
      'News, tips and tech insights: web, design, artificial intelligence and digitalization — by NextVenture Tech.',
    title1: 'Ideas, tips &',
    title2: 'tech insights',
    sub: 'Web, design, artificial intelligence and digitalization — what we learn, shared to help you grow.',
    readMore: 'Read article',
    featured: 'Featured',
    all: 'All',
    allArticles: 'See all articles',
    breadcrumb: 'Breadcrumb',
    adjacent: 'Related articles',
    notFoundTitle: 'Article not found',
    prevArticle: 'Previous article',
    nextArticle: 'Next article',
    readingTime: (minutes: number) => `${minutes} min read`,
    noContent: 'This article has no content yet.',
    backToBlog: 'Back to blog',
    emptyCategory: (cat: string) => `No article in “${cat}”`,
    empty: 'No article for now',
    emptySub: 'Our first articles are coming very soon — check back soon!',
  },
}
