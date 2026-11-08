/**
 * Scope Sketch rules (v1).
 * Plain rules, no AI, no prices, no timelines. Every output line comes from an answer.
 * Unit tested in scope-rules.test.ts. Change the version when the rules change.
 */

export const SCOPE_RULES_VERSION = "1.0";

export type Where = "ios" | "android" | "web" | "internal";
export type YesNoUnsure = "yes" | "no" | "unsure";
export type Payments = "once" | "subs" | "no" | "unsure";
export type DataKind = "contact" | "sensitive" | "none" | "unsure";
export type Ai = "docs" | "tasks" | "no";
export type Stage = "new" | "rebuild" | "addition";

export type Answers = {
  idea?: string;
  stage?: Stage;
  audience?: "public" | "team" | "both";
  where: Where[];
  auth?: YesNoUnsure;
  payments?: Payments;
  data?: DataKind;
  integrations?: ("payments" | "accounting" | "existing-api")[];
  ai?: Ai;
};

export type Sketch = {
  clients: string[];
  services: string[];
  decisions: string[];
  versionOne: string[];
  later: string[];
  questions: string[];
};

const has = <T,>(list: readonly T[] | undefined, v: T) => !!list?.includes(v);

export function sketch(a: Answers): Sketch {
  const mobileBoth = has(a.where, "ios") && has(a.where, "android");
  const onPhones = has(a.where, "ios") || has(a.where, "android");

  const clients: string[] = [];
  if (mobileBoth) clients.push("iPhone and Android apps (one shared codebase is likely)");
  else if (has(a.where, "ios")) clients.push("iPhone app");
  else if (has(a.where, "android")) clients.push("Android app");
  if (has(a.where, "web")) clients.push(a.audience === "team" ? "Web app for your team" : "Web app");
  if (has(a.where, "internal") || a.audience === "team" || a.audience === "both") clients.push("Admin dashboard for your team");
  if (clients.length === 0) clients.push("Interface to be decided");

  const services: string[] = ["API"];
  if (a.auth === "yes") services.push("Sign-in and accounts");
  if (a.auth === "unsure") services.push("Sign-in (to decide)");
  if (a.payments === "once") services.push("Payments");
  if (a.payments === "subs") services.push("Subscriptions and billing");
  if (onPhones) services.push("Notifications");
  if (a.ai === "docs") services.push("Document search with AI answers");
  if (a.ai === "tasks") services.push("Workflow automations");
  for (const i of a.integrations ?? []) {
    if (i === "payments" && !services.some((s) => s.startsWith("Payments") || s.startsWith("Subscriptions"))) services.push("Payment provider integration");
    if (i === "accounting") services.push("Accounting or CRM integration");
    if (i === "existing-api") services.push("Connection to your existing systems");
  }
  services.push("Database");

  const decisions: string[] = [];
  if (a.payments === "subs" && onPhones)
    decisions.push("Apple and Google usually require their own in-app purchase for digital subscriptions sold inside an app. Decide early how that fits your pricing.");
  if (a.payments === "once" || a.payments === "subs")
    decisions.push("Choose a payment provider, and decide who handles refunds and disputes.");
  if (a.data === "sensitive")
    decisions.push("Sensitive personal data may need a data protection impact assessment before launch. It shapes where data is stored and who can see it.");
  if (a.data === "contact" || a.data === "unsure")
    decisions.push("Write down which personal data you truly need. Holding less is simpler and safer.");
  if (a.auth === "yes" || a.auth === "unsure")
    decisions.push("Decide whether people need an account at all. Fewer accounts can mean less friction and less data to protect.");
  if (a.ai === "docs")
    decisions.push("Decide which documents the assistant may read, who may ask it questions, and how answers show their sources.");
  if (a.ai === "tasks")
    decisions.push("List the systems involved and check that each has an API that allows the automation.");
  if (a.stage === "rebuild")
    decisions.push("Plan how existing data and users move across, and how the old system is switched off without downtime.");
  if (a.stage === "addition")
    decisions.push("Review the existing system first, so the new part fits how it already works.");
  if (decisions.length === 0) decisions.push("Who the first users are, and what they must be able to do on day one.");

  const versionOne = ["The core journey for your first users, end to end"];
  if (clients.some((c) => c.startsWith("Admin"))) versionOne.push("A simple admin view for your team");
  if (a.payments === "once" || a.payments === "subs") versionOne.push("One payment method, done properly");
  if (a.auth === "yes") versionOne.push("Sign-in with password reset and account deletion");
  if (mobileBoth) versionOne.push("Both app stores, from one codebase");
  versionOne.push("Error monitoring, backups, and analytics without tracking cookies");

  const later: string[] = [];
  if (onPhones) later.push("Widgets and deeper device features");
  if (a.payments) later.push(a.payments === "subs" ? "Extra plans, discounts and team billing" : "Extra payment methods");
  if (a.ai !== "docs" && a.ai !== "tasks") later.push("Automation or AI, once real usage shows where it helps");
  later.push("Reporting and exports");

  const questions = [
    "Who is the first group of people who will use this, and how will they hear about it?",
    "What has to be true after three months for this to count as a success?",
  ];
  if (a.stage === "rebuild" || a.stage === "addition") questions.push("What works well in the current system that must not be lost?");
  if (onPhones && !mobileBoth) questions.push("Do your customers mostly use iPhone or Android?");
  if (a.data === "sensitive") questions.push("Who in your organisation is responsible for data protection?");

  return { clients, services: [...new Set(services)], decisions, versionOne, later, questions };
}

/** Plain-text version carried into the enquiry form and the email we receive. */
export function sketchToText(a: Answers, s: Sketch = sketch(a)): string {
  const lines = [`Scope Sketch (rules v${SCOPE_RULES_VERSION})`];
  if (a.idea?.trim()) lines.push(`Idea: ${a.idea.trim()}`);
  lines.push(`Parts: ${[...s.clients, ...s.services].join(" · ")}`);
  lines.push("Decide early:", ...s.decisions.map((d) => `- ${d}`));
  lines.push("Likely in version one:", ...s.versionOne.map((d) => `- ${d}`));
  lines.push("Probably later:", ...s.later.map((d) => `- ${d}`));
  return lines.join("\n");
}
