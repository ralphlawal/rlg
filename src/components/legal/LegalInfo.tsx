import { legal, legalComplete } from "@/content/legal";
import { site } from "@/content/site";
import styles from "./legal.module.css";

/** The operator block shown on every legal page, plus an honest notice while details are missing. */
export function LegalInfo() {
  return (
    <>
      {!legalComplete() ? (
        <p className={styles.pending} role="note">
          This page is awaiting final business details (a postal address) before publication.
        </p>
      ) : null}
      <dl className={styles.info}>
        <div>
          <dt>Operated by</dt>
          <dd>{legal.operator}</dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd>{legal.address ?? site.location}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </dd>
        </div>
        {legal.businessNameNumber ? (
          <div>
            <dt>Business name registration</dt>
            <dd>{legal.businessNameNumber}</dd>
          </div>
        ) : null}
        {legal.vatNumber ? (
          <div>
            <dt>VAT</dt>
            <dd>{legal.vatNumber}</dd>
          </div>
        ) : null}
        <div>
          <dt>Last updated</dt>
          <dd>{legal.lastUpdated}</dd>
        </div>
      </dl>
    </>
  );
}
