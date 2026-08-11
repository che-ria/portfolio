import type { Metadata } from "next";
import { Sulphur_Point } from "next/font/google";
import "@fontsource/sn-pro/200.css";
import "@fontsource/sn-pro/600.css";
import { BackToTop } from "@/components/BackToTop";
import { Header } from "@/components/Header";
import "./globals.css";

const display = Sulphur_Point({ subsets: ["latin"], variable: "--font-display", weight: "700", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Daryna Chernysheva — Portfolio", template: "%s — Daryna Chernysheva" },
  description: "The project and illustration portfolio of Daryna Chernysheva.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body className={display.variable}><a className="skip-link" href="#content">Skip to content</a><Header />{children}<BackToTop /></body></html>;
}
