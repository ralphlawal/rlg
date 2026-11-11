/**
 * Known slugs for dynamic routes, kept tiny so the proxy can import them.
 * Tests check these match the content files.
 * The Work section is hidden from the public site for now; its code is kept locally in preserved/ (not in Git).
 */
export const EXPERTISE_SLUGS = ["mobile-apps", "web", "ai-automation", "custom-software", "backend-cloud", "product-design"] as const;
export const INSIGHT_SLUGS = [
  "native-cross-platform-or-web",
  "before-you-ask-for-a-software-quote",
  "where-ai-helps-a-small-business",
  "keeping-customer-data-apart",
] as const;
