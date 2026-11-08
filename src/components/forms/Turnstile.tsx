"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string };
  }
}

/**
 * Cloudflare Turnstile, only when a site key is configured. The script loads when the form
 * first comes into view, never on page load for other visitors. Renders nothing otherwise.
 */
export function Turnstile() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const render = () => window.turnstile?.render(el, { sitekey: SITE_KEY, appearance: "interaction-only", theme: "auto" });
      if (window.turnstile) return void render();
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (!SITE_KEY) return null;
  return <div ref={ref} />;
}
