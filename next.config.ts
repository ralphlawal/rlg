import type { NextConfig } from "next";
import { CANONICAL_HOST, OLD_HOST, redirectEntries } from "./src/content/redirects";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy without nonces, so every page stays statically generated.
 * 'unsafe-inline' for scripts is needed for the theme script and Next.js's inline page data;
 * everything else is locked to this origin. Third parties are added only when used
 * (Turnstile, Cal.com, Vercel Analytics) in later steps.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  /**
   * Old URLs → new pages (308 permanent), and the bare domain → www. Each old URL on the bare domain
   * gets its own rule straight to the final address, so every redirect is a single hop.
   */
  async redirects() {
    const entries = redirectEntries();
    const onOldHost = entries.map((e) => ({
      source: e.source,
      has: [{ type: "host" as const, value: OLD_HOST }],
      destination: `https://${CANONICAL_HOST}${e.destination}`,
      permanent: true,
    }));
    return [
      ...onOldHost,
      ...entries.map((e) => ({ ...e, permanent: true })),
      { source: "/:path*", has: [{ type: "host" as const, value: OLD_HOST }], destination: `https://${CANONICAL_HOST}/:path*`, permanent: true },
    ];
  },
};

export default nextConfig;
