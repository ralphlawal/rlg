/**
 * Real measurements from the visitor's browser. Nothing is estimated:
 * when a browser doesn't report a metric, we say so.
 */

export type Measured = {
  lcp: number | null;
  cls: number | null;
  inp: number | null;
  supported: { lcp: boolean; cls: boolean; inp: boolean };
};

type ShiftEntry = PerformanceEntry & { value: number; hadRecentInput: boolean };
type EventEntry = PerformanceEntry & { interactionId?: number };

export function observeVitals(onUpdate: (m: Measured) => void): () => void {
  const m: Measured = { lcp: null, cls: null, inp: null, supported: { lcp: false, cls: false, inp: false } };
  const observers: PerformanceObserver[] = [];
  const supported = typeof PerformanceObserver !== "undefined" ? PerformanceObserver.supportedEntryTypes ?? [] : [];

  const watch = (type: string, handle: (list: PerformanceObserverEntryList) => void, extra: Record<string, unknown> = {}) => {
    if (!supported.includes(type)) return false;
    const po = new PerformanceObserver((list) => {
      handle(list);
      onUpdate({ ...m });
    });
    po.observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
    observers.push(po);
    return true;
  };

  m.supported.lcp = watch("largest-contentful-paint", (list) => {
    const entries = list.getEntries();
    m.lcp = entries[entries.length - 1]?.startTime ?? m.lcp;
  });
  m.supported.cls = watch("layout-shift", (list) => {
    for (const e of list.getEntries() as ShiftEntry[]) if (!e.hadRecentInput) m.cls = (m.cls ?? 0) + e.value;
  });
  if (m.supported.cls && m.cls === null) m.cls = 0;
  m.supported.inp = watch(
    "event",
    (list) => {
      for (const e of list.getEntries() as EventEntry[]) {
        if (e.interactionId && (m.inp === null || e.duration > m.inp)) m.inp = e.duration;
      }
    },
    { durationThreshold: 16 },
  );

  onUpdate({ ...m });
  return () => observers.forEach((o) => o.disconnect());
}

export function pageWeight() {
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  let total = nav?.transferSize ?? 0;
  let script = 0;
  for (const r of resources) {
    total += r.transferSize || 0;
    if (r.initiatorType === "script" || r.name.endsWith(".js")) script += r.transferSize || 0;
  }
  return { total, script, requests: resources.length + 1 };
}

function luminance(rgb: string) {
  const parts = rgb.match(/\d+(\.\d+)?/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
  const [r, g, b] = parts.map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function structure() {
  return {
    h1: document.querySelectorAll("h1").length,
    headings: document.querySelectorAll("h1,h2,h3,h4").length,
    landmarks: document.querySelectorAll("header,nav,main,footer,aside,[role=region],section[aria-labelledby]").length,
    images: document.images.length,
    imagesWithoutAlt: Array.from(document.images).filter((img) => !img.hasAttribute("alt")).length,
  };
}

export const formatKB = (bytes: number) => `${Math.round(bytes / 1024)} KB`;
