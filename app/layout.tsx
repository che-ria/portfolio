import type { Metadata } from "next";
import { Barrio, Sour_Gummy } from "next/font/google";
import { BackToTop } from "@/components/BackToTop";
import { Header } from "@/components/Header";
import { MatureGateProvider } from "@/components/MatureGate";
import { siteUrl } from "@/data/site-url";
import "./globals.css";

const barrio = Barrio({ subsets: ["latin"], variable: "--font-barrio", weight: "400", display: "swap" });
const sourGummy = Sour_Gummy({ subsets: ["latin"], variable: "--font-sour-gummy", display: "swap" });

const title = "Daryna Chernysheva — Portfolio";
const description = "The project and illustration portfolio of Daryna Chernysheva, 2D artist and illustrator.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s — Daryna Chernysheva" },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Daryna Chernysheva", title, description, url: "/" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The mature-content gate wraps the whole app rather than each gallery: its
  // answer is one decision for the tab, and mounting it here means moving
  // between pages — which is client-side — never asks the viewer twice.
  return <html lang="en" data-scroll-behavior="smooth"><body className={`${barrio.variable} ${sourGummy.variable}`}><a className="skip-link" href="#content">Skip to content</a><MatureGateProvider><Header />{children}<BackToTop /></MatureGateProvider></body></html>;
}
