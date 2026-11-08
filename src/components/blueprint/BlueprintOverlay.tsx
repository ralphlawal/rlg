"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { contrastRatio, formatKB, observeVitals, pageWeight, structure, type Measured } from "./metrics";
import styles from "./Blueprint.module.css";
import "./blueprint-global.css";

const NOT_REPORTED = "Not reported by this browser";

export function BlueprintOverlay({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLElement>(null);
  const [vitals, setVitals] = useState<Measured | null>(null);
  const [snapshot, setSnapshot] = useState(() => read());

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-drawing", "");
    panelRef.current?.focus();
    const stop = observeVitals(setVitals);
    const refresh = () => setSnapshot(read());
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const themeObserver = new MutationObserver(refresh);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", refresh);
    window.addEventListener("keydown", onKey);
    const tick = window.setInterval(refresh, 2000);
    return () => {
      root.removeAttribute("data-drawing");
      stop();
      themeObserver.disconnect();
      window.removeEventListener("resize", refresh);
      window.removeEventListener("keydown", onKey);
      window.clearInterval(tick);
    };
  }, [onClose]);

  const rows: [string, string][] = [
    ["Largest paint (LCP)", vitals?.supported.lcp ? (vitals.lcp === null ? "Measuring…" : `${(vitals.lcp / 1000).toFixed(2)} s`) : NOT_REPORTED],
    ["Layout shift (CLS)", vitals?.supported.cls ? (vitals.cls ?? 0).toFixed(3) : NOT_REPORTED],
    ["Slowest interaction", vitals?.supported.inp ? (vitals.inp === null ? "Interact to measure" : `${Math.round(vitals.inp)} ms`) : NOT_REPORTED],
    ["Transferred", snapshot.weight.total ? formatKB(snapshot.weight.total) : "Not reported (cached)"],
    ["JavaScript", snapshot.weight.script ? formatKB(snapshot.weight.script) : "Not reported (cached)"],
    ["Requests", String(snapshot.weight.requests)],
    ["Grid", `${snapshot.cols} columns at ${snapshot.width} px`],
    ["Text contrast", `${snapshot.contrast.toFixed(1)} : 1 (${snapshot.theme} theme)`],
    ["Headings", `${snapshot.structure.headings}, with ${snapshot.structure.h1} h1`],
    ["Landmarks and regions", String(snapshot.structure.landmarks)],
    ["Images missing alt text", String(snapshot.structure.imagesWithoutAlt)],
  ];

  return createPortal(
    <>
      <div className={styles.grid} aria-hidden="true">
        <div className={`wrap ${styles.gridInner}`}>
          {Array.from({ length: snapshot.cols }, (_, i) => (
            <div key={i} className={`${styles.col} ${snapshot.cols === 12 && i < 2 ? styles.anno : ""}`} />
          ))}
        </div>
      </div>
      <section ref={panelRef} id="blueprint-panel" className={styles.panel} aria-labelledby="blueprint-title" tabIndex={-1}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close the drawing">
          ×
        </button>
        <p className="label">Blueprint · measured in your browser</p>
        <h2 id="blueprint-title" className={styles.title}>
          How this page is built
        </h2>
        <dl className={styles.list}>
          {rows.map(([k, v]) => (
            <div key={k} className={styles.row}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.note}>
          Hatched columns are the annotation column. Dashed outlines are this page’s real landmarks and headings, labelled
          with their HTML elements. Nothing here is estimated.
        </p>
      </section>
    </>,
    document.body,
  );
}

function read() {
  const root = document.documentElement;
  const css = getComputedStyle(root);
  const body = getComputedStyle(document.body);
  return {
    cols: parseInt(css.getPropertyValue("--cols"), 10) || 4,
    width: window.innerWidth,
    theme: root.dataset.theme === "dark" ? "dark" : "light",
    contrast: contrastRatio(body.color, body.backgroundColor),
    weight: pageWeight(),
    structure: structure(),
  };
}
