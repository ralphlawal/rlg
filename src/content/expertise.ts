/**
 * Expertise pages. Copy approved in Phase 2 (docs/phase-2/03-site-copy.md), with the conditional-approval
 * corrections: no guaranteed response times, no automatic IP transfer, no unverified claims.
 */

export type Service = {
  slug: "mobile-apps" | "web" | "ai-automation" | "custom-software" | "backend-cloud" | "product-design";
  name: string;
  /** Pre-selects this option on the enquiry form. */
  enquiry: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  audience: string[];
  problems: string[];
  deliverables: string[];
  approach: { title: string; text: string }[];
  /** Links to related pages. Case studies return here when the Work section is public again. */
  related: { label: string; href: string }[];
  faqs: { q: string; a: string }[];
  quoteLabel: string;
};

const OWNERSHIP_FAQ = {
  q: "Who owns the code?",
  a: "Ownership, licensing and handover are agreed in each project’s contract, so they fit how you plan to run the product.",
};

export const services: Service[] = [
  {
    slug: "mobile-apps",
    name: "Mobile apps",
    enquiry: "mobile-app",
    summary: "Apps for iPhone and Android, native or cross-platform, from first design to App Store and Google Play review.",
    metaTitle: "App Development in Dublin, Ireland",
    metaDescription:
      "iPhone and Android apps, native or cross-platform, designed, built and taken through App Store and Google Play review by one team in Dublin.",
    title: "Mobile apps people keep on their home screen.",
    intro:
      "We design and build iPhone and Android apps, from the first screen sketch to approval in the App Store and Google Play, and through the updates that follow.",
    audience: [
      "Businesses whose customers need to book, buy, track or communicate on their phones.",
      "Founders taking a product idea to its first release.",
      "Teams with a web product that now needs a proper mobile app.",
    ],
    problems: [
      "A mobile website that can’t send notifications, work offline or sit on the home screen.",
      "An app that was built quickly and is now hard to change or keeps crashing.",
      "Uncertainty about native versus cross-platform, and what each costs over time.",
    ],
    deliverables: [
      "Interface design for phone and tablet, in light and dark appearance.",
      "The app itself, with sign-in, payments, notifications and widgets where they’re needed.",
      "The backend and admin tools the app depends on.",
      "App Store and Google Play listings, privacy declarations and review submission.",
      "Automated tests, crash reporting and a release process you can repeat.",
    ],
    approach: [
      {
        title: "Native or cross-platform is a business decision",
        text: "One codebase for both platforms is often right for a first release. Native code (Swift for iPhone, Kotlin for Android) earns its cost when the app leans on the device: widgets, background work, the camera, privacy features. We’ll tell you which fits, and why.",
      },
      {
        title: "Store review is part of the design",
        text: "Apple and Google have rules about payments, accounts and data. We design around them from the start, not after a rejection.",
      },
      {
        title: "Offline and slow connections are normal",
        text: "Apps should save work locally and send it when they can.",
      },
    ],
    related: [],
    faqs: [
      { q: "Should I build for iPhone or Android first?", a: "It depends on your customers. Both are widely used in Ireland, so we usually look at your own data before recommending one. A cross-platform build can release both at once." },
      OWNERSHIP_FAQ,
      { q: "Can you take over an existing app?", a: "Yes. We start with a short technical review so you know what you’re inheriting." },
      { q: "Do you handle App Store submission?", a: "Yes, including the listing, screenshots, privacy details and responding to review feedback." },
    ],
    quoteLabel: "Request a Quote for a mobile app",
  },
  {
    slug: "web",
    name: "Websites and web applications",
    enquiry: "website",
    summary: "Company websites that earn trust and enquiries, and web applications people use every day.",
    metaTitle: "Website and Web App Development",
    metaDescription:
      "Fast, accessible company websites and web applications, built to bring in enquiries and save your team time. Based in Dublin, Ireland.",
    title: "Websites and web applications that do their job.",
    intro:
      "A company website should make the right people trust you and get in touch. A web application should make someone’s work faster. We build both, and judge them by those outcomes, not by how they look in a screenshot.",
    audience: [
      "Companies whose website no longer reflects the quality of their work.",
      "Businesses that need customer portals, booking, dashboards or online services.",
      "Teams replacing spreadsheets and email chains with a proper web tool.",
    ],
    problems: [
      "A slow site that ranks poorly and loses visitors on mobile.",
      "A site nobody on the team can update without calling a developer.",
      "Enquiry forms that go nowhere, or attract more spam than clients.",
    ],
    deliverables: [
      "Content structure and copy guidance, so the site says something worth reading.",
      "Design for every screen size, with accessibility built in to WCAG 2.2 AA.",
      "A fast, secure build with technical SEO done properly.",
      "An editing setup that matches who will update the site.",
      "Enquiry handling with spam protection that actually reaches your inbox.",
    ],
    approach: [
      { title: "Speed is a feature", text: "We set a performance budget at the start and check every page against it." },
      {
        title: "Accessibility is a baseline, not an add-on",
        text: "It can also matter legally: the European Accessibility Act applies to some online services sold to consumers in the EU.",
      },
      { title: "The simplest stack that does the job", text: "A brochure site doesn’t need a complex CMS. A busy platform does need a proper backend." },
    ],
    related: [
      { label: "How this site is built", href: "/colophon" },
    ],
    faqs: [
      { q: "Can we edit the site ourselves?", a: "Yes. We set up editing to suit your team, from simple file-based content to a full CMS." },
      { q: "Will it rank on Google?", a: "We build everything search engines need to understand and index your site well. Rankings also depend on your content and competition, so nobody can honestly guarantee them." },
      { q: "Do you host it?", a: "We can set up and manage hosting, or hand it over to your own accounts." },
    ],
    quoteLabel: "Request a Quote for a website",
  },
  {
    slug: "ai-automation",
    name: "AI and automation",
    enquiry: "ai-automation",
    summary: "Assistants that answer from your own documents, workflows that remove manual steps, and the guardrails around both.",
    metaTitle: "AI and Automation for Businesses",
    metaDescription:
      "Practical AI and workflow automation that removes repetitive work, answers from your own documents, and keeps your data under control.",
    title: "AI that takes work off your team, not adds risk to it.",
    intro:
      "Most businesses don’t need a chatbot on their homepage. They need the repetitive, error-prone parts of their week to happen on their own, and answers that come from their own information rather than the internet’s guesses.",
    audience: [
      "Teams spending hours copying, checking and re-typing information.",
      "Businesses with large document libraries, policies or product data that people struggle to search.",
      "Companies that want to try AI carefully, with clear limits and costs.",
    ],
    problems: [
      "Manual data entry between email, spreadsheets, accounting and CRM.",
      "Staff answering the same internal or customer questions repeatedly.",
      "AI pilots that impressed in a demo and failed with real data.",
    ],
    deliverables: [
      "A short assessment of where automation will and won’t pay off.",
      "Workflow automations connecting the tools you already use.",
      "Assistants that answer from your documents, with sources shown and access controlled.",
      "Monitoring, cost limits and human review where accuracy matters.",
      "Clear documentation of what data goes where, for your GDPR records.",
    ],
    approach: [
      { title: "Start with the process, not the model", text: "If a task can be automated without AI, we’ll do that. It’s cheaper and more reliable." },
      { title: "Show the source", text: "Answers built on your documents cite where they came from, so people can check them." },
      { title: "Keep a person in the loop", text: "For anything that affects money, customers or legal standing." },
      { title: "Know where your data goes", text: "We choose providers and settings with EU data protection in mind." },
    ],
    related: [],
    faqs: [
      {
        q: "Is our data used to train AI models?",
        a: "We check each AI provider’s data-use terms before recommending it, choose settings that keep your data out of model training where the provider offers that, and document what goes where.",
      },
      { q: "What will it cost to run?", a: "We estimate running costs before building and set spending limits." },
      {
        q: "Is there funding available?",
        a: "Irish businesses may be eligible for support from their Local Enterprise Office or Enterprise Ireland for digital projects. Check the current schemes directly with them. We’re happy to help with the technical side of an application.",
      },
    ],
    quoteLabel: "Request a Quote for AI or automation",
  },
  {
    slug: "custom-software",
    name: "Custom software and SaaS",
    enquiry: "custom-software",
    summary: "Software built around how your business actually works, including subscription products you sell to others.",
    metaTitle: "Custom Software and SaaS Development",
    metaDescription:
      "Software shaped around how your business works: internal tools and SaaS products with accounts, billing and secure data boundaries.",
    title: "Software shaped around how you actually work.",
    intro:
      "Off-the-shelf tools are built for the average business. When yours isn’t average, you end up working around your software. We build custom tools for internal teams, and SaaS products you sell to your own customers.",
    audience: [
      "Businesses running key processes on spreadsheets or a patchwork of apps.",
      "Founders building a subscription software product.",
      "Companies with an ageing system that needs replacing without stopping the business.",
    ],
    problems: [
      "Paying for several tools that don’t talk to each other.",
      "No single, reliable view of customers, jobs or stock.",
      "A product idea that needs accounts, billing, roles and an admin side to be viable.",
    ],
    deliverables: [
      "A product definition and first-release scope.",
      "Design and development of the application and its admin tools.",
      "Multi-tenant architecture for SaaS: separate customer data, roles, plans and billing.",
      "Migration from your existing tools, with a plan that avoids downtime.",
      "Documentation, and a handover or ongoing development, as agreed in your contract.",
    ],
    approach: [
      { title: "Version one should be small and complete", text: "Not large and half-finished." },
      { title: "Data boundaries come first", text: "In SaaS, one customer must never see another’s data. We enforce that in the database, not just in the interface." },
      { title: "Plan for the second year", text: "Logging, backups, migrations and admin tools are part of the build." },
    ],
    related: [],
    faqs: [
      OWNERSHIP_FAQ,
      { q: "Can you replace our current system gradually?", a: "Usually, yes. We plan the move in stages so the business keeps running throughout." },
    ],
    quoteLabel: "Request a Quote for custom software",
  },
  {
    slug: "backend-cloud",
    name: "Backend, APIs and cloud",
    enquiry: "backend",
    summary: "Databases, APIs, integrations, authentication, payments and the infrastructure that runs them.",
    metaTitle: "Backend, API and Cloud Engineering",
    metaDescription:
      "Databases, APIs, integrations, payments and cloud infrastructure, built securely and tested where failures would hurt most.",
    title: "The part nobody sees, built so you never have to think about it.",
    intro:
      "Every app and platform depends on a backend: the database, the rules, the integrations, the infrastructure. When it’s done well, nobody notices. When it isn’t, everyone does.",
    audience: [
      "Teams whose product works but is slow, fragile or expensive to run.",
      "Businesses connecting systems: payments, accounting, CRM, logistics.",
      "Products that need a secure API for apps, partners or customers.",
    ],
    problems: [
      "Outages, slow pages and errors that appear only under real traffic.",
      "Integrations held together by manual exports.",
      "Security and data protection gaps in an existing system.",
    ],
    deliverables: [
      "API and data-model design.",
      "Authentication, roles and permissions.",
      "Payment and third-party integrations.",
      "Cloud infrastructure, deployment pipelines, monitoring and backups.",
      "A security review with prioritised fixes.",
    ],
    approach: [
      { title: "Enforce rules where they can’t be bypassed", text: "Access control belongs in the database and API, not only in the app." },
      { title: "Test the dangerous paths", text: "We write tests for the things that would hurt most: someone seeing another person’s data, a payment going through twice." },
      { title: "Managed services where they reduce risk", text: "And no lock-in where it would hurt." },
    ],
    related: [],
    faqs: [
      { q: "Can you review an existing backend?", a: "Yes. A short, fixed-scope review gives you a written report and a prioritised list of fixes." },
      OWNERSHIP_FAQ,
    ],
    quoteLabel: "Request a Quote for backend work",
  },
  {
    slug: "product-design",
    name: "Product and interface design",
    enquiry: "product-design",
    summary: "Research, flows, interface design and design systems, by people who also build.",
    metaTitle: "Product and UX Design",
    metaDescription:
      "Product and interface design by people who also build: research, flows, every screen state, prototypes and design systems.",
    title: "Design that holds up once it’s built.",
    intro:
      "We design products the way they’ll be built: real content, real states, real constraints. The result looks considered and can be built without surprises.",
    audience: [
      "Founders who need a product designed before raising funds or hiring.",
      "Teams whose app works but confuses users.",
      "Companies that need one consistent design system across web and mobile.",
    ],
    problems: [
      "Designs that look finished but fall apart with real data.",
      "An interface that grew feature by feature and no longer makes sense.",
      "Web and mobile products that feel like they come from different companies.",
    ],
    deliverables: [
      "Research and flows based on how people actually use the product.",
      "Interface designs for every screen and state: empty, loading, error, success.",
      "Interactive prototypes for testing and investor conversations.",
      "A design system: tokens, components and usage rules.",
      "Accessibility reviewed at the design stage.",
    ],
    approach: [
      { title: "Design the uncomfortable states", text: "What happens when there’s no data, a payment fails, or the connection drops." },
      { title: "One system across platforms", text: "Adapted to each platform’s conventions." },
      { title: "Remove before adding", text: "Most products improve by doing fewer things more clearly." },
    ],
    related: [],
    faqs: [
      { q: "Do you only design, or design and build?", a: "Either. Many clients start with design and continue into the build; others take the designs to their own team." },
      OWNERSHIP_FAQ,
    ],
    quoteLabel: "Request a Quote for product design",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const consulting = {
  name: "Technical consulting and modernisation",
  summary:
    "A second opinion on architecture, a plan for ageing systems, or a technical voice in the room for a non-technical founder.",
  href: "/approach#consulting",
};
