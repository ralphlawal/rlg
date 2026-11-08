/** Lets wide tables scroll on small screens instead of widening the page. Focusable so keyboards can scroll it. */
export function TableWrap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="table-wrap" role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  );
}
