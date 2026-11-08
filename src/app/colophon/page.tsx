import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { Block } from "@/components/ui/Block";
import styles from "@/components/ui/pages.module.css";

export const metadata: Metadata = {
  title: "Colophon: How This Site Is Built",
  description: "The stack, performance budget, accessibility checks, privacy choices and design reasoning behind this website.",
  alternates: { canonical: "/colophon" },
};

/**
 * Facts only. Performance figures are added after measurement on the production deployment;
 * until then this page states targets as targets.
 */
export default function ColophonPage() {
  return (
    <>
      <PageIntro
        label="Colophon"
        title="How this site is built."
        lead="For the curious. Our website is one of the clearest examples of how we work, so here is what’s underneath it."
      />

      <Block n="01" title="Design" id="design">
        <div className={styles.prose}>
          <p>
            The idea is the working drawing: the stage where an idea becomes something that can be built. It shows up as
            discipline rather than decoration: numbered sections, a strict 12-column grid with an annotation column, and small
            mono labels that only appear when they say something true.
          </p>
          <p>
            Everything is black and white, with neutral greys. The only colour on the site comes from real product screenshots.
            Both themes are tuned separately; the dark theme’s greys sit a step brighter, because grey text on black reads
            weaker than the same contrast on white.
          </p>
          <p>
            Type: Instrument Sans for headlines and text, using its width axis for large display sizes; Instrument Serif for
            longer editorial passages; JetBrains Mono for labels. All three are served from this site, not from a third party.
          </p>
        </div>
      </Block>

      <Block n="02" title="Engineering" id="engineering">
        <ul className={styles.list}>
          <li>Next.js with React Server Components and strict TypeScript. Most pages are generated ahead of time as static HTML.</li>
          <li>JavaScript runs only where it does something: the theme toggle, the menu, the forms, Scope Sketch and the drawing view.</li>
          <li>The enquiry form works without JavaScript. Validation runs in the browser and again on the server, with the same rules.</li>
          <li>Scope Sketch is a set of plain, tested rules. No AI, no prices.</li>
          <li>Unit tests and end-to-end browser tests run on phone and desktop sizes, with and without JavaScript.</li>
        </ul>
      </Block>

      <Block n="03" title="Performance" id="performance">
        <div className={styles.prose}>
          <p>
            Targets: largest content painted within 2.5 seconds, layout shift below 0.1 and interactions answered within 200
            milliseconds, measured on mobile. The largest element on the homepage is text, so it can appear as soon as the font
            arrives.
          </p>
          <p>
            You can check this page for yourself: choose <strong>View the drawing</strong> in the footer to see the grid, the
            page’s structure, and the figures measured by your own browser.
          </p>
        </div>
      </Block>

      <Block n="04" title="Accessibility" id="accessibility">
        <div className={styles.prose}>
          <p>
            We aim for WCAG 2.2 AA: keyboard access everywhere, visible focus, a skip link, real form labels and error
            messages, text contrast checked in both themes, and no motion for people who ask their device to reduce it.
          </p>
          <p>
            Automated checks help, but they don’t prove accessibility, so we also test by hand. If something doesn’t work for
            you, please tell us at <a href="mailto:hello@ralphlawalgroup.com">hello@ralphlawalgroup.com</a>.
          </p>
        </div>
      </Block>

      <Block n="05" title="Privacy" id="privacy">
        <div className={styles.prose}>
          <p>
            No advertising or analytics cookies, so no cookie banner. Third-party code loads only when you use the feature that
            needs it. Your Scope Sketch stays in your browser until you choose to send it.
          </p>
        </div>
      </Block>
    </>
  );
}
