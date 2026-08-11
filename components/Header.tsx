"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/data/site";

export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => href === "/"
    ? pathname === "/" || pathname.startsWith("/projects/")
    : pathname === href;

  return <header className="site-header">
    <div className="header-main">
      <div className="header-brand">
        <Link className="portfolio-name" href="/" aria-label="Daryna Chernysheva — portfolio home">
          <span>Daryna</span><span>Chernysheva</span>
        </Link>
        <p className="header-tagline">welcome to my portfolio. let&apos;s work together!</p>
      </div>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return <Link key={item.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined} href={item.href}>{item.label}</Link>;
        })}
      </nav>
    </div>
  </header>;
}
