"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import styles from "./Blueprint.module.css";

type OverlayProps = { onClose: () => void };

/**
 * "View the drawing": reveals the page's real grid, structure and measured performance.
 * The overlay's code (and its CSS) loads only when first opened. Also opens with ?drawing in the URL.
 */
export function BlueprintToggle() {
  const [open, setOpen] = useState(false);
  const [Overlay, setOverlay] = useState<ComponentType<OverlayProps> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const show = useCallback(async () => {
    if (!Overlay) {
      const mod = await import("./BlueprintOverlay");
      setOverlay(() => mod.BlueprintOverlay);
    }
    setOpen(true);
  }, [Overlay]);

  const hide = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  // Opens automatically with ?drawing in the URL (shareable). State is set once the code has loaded.
  useEffect(() => {
    if (!/[?&]drawing\b/.test(window.location.search)) return;
    let cancelled = false;
    void import("./BlueprintOverlay").then((mod) => {
      if (cancelled) return;
      setOverlay(() => mod.BlueprintOverlay);
      setOpen(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.toggle}
        aria-pressed={open}
        aria-controls={open ? "blueprint-panel" : undefined}
        onClick={() => (open ? hide() : void show())}
      >
        View the drawing
      </button>
      {open && Overlay ? <Overlay onClose={hide} /> : null}
    </>
  );
}
