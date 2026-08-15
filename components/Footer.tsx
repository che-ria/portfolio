"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/data/site";

export function Footer() {
  const pathname = usePathname();

  return <footer className="site-footer">
    <nav aria-label="Footer navigation">
      {navItems.map((item) => <Link href={item.href} key={item.href} onClick={(event) => {
        if (pathname === item.href) {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}>{item.label}</Link>)}
    </nav>
    <p>© Daryna Chernysheva</p>
  </footer>;
}
