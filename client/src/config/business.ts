/**
 * Business-facing settings for the customer site.
 * Values marked PLACEHOLDER are not confirmed by the owner yet.
 */
export const business = {
  name: 'Melty',
  /** Real — from Melty's Instagram bio. */
  instagramUrl: 'https://www.instagram.com/melty_2620',
  instagramHandle: '@melty_2620',

  currency: {
    en: 'EGP',
    ar: 'جنيه',
  },

  /** Shows a discreet "prototype / placeholder data" line in the footer. */
  showPrototypeNotice: true,

  // PLACEHOLDER — opening hours, phone number and address are not confirmed,
  // so they are intentionally not shown anywhere yet.
} as const;
