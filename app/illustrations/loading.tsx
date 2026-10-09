import { GallerySkeleton } from "@/components/GallerySkeleton";

export default function Loading() {
  return <main className="illustrations-page" aria-busy="true" aria-label="Loading illustrations">
    <section className="illustrations-gallery"><GallerySkeleton layout="masonry" count={12} /></section>
  </main>;
}
