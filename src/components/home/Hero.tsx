import { ButtonLink } from "@/components/ui/ButtonLink";
import { heroNotes } from "@/content/home";
import { cta } from "@/content/site";
import { HeroFigure } from "@/components/drawings/Figures";
import styles from "./home.module.css";

/**
 * The headline reads as a complete sentence on its own. The two footnotes add the detail:
 * what counts as an idea, and what "execution" covers. Linked both ways, keyboard reachable.
 */
export function Hero() {
  return (
    <section className={`wrap ${styles.hero}`} aria-labelledby="hero-title" data-el="<section> hero">
      <div className="grid">
        <h1 id="hero-title" className={`display-xl ${styles.heroTitle}`} data-el="<h1>">
          Ideas
          <sup>
            <a href="#n1" id="r1" aria-describedby="hero-notes-title">
              1
            </a>
          </sup>{" "}
          deserve better execution.
          <sup>
            <a href="#n2" id="r2" aria-describedby="hero-notes-title">
              2
            </a>
          </sup>
        </h1>
        <div className={styles.heroCopy}>
          <p className="lead">
            Ralph Lawal Group designs and builds mobile apps, web platforms, AI systems and custom software for businesses
            that need them to work properly, not just look finished.
          </p>
          <div className={styles.heroActions}>
            <ButtonLink href={cta.primary.href} arrow>
              {cta.primary.label}
            </ButtonLink>
            <ButtonLink href={cta.secondary.href} variant="text">
              {cta.secondary.label}
            </ButtonLink>
          </div>
        </div>
        <HeroFigure className={styles.heroFigure} />
        <h2 id="hero-notes-title" className="sr-only">
          Footnotes
        </h2>
        <ol className={styles.notes} aria-labelledby="hero-notes-title">
          {heroNotes.map((note, i) => (
            <li key={note.id} id={note.id}>
              <span className={styles.noteNum}>{i + 1}</span>
              <span>
                {note.text}{" "}
                <a className={styles.back} href={`#r${i + 1}`} aria-label={`Back to footnote ${i + 1} in the headline`}>
                  ↩
                </a>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
