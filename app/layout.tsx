import type { Metadata } from "next";
import { Barrio, Sour_Gummy } from "next/font/google";
import { BackToTop } from "@/components/BackToTop";
import { Header } from "@/components/Header";
import "./globals.css";

const barrio = Barrio({ subsets: ["latin"], variable: "--font-barrio", weight: "400", display: "swap" });
const sourGummy = Sour_Gummy({ subsets: ["latin"], variable: "--font-sour-gummy", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Daryna Chernysheva — Portfolio", template: "%s — Daryna Chernysheva" },
  description: "The project and illustration portfolio of Daryna Chernysheva.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body className={`${barrio.variable} ${sourGummy.variable}`}><a className="skip-link" href="#content">Skip to content</a><Header />{children}<BackToTop /></body></html>;
}
