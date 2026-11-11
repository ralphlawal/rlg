/**
 * Insights articles. Written to be useful on their own: practical, specific, no invented statistics.
 * Anything that changes over time (store rules, regulation) is described with care and dated.
 */

export type ArticleBlock =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "note"; text: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  topic: "Mobile" | "Product" | "AI and automation" | "Security and privacy";
  published: string; // ISO date
  standfirst: string;
  blocks: ArticleBlock[];
  related: { label: string; href: string }[];
};

export const AUTHOR = { name: "Ralph Lawal", role: "Founder, Ralph Lawal Group" };

export const articles: Article[] = [
  {
    slug: "native-cross-platform-or-web",
    title: "Native, cross-platform or web? How to choose for your first app",
    description:
      "A plain-English guide to choosing between a native app, a cross-platform app and a web app for your first mobile product, and the questions that decide it.",
    topic: "Mobile",
    published: "2026-11-11",
    standfirst:
      "The technology choice matters less than most people think, and more than some developers admit. Here’s how to make it on business grounds.",
    blocks: [
      { t: "p", text: "If you’re planning your first app, you’ll soon hear three options. A native app is built separately for iPhone (in Swift) and Android (in Kotlin). A cross-platform app is built once, with a framework such as React Native or Flutter, and released to both stores. A web app runs in the browser and can be added to the home screen, without going through an app store at all." },
      { t: "p", text: "Each is a reasonable choice for the right product. The mistake is choosing on fashion or on a developer’s preference rather than on what your users need to do." },
      { t: "h2", text: "Start with five questions" },
      { t: "ol", items: [
        "Does it need to live in the app stores? If customers expect to search for you there, or you need push notifications that work reliably on every phone, a store app is the safer route.",
        "How much does it lean on the device? Widgets, background tasks, Bluetooth, advanced camera features and deep privacy integrations are where native code earns its extra cost.",
        "How often will it change? Products that change weekly in their first year benefit from one shared codebase, or from the web, where an update reaches everyone instantly.",
        "Who will use it, and on what? Look at your own customers. Ireland has plenty of both iPhone and Android users, but your audience may lean one way.",
        "Who will maintain it in three years? The cheapest option to build can be the most expensive to keep running if it depends on skills you can’t find later.",
      ] },
      { t: "h2", text: "When each option fits" },
      { t: "p", text: "A web app fits when the job is mostly forms, information and accounts: booking a service, checking an order, managing a membership. It’s the fastest to ship and the easiest to update. On iPhone, web apps added to the home screen can now send notifications, but they still can’t do everything a store app can, and many people never install them." },
      { t: "p", text: "Cross-platform fits most first releases of a real app. One codebase, one team and one set of tests reach both stores. Modern frameworks are mature, and for typical business apps users can’t tell the difference." },
      { t: "p", text: "Native fits when the experience is the product: a widget that must update instantly, an app that works heavily offline, or features that depend on the latest operating system capabilities. You pay more, roughly two codebases’ worth, but nothing stands between you and the platform." },
      { t: "h2", text: "Things that catch people out" },
      { t: "ul", items: [
        "Payments: Apple and Google generally require their own in-app purchase systems for digital content and subscriptions sold inside an app, though the rules differ by region and have been changing. Physical goods and services, like a haircut booking, usually aren’t affected. Check the current guidelines for every market you sell in.",
        "Review times: store review is usually quick, but a rejection can delay a launch. Accounts, payments and privacy declarations are the common reasons, and all of them can be designed for in advance.",
        "Accounts: if your app lets people create an account, both stores expect a way to delete it from within the app.",
        "Two products, not one: most apps also need an admin side for your team. Budget for it from the start.",
      ] },
      { t: "h2", text: "A sensible default" },
      { t: "p", text: "For most businesses launching a first app, the right default is a cross-platform app backed by a clean API, with the admin tools on the web. It keeps one codebase, reaches both stores, and leaves the door open to native code later if a specific feature needs it." },
      { t: "p", text: "If you’d like a second opinion on your plans, the discovery call is free and we’re happy to tell you if you don’t need an app at all." },
    ],
    related: [
      { label: "Mobile apps", href: "/expertise/mobile-apps" },
      { label: "Product design", href: "/expertise/product-design" },
    ],
  },
  {
    slug: "before-you-ask-for-a-software-quote",
    title: "Before you ask for a software quote: what to have ready",
    description:
      "What to prepare before asking for a quote for an app, website or custom software, so you get estimates you can compare and fewer surprises later.",
    topic: "Product",
    published: "2026-11-11",
    standfirst:
      "Vague briefs get vague quotes. You don’t need a specification, but a page of the right answers will save you weeks and make quotes worth comparing.",
    blocks: [
      { t: "p", text: "Most software projects that go wrong don’t fail on technology. They fail between the idea and the details: a scope nobody wrote down, an assumption nobody questioned, a feature that turned out to be three features. The cheapest time to catch those is before anyone quotes." },
      { t: "p", text: "You don’t need technical knowledge to prepare well. You need clear answers to a handful of business questions." },
      { t: "h2", text: "The one-page brief" },
      { t: "ol", items: [
        "The problem, in one paragraph. What happens today, why it isn’t good enough, and what it costs you in time, money or missed customers.",
        "Who uses it. Your customers, your staff, or both, and roughly how many of each in the first year.",
        "The first version. The smallest set of things it must do to be worth launching. Be ruthless; everything else goes on a later list.",
        "What already exists. Your current website, tools, spreadsheets, accounting or booking systems, and whether the new product must connect to them.",
        "Data. What personal information it will hold, and whether any of it is sensitive: health, finance, children, location.",
        "Constraints. A date that matters (a launch, a season, a funding round), a budget range, and who makes decisions.",
        "Success. What has to be true three months after launch for this to have been worth it.",
      ] },
      { t: "h2", text: "Why the budget range helps you" },
      { t: "p", text: "Many people hold back a budget for fear of being charged up to it. In practice, a range is the single most useful thing you can share. The same idea can be delivered in very different ways: a lean first version that proves the concept, or a polished product built for scale. Without a range, every supplier guesses, and you end up comparing guesses." },
      { t: "h2", text: "Questions to ask every supplier" },
      { t: "ul", items: [
        "What exactly is included, and what isn’t? Design, testing, app store submission, hosting setup and documentation are often where quotes differ.",
        "What are the assumptions behind the estimate, and what would change it?",
        "Who will actually do the work, and how will I see progress along the way?",
        "Who owns the code and the accounts (hosting, app stores, domains) at the end?",
        "What does it cost to run and maintain after launch?",
        "How do you handle security and personal data?",
      ] },
      { t: "note", text: "A good quote states its assumptions. If two quotes are far apart, the assumptions usually explain why, and they’re a better basis for choosing than the totals." },
      { t: "h2", text: "What a good proposal looks like" },
      { t: "p", text: "Once you’ve shared a brief, a proposal should make it easy to say yes or no with confidence. Whoever you choose, look for these things in writing:" },
      { t: "ul", items: [
        "Your problem restated in their words, so you can see they understood it.",
        "A first release that’s clearly smaller than the full vision, with the rest listed as later phases.",
        "Deliverables you can point at: designs, a working preview, the live product, documentation and access to every account.",
        "How progress will be shared, how often you’ll see working software, and how changes to the scope are handled and priced.",
        "Who owns what at the end, including the code, the domain, the app store listings and the hosting accounts.",
        "What happens after launch: support, security updates and running costs, so the total cost of ownership isn’t a surprise.",
      ] },
      { t: "p", text: "If a proposal is missing several of these, ask. A supplier who answers clearly before the work starts is usually one who communicates clearly during it." },
      { t: "h2", text: "Not ready for a quote yet?" },
      { t: "p", text: "That’s normal. Our Scope Sketch turns a few answers into a first outline of what your product needs, and the free 20-minute discovery call is a good place to test an idea before you write anything down." },
    ],
    related: [
      { label: "Try Scope Sketch", href: "/start/sketch" },
      { label: "How a project runs", href: "/approach" },
    ],
  },
  {
    slug: "where-ai-helps-a-small-business",
    title: "Where AI genuinely helps a small business, and where it doesn’t yet",
    description:
      "A practical look at where AI and automation save small businesses real time, where they still fall short, and how to start without taking on risk.",
    topic: "AI and automation",
    published: "2026-11-11",
    standfirst:
      "Most small businesses don’t need a chatbot. They need the repetitive parts of the week to happen on their own, and answers that come from their own information.",
    blocks: [
      { t: "p", text: "AI tools have become genuinely useful, and also genuinely overpromised. For a small business, the useful question isn’t “how do we use AI?” but “which tasks eat our time, and could software do them reliably?” Sometimes the answer involves AI. Often it’s ordinary automation, which is cheaper and more predictable." },
      { t: "h2", text: "Where it helps today" },
      { t: "ul", items: [
        "Moving information between systems. Copying enquiry details into a CRM, invoices into accounting software, bookings into a calendar. Much of this needs no AI at all, just well-built integrations.",
        "Reading unstructured documents. Pulling names, dates, amounts and line items out of emails, PDFs and forms is where modern AI models are strong, especially with a person checking the results.",
        "Drafting, not deciding. First drafts of replies, product descriptions and summaries save real time when someone reviews them before they go out.",
        "Answering from your own documents. An assistant that searches your policies, manuals or product data, and shows where each answer came from, helps staff find things faster.",
      ] },
      { t: "h2", text: "Where it still falls short" },
      { t: "ul", items: [
        "Anything that must be right every time without a check. AI models can produce confident, plausible answers that are wrong. That’s fine for a draft, and not fine for a price, a medical detail or a legal commitment.",
        "Customer-facing chat without boundaries. An open-ended chatbot on your website can say things you’d never approve. If you use one, limit what it can talk about and make it easy to reach a person.",
        "Messy data. AI won’t fix a process that nobody has written down, or records that contradict each other. Tidy the process first.",
      ] },
      { t: "h2", text: "Starting safely" },
      { t: "ol", items: [
        "List the tasks that take the most hours each week and are repeated in the same way.",
        "For each one, ask whether a simple rule or integration could handle it. If so, do that first.",
        "Where AI is genuinely needed, start with a version where a person approves every output, and measure how often they change it.",
        "Know where your data goes. Check each provider’s terms on storage and model training, and record the processing for your GDPR obligations.",
        "Set spending limits. Costs that scale with usage should never surprise you.",
      ] },
      { t: "note", text: "Regulation is part of the picture too. The EU AI Act introduces duties that depend on how AI is used, including being transparent when people are interacting with an AI system. If your use touches customers, check how it applies to you." },
      { t: "h2", text: "A sensible first project" },
      { t: "p", text: "Picture a small services business that receives enquiries by email and web form, retypes each one into a spreadsheet, and sends a similar reply every time. A sensible first project doesn’t start with a chatbot. It connects the form and the inbox to the spreadsheet or CRM automatically, then uses an AI model to draft a reply for each enquiry, which a person reviews and sends with one click." },
      { t: "p", text: "That project is small, easy to measure, and safe: nothing reaches a customer without approval. After a few weeks you’ll know how often the drafts need changing, how much time it saves, and whether it’s worth going further. That evidence is worth more than any demo." },
      { t: "h2", text: "Funding" },
      { t: "p", text: "Irish businesses may be able to get support for digital and AI projects through their Local Enterprise Office or Enterprise Ireland. Schemes change, so check what’s currently available directly with them." },
    ],
    related: [
      { label: "AI and automation", href: "/expertise/ai-automation" },
      { label: "Backend, APIs and cloud", href: "/expertise/backend-cloud" },
    ],
  },
  {
    slug: "keeping-customer-data-apart",
    title: "Keeping your customers’ data apart: a security checklist for multi-customer software",
    description:
      "A founder-friendly checklist for keeping each customer’s data separate in SaaS and multi-business software, from database rules to testing and access.",
    topic: "Security and privacy",
    published: "2026-11-11",
    standfirst:
      "If your software serves more than one business or household, the worst bug isn’t a crash. It’s one customer seeing another’s data. Here’s how to make that structurally hard.",
    blocks: [
      { t: "p", text: "Many products are “multi-tenant”: one system serving many separate customers. A booking platform serves many salons; a SaaS tool serves many companies; a family app serves many households. Each customer expects their data to be invisible to everyone else. Getting that right is less about clever code and more about where you put the rules." },
      { t: "h2", text: "Put the rules where they can’t be skipped" },
      { t: "p", text: "The most common mistake is enforcing access only in the app: the screen shows a customer their own records, so everything seems fine. But apps can be modified, and anyone can call an API directly. The rule that keeps customers apart must live on the server, ideally in the database itself." },
      { t: "p", text: "PostgreSQL supports row-level security, where the database refuses to return or change any row the current user isn’t allowed to see, regardless of what the app asks for. Platforms built on PostgreSQL, such as Supabase, make this the recommended approach." },
      { t: "h2", text: "The checklist" },
      { t: "ol", items: [
        "Every table holding customer data has a column that says which customer owns it, and it can’t be empty.",
        "Access rules are enforced by the server or database on every read and write, not only by the interface.",
        "The server decides who the user is and which customer they belong to. Never trust a customer ID sent by the app.",
        "Columns that must not be changed by users, such as the owner, the author and timestamps, are set by the server and can’t be written by clients.",
        "Administrative keys that bypass the rules are used only on the server, never shipped in an app or website.",
        "File storage follows the same rules as the database. Uploads are private by default, and links expire.",
        "When someone leaves a team or an account is closed, their access ends immediately, everywhere.",
        "Error messages and logs never contain another customer’s data, and failures don’t reveal whether a record exists.",
        "Backups can be restored for one customer without exposing others, and deletion requests reach backups in time.",
        "Search, exports, reports and notifications are checked too. They’re where leaks most often hide.",
      ] },
      { t: "h2", text: "Test by trying to break it" },
      { t: "p", text: "Write automated tests that create two customers and have one try to read, change, delete and export the other’s data through every route you have. Those tests should fail loudly if anyone ever loosens a rule. They’re among the most valuable tests a multi-customer product can have, and they cost little to write at the start." },
      { t: "note", text: "Under GDPR, a leak between customers is a personal data breach. In Ireland it must generally be reported to the Data Protection Commission within 72 hours of becoming aware of it, unless it’s unlikely to put people at risk. Designing it out is far cheaper than responding to it." },
      { t: "h2", text: "Questions to ask whoever builds it" },
      { t: "p", text: "You don’t need to read the code to know whether this has been handled. Ask these questions and listen for specific answers rather than reassurance:" },
      { t: "ul", items: [
        "Where exactly is the rule enforced that stops one customer seeing another’s data?",
        "What happens if someone calls the API directly with a different customer’s ID?",
        "Which keys can bypass those rules, and where are they stored?",
        "Is there an automated test that tries to read another customer’s data, and does it run on every change?",
        "How would we find out if a leak happened, and how quickly could we restore or delete one customer’s data?",
      ] },
      { t: "h2", text: "If you already have a product" },
      { t: "p", text: "Start with a short review: where are the rules enforced today, and what would happen if someone called your API directly with another customer’s ID? The answers usually point to a small number of high-value fixes." },
    ],
    related: [
      { label: "Backend, APIs and cloud", href: "/expertise/backend-cloud" },
      { label: "Custom software and SaaS", href: "/expertise/custom-software" },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export function readingMinutes(a: Article) {
  const words = [a.standfirst, ...a.blocks.flatMap((b) => ("text" in b ? [b.text] : b.items))].join(" ").split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** Insights is shown in navigation once at least two articles are published. */
export const INSIGHTS_PUBLIC = articles.length >= 2;
