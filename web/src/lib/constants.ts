// Configuration et constantes
export const SITE_NAME = "ErgoZone";
export const SITE_DOMAIN = "ergozone.fr";
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const SITE_DESCRIPTION = "Le guide des accessoires de bureau ergonomiques. Comparatifs, avis et meilleurs prix pour votre confort au travail.";
export const SITE_TAGLINE = "Votre bureau, votre bien-être";

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

export const SORT_OPTIONS = [
  { value: "rating_desc", label: "Meilleures notes" },
  { value: "popular", label: "Plus populaires" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "recent", label: "Plus récents" },
] as const;

export const AFFILIATE_TAG = process.env.AFFILIATE_TAG || "ergozone-21";
export const ADSENSE_ENABLED = process.env.ADSENSE_ENABLED === "true";
export const ADSENSE_CLIENT_ID = process.env.ADSENSE_CLIENT_ID || "";
export const ADSENSE_SLOT_HEADER = process.env.ADSENSE_SLOT_HEADER || "";
export const ADSENSE_SLOT_SIDEBAR = process.env.ADSENSE_SLOT_SIDEBAR || "";
export const ADSENSE_SLOT_INFEED = process.env.ADSENSE_SLOT_INFEED || "";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ergozone.fr";
export const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";

// Navigation
export const NAV_LINKS = [
  { href: "/categorie/accessoires-bureau", label: "Accessoires" },
  { href: "/categorie/eclairage-bureau", label: "Éclairage" },
  { href: "/categorie/confort-bureau", label: "Confort" },
  { href: "/categorie/sieges-bureau", label: "Sièges" },
  { href: "/categorie/supports-ecran", label: "Supports écran" },
  { href: "/categorie/rangement-bureau", label: "Rangement" },
  { href: "/categorie/mobilier-bureau", label: "Mobilier" },
  { href: "/categorie/high-tech-bureau", label: "High-Tech" },
];

export const FOOTER_LINKS = {
  products: [
    { href: "/categorie/accessoires-bureau", label: "Accessoires bureau" },
    { href: "/categorie/eclairage-bureau", label: "Éclairage" },
    { href: "/categorie/sieges-bureau", label: "Sièges ergonomiques" },
    { href: "/categorie/supports-ecran", label: "Supports écran" },
  ],
  resources: [
    { href: "/blog", label: "Blog & Guides" },
    { href: "/boutique", label: "Boutique" },
    { href: "/contact", label: "Contact" },
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/politique-confidentialite", label: "Politique de confidentialité" },
    { href: "/conditions-utilisation", label: "Conditions d'utilisation" },
  ],
};
