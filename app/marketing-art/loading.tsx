import { GallerySkeleton } from "@/components/GallerySkeleton";

export default function Loading() {
  return <main className="illustrations-page textured-section" aria-busy="true" aria-label="Loading marketing art">
    {/* Marketing art uses the two-column grid, not the masonry layout — see
        ArtworkGallery — so the placeholder has to match that geometry. */}
    <section className="illustrations-gallery"><GallerySkeleton layout="grid" count={8} /></section>
  </main>;
}
