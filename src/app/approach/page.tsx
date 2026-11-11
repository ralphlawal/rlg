import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { Block } from "@/components/ui/Block";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { stages } from "@/content/home";
import { Glyph } from "@/components/drawings/Drawing";
import { glyphKey } from "@/components/drawings/glyphs";
import { cta } from "@/content/site";
import styles from "@/components/ui/pages.module.css";

export const metadata: Metadata = {
  title: "How We Work",
  description:
    "Our process from first conversation to launch and beyond: understand, shape, build, run. Plus technical consulting and modernisation.",
  alternates: { canonical: "/approach" },
};

const detail: Record<string, string> = {
  Understand:
    "A first conversation, then a short discovery: the people who’ll use the product, the business it has to support, the constraints you’re working within, and what success looks like after launch. We’ll say plainly if we think you don’t need what you came in asking for.",
  Shape:
    "We sketch the main journeys, design the key screens with real content, and decide the architecture: what’s built, what’s bought, and where data lives. Changing a drawing is cheap; changing a database in production is not, so this stage carries the most weight.",
  Build:
    "Work happens in short cycles, each ending with something you can use in a private preview. Automated tests, security checks and accessibility reviews run as we go, so quality isn’t a final phase that gets squeezed.",
  Run:
    "Launch includes app store submissions, monitoring, backups and the dull, essential checks. After launch, real use shows what to improve next. We can keep running and improving the product, or hand it over with documentation, as agreed in your contract.",
};

export default function ApproachPage() {
  return (
    <>
      <PageIntro
        label="Approach"
        title="How we work, and what you can expect from us."
        lead="Good software comes from a clear process and honest conversations. Here is ours."
      />

      {stages.map((s, i) => (
        <Block key={s.name} n={String(i + 1).padStart(2, "0")} title={s.name} id={s.name.toLowerCase()}>
          <div className={styles.withFigure}>
          <div className={styles.prose}>
            <p>{detail[s.name]}</p>
            <p>
              <span className="label">You get</span>
              <br />
              <span style={{ color: "var(--fg)" }}>{s.get}</span>
            </p>
          </div>
          <div className="reveal">
            <Glyph name={glyphKey(s.name)} size={88} />
          </div>
          </div>
        </Block>
      ))}

      <Block n="05" title="Ways to work with us" id="engagement">
        <div className={`${styles.cols} ${styles.cols3}`}>
          <div>
            <h3>A defined project</h3>
            <p>
              A clear scope, agreed deliverables and a fixed quote. Best when you know what you need: a new website, an
              integration, a specific feature.
            </p>
          </div>
          <div>
            <h3>A phased build</h3>
            <p>
              A first release, then further phases planned around what real users teach us. Best for new products, where
              the right version two only becomes clear after version one.
            </p>
          </div>
          <div>
            <h3>Ongoing support</h3>
            <p>
              A monthly arrangement for maintenance, security updates, improvements and advice. Best once a product is live
              and needs looking after.
            </p>
          </div>
        </div>
        <div className={styles.prose} style={{ marginTop: 32 }}>
          <p>
            Every engagement is agreed in writing: scope, price, timing, ownership, licensing and handover. Not sure which
            fits? That’s exactly what the free discovery call is for.
          </p>
        </div>
      </Block>

      <Block n="06" title="Technical consulting and modernisation" id="consulting">
        <div className={styles.prose}>
          <p>
            Sometimes you need judgement more than code: a review of an architecture before you commit to it, a plan for
            an ageing system, or a technical voice in the room for a non-technical founder.
          </p>
          <p>
            We offer short, fixed-scope reviews that end with a written report and a prioritised plan: what to fix now,
            what can wait, and what it would take.
          </p>
        </div>
      </Block>

      <Block n="07" title="What we ask of you" id="ask">
        <div className={styles.prose}>
          <p>
            A named decision-maker, honest feedback on each preview, and access to the people who’ll use the product.
            That’s what makes projects go well.
          </p>
        </div>
      </Block>

      <Block n="08" title="What you can expect from us" id="expect">
        <ul className={styles.list}>
          <li>Straight answers, including “you don’t need this”.</li>
          <li>Written estimates, with the assumptions stated.</li>
          <li>Access to work in progress throughout the project.</li>
          <li>Ownership, licensing, deliverables and handover agreed in writing, project by project.</li>
          <li>Security and data protection treated as part of the job.</li>
        </ul>
        <div className={styles.actions}>
          <ButtonLink href={cta.primary.href} arrow>
            {cta.primary.label}
          </ButtonLink>
          <ButtonLink href={cta.call.href} variant="text">
            {cta.call.label}
          </ButtonLink>
        </div>
      </Block>
    </>
  );
}
