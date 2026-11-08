import { z } from "zod";

/**
 * Client work for "Trusted With Their Ideas."
 * An entry is shown only when the client has given written permission (recorded privately in `evidence`).
 * Intake template: docs/phase-2/client-intake/_TEMPLATE.md
 */

export const SERVICE_TAGS = [
  "Website design",
  "Website development",
  "Mobile app",
  "Web application",
  "Custom software",
  "AI and automation",
  "Product design",
  "Technical consulting",
  "Hosting and maintenance",
] as const;

const yes = z.literal(true);

export const clientSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  website: z.url().optional(),
  year: z.string().regex(/^\d{4}(–\d{4})?$/),
  services: z.array(z.enum(SERVICE_TAGS)).min(1),
  summary: z.string().min(20).max(220),
  logo: z.string().optional(),
  caseStudy: z.boolean().default(false),
  permission: z.object({
    name: z.boolean(),
    logo: z.boolean(),
    screenshots: z.boolean(),
    caseStudy: z.boolean(),
    /** Who agreed, how and when. Never rendered. */
    evidence: z.string().min(5),
  }),
});

export type Client = z.infer<typeof clientSchema>;

/** Empty until clients confirm. Candidates awaiting confirmation live in docs/phase-2/client-intake/clients.csv. */
const entries: unknown[] = [];

export const clients: Client[] = entries.map((e) => clientSchema.parse(e));

/** Only clients who agreed to be named; logos and case studies are gated separately where used. */
export function publishableClients(list: Client[] = clients): Client[] {
  return list.filter((c) => yes.safeParse(c.permission.name).success);
}

/** The homepage section appears only with at least two approved clients. */
export const MIN_CLIENTS_TO_SHOW = 2;
