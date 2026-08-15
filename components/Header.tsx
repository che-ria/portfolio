"use client";

import Link from "next/link";
import Image from "next/image";
import { mediaUrl } from "@/data/media";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/data/site";

export function Header() {
  const pathname = usePathname();
  const [selectedHref, setSelectedHref] = useState<string | null>(null);
  const [portraitUnavailable, setPortraitUnavailable] = useState(false);
  const pathnameHref = pathname === "/" || pathname.startsWith("/projects/") ? "/" : pathname;

  return <header className="site-header">
    <p className="welcome-strip">welcome to my portfolio <span aria-hidden="true">•</span> let&apos;s work together!</p>
    <div className="header-main">
      <div className="header-brand">
        <div className="profile-avatar" aria-label="Artist portrait">
          {portraitUnavailable ? <span aria-hidden="true">D</span> : <Image src={mediaUrl("/portfolio/profile/icon.png")} alt="Daryna Chernysheva" width={160} height={160} onError={() => setPortraitUnavailable(true)} />}
        </div>
        <div>
          <Link className="portfolio-name" href="/" aria-label="Daryna Chernysheva — portfolio home">
            <span>Daryna</span><span>Chernysheva</span>
          </Link>
          <p className="header-tagline">2D Artist <span aria-hidden="true">|</span> Illustrator</p>
        </div>
      </div>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const active = (selectedHref ?? pathnameHref) === item.href;
          return <Link key={item.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined} href={item.href} onClick={() => setSelectedHref(item.href)}>{item.label}</Link>;
        })}
      </nav>
    </div>
  </header>;
}
