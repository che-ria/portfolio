import { ProjectGallery } from "@/components/ProjectGallery";
import { artworks, marketingArtworks } from "@/data/site";

export function ArtworkGallery({ collection = "illustrations" }: { collection?: "illustrations" | "marketing" }) {
  const marketing = collection === "marketing";
  return <ProjectGallery images={marketing ? marketingArtworks : artworks} title={marketing ? "Marketing Art" : "Illustrations"} layout={marketing ? "grid" : "masonry"} />;
}
