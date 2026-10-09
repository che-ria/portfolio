import { GallerySkeleton } from "@/components/GallerySkeleton";

export default function Loading() {
  return <main className="project-page" aria-busy="true" aria-label="Loading project">
    <div className="project-switcher">
      <span />
      <span className="skeleton-heading is-skeleton" />
      <span />
    </div>
    <GallerySkeleton count={9} hero />
  </main>;
}
