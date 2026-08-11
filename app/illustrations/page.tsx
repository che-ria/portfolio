import type { Metadata } from "next";
import { ArtworkGallery } from "@/components/ArtworkGallery";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = { title: "Illustrations" };

export default function IllustrationsPage() {
  return <main id="content" className="illustrations-page textured-section"><section className="illustrations-gallery"><ArtworkGallery /></section><Footer /></main>;
}
