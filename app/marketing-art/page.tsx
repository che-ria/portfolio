import type { Metadata } from "next";
import { ArtworkGallery } from "@/components/ArtworkGallery";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = { title: "Marketing Art" };

export default function MarketingArtPage() {
  return <main id="content" className="illustrations-page textured-section"><section className="illustrations-gallery" aria-label="Marketing art"><ArtworkGallery collection="marketing" /></section><Footer /></main>;
}
