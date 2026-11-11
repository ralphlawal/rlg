/**
 * Business details for the legal pages (docs/phase-2/11).
 * Address confirmed by the owner on 11 November 2026: Dublin, Ireland.
 * If `address` is ever set back to null, legal pages show an "awaiting final details" notice.
 */
export const legal = {
  operator: "Ralph Lawal, trading as Ralph Lawal Group",
  /** Geographic business address for e-commerce disclosure. Supplied by the owner. */
  address: "Dublin, Ireland" as string | null,
  /** CRO business-name registration number, once registered. */
  businessNameNumber: null as string | null,
  /** Only if VAT-registered. */
  vatNumber: null as string | null,
  lastUpdated: "11 November 2026",
} as const;

export const legalComplete = () => legal.address !== null;
