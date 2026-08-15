/**
 * Placeholder geometry for a gallery that has not arrived yet.
 *
 * It reuses the real layout classes rather than approximating them, so the
 * skeleton tiles land in the same columns and gaps the artwork will occupy and
 * the page does not re-flow when the content replaces it. The ratios are a
 * fixed, deliberately uneven cycle: a column of identical rectangles reads as a
 * broken table, while a varied one reads as pictures about to appear.
 */
const RATIOS = [16 / 9, 3 / 4, 1, 4 / 3, 2 / 3, 16 / 10, 1, 3 / 4];

export function GallerySkeleton({ count = 9, layout = "grid", hero = false }: { count?: number; layout?: "grid" | "masonry"; hero?: boolean }) {
  return <div className={`project-gallery ${layout === "masonry" ? "is-masonry" : ""}`} aria-hidden="true">
    {Array.from({ length: count }, (_, index) => <span
      key={index}
      className={`project-shot ${hero && index === 0 ? "project-shot-hero" : ""}`}
    >
      <span className="project-shot-image is-skeleton" style={{ aspectRatio: hero && index === 0 ? 16 / 9 : RATIOS[index % RATIOS.length] }} />
    </span>)}
  </div>;
}
