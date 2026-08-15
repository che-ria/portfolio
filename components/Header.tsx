"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { mediaUrl } from "@/data/media";
import { navItems } from "@/data/navigation";

export function Header() {
  const pathname = usePathname();
  const [pending, setPending] = useState<{ href: string; from: string } | null>(null);
  const [portraitUnavailable, setPortraitUnavailable] = useState(false);
  const pathnameHref = pathname === "/" || pathname.startsWith("/projects/") ? "/" : pathname;

  // The clicked link is highlighted immediately, but only while the router is
  // still on the page the click came from. Once the pathname settles it wins on
  // its own, so a later navigation from anywhere else (a footer link, a project
  // card, the back button) can no longer leave the old link highlighted.
  const activeHref = pending?.from === pathname ? pending.href : pathnameHref;

  return <header className="site-header">
    <p className="welcome-strip">welcome to my portfolio <span aria-hidden="true">•</span> let&apos;s work together!</p>
    <div className="header-main">
      <div className="header-brand">
        <div className="profile-avatar" aria-label="Artist portrait">
          {portraitUnavailable ? <span aria-hidden="true">D</span> : <Image src={mediaUrl("/portfolio/profile/icon.png")} alt="Daryna Chernysheva" width={160} height={160} sizes="112px" onError={() => setPortraitUnavailable(true)} />}
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
          const active = activeHref === item.href;
          return <Link key={item.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined} href={item.href} onClick={() => setPending({ href: item.href, from: pathname })}>{item.label}</Link>;
        })}
      </nav>
    </div>
  </header>;
}
