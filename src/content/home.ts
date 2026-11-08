export const heroNotes = [
  {
    id: "n1",
    text: "A new product, a better way to run part of your business, or the next version of something you already have.",
  },
  {
    id: "n2",
    text: "Design, engineering, launch, and the maintenance and improvement that decide whether a product lasts.",
  },
] as const;

export const whatWeDo = [
  {
    title: "Mobile apps",
    text: "Native iOS and Android, or one cross-platform codebase when that is the better trade-off for your budget and users.",
    href: "/expertise/mobile-apps",
  },
  {
    title: "Websites and web platforms",
    text: "Company sites, customer portals and web applications that load fast, read clearly and are easy to run.",
    href: "/expertise/web",
  },
  {
    title: "AI and automation",
    text: "Practical AI that takes repetitive work off your team, built with the checks that make it safe to depend on.",
    href: "/expertise/ai-automation",
  },
  {
    title: "Custom software and backends",
    text: "SaaS products, internal tools, APIs and integrations, and the cloud infrastructure underneath them.",
    href: "/expertise/custom-software",
  },
] as const;

export const situations = [
  { text: "You have an idea and need to know what the first version should be.", to: "Product design", href: "/expertise/product-design" },
  { text: "Your prototype works for ten people and won’t survive a thousand.", to: "Backend and cloud", href: "/expertise/backend-cloud" },
  { text: "Your team copies the same information between three systems every day.", to: "AI and automation", href: "/expertise/ai-automation" },
  { text: "Your website looks capable but doesn’t bring in enquiries.", to: "Websites", href: "/expertise/web" },
  { text: "Your customers expect an app on their phone, not a mobile website.", to: "Mobile apps", href: "/expertise/mobile-apps" },
  { text: "You pay for software that almost fits the way you work.", to: "Custom software", href: "/expertise/custom-software" },
  { text: "Something important was built years ago and nobody wants to touch it.", to: "Consulting", href: "/approach#consulting" },
] as const;

export const stages = [
  {
    name: "Understand",
    text: "We start with your business, not the technology: who will use this, what has to be true for it to succeed, and what can wait.",
    get: "A written brief and a proposed first release.",
  },
  {
    name: "Shape",
    text: "Flows, interface design and technical architecture, settled before code, while changes are still cheap.",
    get: "Clickable designs, an architecture outline, and a quote or phased estimate.",
  },
  {
    name: "Build",
    text: "Short cycles with a working version you can try along the way. Testing, security and accessibility are part of every cycle.",
    get: "Regular releases to a private preview.",
  },
  {
    name: "Run",
    text: "Launch, app store submission, monitoring, and the improvements real use reveals.",
    get: "A maintained product, or a documented handover, as agreed in your contract.",
  },
] as const;

/** What every project includes. Commitments about how we work, not claims about past results. */
export const capabilities = [
  {
    title: "Accessibility",
    text: "Designed and tested to WCAG 2.2 AA, so your product works for everyone, including people using keyboards and screen readers.",
  },
  {
    title: "Security and privacy",
    text: "Access rules enforced on the server, only the personal data you need, and dependencies kept up to date.",
  },
  {
    title: "Performance",
    text: "A speed budget agreed at the start and checked on real phones, not just fast office connections.",
  },
  {
    title: "Testing",
    text: "Automated tests for the paths that matter most: sign-in, payments, and anything that touches personal data.",
  },
  {
    title: "Search and measurement",
    text: "Technical SEO done properly, and privacy-friendly analytics that don’t need a cookie banner.",
  },
  {
    title: "Documentation and handover",
    text: "Clear documentation, with ownership, licensing and handover agreed in your contract.",
  },
] as const;
