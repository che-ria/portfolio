import { ProjectGallery } from "@/components/ProjectGallery";
import { artworks, marketingArtworks, type Artwork } from "@/data/site";

const asGalleryImages = (items: Artwork[]) => items.map((item) => ({
  src: item.src,
  alt: item.alt,
  caption: "",
  orientation: item.orientation,
}));

export function ArtworkGallery({ collection = "illustrations" }: { collection?: "illustrations" | "marketing" }) {
  const items = collection === "marketing" ? marketingArtworks : artworks;
  return <ProjectGallery images={asGalleryImages(items)} title={collection === "marketing" ? "Marketing Art" : "Illustrations"} layout={collection === "illustrations" ? "masonry" : "grid"} />;
}
