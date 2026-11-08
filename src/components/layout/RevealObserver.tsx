"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Adds `.in` to `.reveal` elements once they enter the viewport.
 * Without JavaScript the `.js` class never appears, so nothing is hidden.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
