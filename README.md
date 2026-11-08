# Ralph Lawal Group website

The website for Ralph Lawal Group: a founder-led technology studio in Dublin, Ireland.
Next.js 16 (App Router, Cache Components), React 19, strict TypeScript, CSS Modules. No UI or animation libraries.

Planning documents (design system, copy, SEO, legal notes) and the hidden Work section are kept outside this public repository.

## Run it locally

```bash
npm install
cp .env.example .env.local      # then fill in what you need (see below)
npm run dev                      # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

## Environment variables

| Name | Needed for | Notes |
| --- | --- | --- |
| `FORMSPREE_FORM_ID` | Enquiry and call-request forms | Your Formspree form ID (set in Vercel, not in Git). Without it the form says it’s unavailable and offers email; it never pretends to send. |
| `FORMSPREE_ENDPOINT` | Tests only | Points the server at the local mock. Leave empty in production. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Optional spam check | Set both or neither. When set, the CSP must allow `https://challenges.cloudflare.com` (script and frame). |
| `NEXT_PUBLIC_BOOKING_URL` | Discovery call booking | Your Cal.com event link. Empty = “request mode”: a form asking for preferred times, no fake availability. |

## Checks

```bash
npm run typecheck     # route types + strict TypeScript
npm run lint
npm test              # unit tests (Vitest): rules, validation, enquiry endpoint, redirect map
npm run build
npx playwright test   # end-to-end in Chrome: forms (mock Formspree), no-JS paths, theme, Blueprint,
                      # and axe-core WCAG 2.2 AA + structure on every page, both themes, desktop and phone
```

End-to-end tests start their own production server on port 3101 and a mock Formspree on 3199, so no real email is sent.

## Editing content

All words and facts live in `src/content/`:

| File | What it holds |
| --- | --- |
| `site.ts` | Name, email, location, X account, navigation, calls to action, copyright year |
| `home.ts` | Hero footnotes, “What we do”, Capabilities, “Where we usually come in”, project stages |
| `expertise.ts` | Service pages and FAQs |
| `clients.ts` | Client work (“Trusted With Their Ideas.”). An entry is shown only with written permission recorded; the section appears once two clients are approved |
| `legal.ts` | Business address, registration and VAT details. While the address is empty, legal pages show an “awaiting final details” notice |
| `redirects.ts` | Old-site redirects and retired (410) pages. Keep `src/proxy.ts` in sync (a test checks this) |

Brand marks in `src/assets/brand/` are the official files, only resized and trimmed of padding. Never redraw them.

Adding a client: collect name, website, services delivered, a factual summary and written permission; add the entry to `clients.ts` with its permission evidence; run the tests.

The Work section (product case studies) is hidden for now. Its code is kept locally, outside this repository, with restore instructions.

## Deployment (not yet approved)

Planned host: Vercel, on a plan that permits commercial use. Nothing has been deployed yet.

1. Import this repository into Vercel (framework preset: Next.js; build command `npm run build`).
2. Add the environment variables above in Vercel (Production and Preview). Never commit them.
3. Review the preview deployment, then attach `www.ralphlawalgroup.com` (canonical) and `ralphlawalgroup.com` (redirects to www).

## Security

- Secrets live only in the hosting provider’s environment settings; `.gitignore` blocks `.env*` files and common key formats.
- The enquiry endpoint validates on the server, uses a honeypot and timing check, optional Cloudflare Turnstile, and never logs message content.
- Security headers (CSP, HSTS, frame and referrer policies) are set in `next.config.ts`.
