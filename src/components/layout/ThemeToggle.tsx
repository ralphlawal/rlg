"use client";

import { useSyncExternalStore } from "react";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function setTheme(next: Theme) {
  const apply = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("rlg-theme", next);
    } catch {
      /* Storage can be unavailable (private mode). The choice still applies for this visit. */
    }
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "startViewTransition" in document) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
}

/** A real toggle button: announces "Dark theme, on/off" to screen readers. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme);
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className={`${styles.toggle} ${className ?? ""}`}
      aria-pressed={dark}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <span className="sr-only">Dark theme</span>
      <svg viewBox="0 0 20 20" aria-hidden="true" className={styles.icon}>
        <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 1.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />
      </svg>
    </button>
  );
}
