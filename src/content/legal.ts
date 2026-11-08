/**
 * Business details for the legal pages. Fill these in when confirmed (docs/phase-2/11).
 * While `address` is null, legal pages show a visible "awaiting final details" notice,
 * and the launch checklist blocks go-live.
 */
export const legal = {
  operator: "Ralph Lawal, trading as Ralph Lawal Group",
  /** Geographic business address required by e-commerce disclosure rules. Not invented: supply the real one. */
  address: null as string | null,
  /** CRO business-name registration number, once registered. */
  businessNameNumber: null as string | null,
  /** Only if VAT-registered. */
  vatNumber: null as string | null,
  lastUpdated: "8 November 2026",
} as const;

export const legalComplete = () => legal.address !== null;
