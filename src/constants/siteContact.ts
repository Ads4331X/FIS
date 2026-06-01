/**
 * Single source of truth for school contact info (Footer, Contact page, maps).
 */

export const SITE_NAME = "Fairyland International School";
const MAP_QUERY = "Fairyland International School";

export const siteContact = {
  addressDisplay: "Baluwakhani, Kapan, Budhanilakantha-10, Kathmandu",

  /** Same URL as Footer “Contact” location click */
  mapOpenUrl:
    `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}` as const,

  /** Google Maps embed matching the Fairyland query above */
  mapEmbedUrl:
    `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed` as const,

  /** Shown on screen */
  phoneDisplay: "01-4164344",
  /** Passed to tel: (digits only works across clients) */
  phoneTel: "014164344",

  email: "fairylandinternationalschool@gmail.com",
  prospectusUrl: "/Fairyland_School_Prospectus.pdf",
  prospectusFileName: "Fairyland_School_Prospectus.pdf",

  social: {
    facebook: "https://www.facebook.com/fairyland.schooll/",
    tiktok: "https://www.tiktok.com/@fairylandintschool",
    youtube: "https://www.youtube.com/",
  },
} as const;
