/**
 * Facts about Ralph Lawal Group used across the site.
 * Only verified, approved details belong here. See docs/phase-2/11-legal-and-business-disclosures.md.
 */
export const site = {
  name: "Ralph Lawal Group",
  url: "https://www.ralphlawalgroup.com",
  description:
    "A founder-led technology studio in Dublin, Ireland, designing and building mobile apps, web platforms, AI systems and custom software for businesses in Ireland and abroad.",
  email: "hello@ralphlawalgroup.com",
  location: "Dublin, Ireland",
  /** Shown in the footer, contact pages, legal pages and structured data. */
  address: { locality: "Dublin", country: "Ireland", countryCode: "IE" },
  founder: "Ralph Lawal",
  /** Sole trader: the brand is a trading name. Never add Ltd, company numbers, VAT or a registered office. */
  legalLine: "Ralph Lawal Group is the trading name of Ralph Lawal.",
  social: {
    x: { handle: "@ralphlawalgroup", url: "https://x.com/ralphlawalgroup" },
  },
  /** Kept as a constant so pages stay fully static. Update each January. */
  copyrightYear: 2026,
} as const;

/** Primary navigation. Work returns when products are public. */
export const primaryNav = [
  { href: "/expertise", label: "Expertise" },
  { href: "/approach", label: "Approach" },
  { href: "/group", label: "Group" },
  { href: "/insights", label: "Insights" },
] as const;

export const cta = {
  primary: { href: "/start", label: "Start a Project" },
  /** "Explore Our Work" returns when the Work section is public again (see preserved/README.md). */
  secondary: { href: "/expertise", label: "Explore Our Expertise" },
  quote: { label: "Request a Quote" },
  call: { href: "/start/call", label: "Book a Discovery Call" },
} as const;
