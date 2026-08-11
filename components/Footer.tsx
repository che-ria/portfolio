import Link from "next/link";

export function Footer() {
  return <footer className="site-footer"><p>© Daryna Chernysheva</p><nav aria-label="Footer"><Link href="/">Projects</Link><Link href="/illustrations">Illustrations</Link><Link href="/contact">Contact</Link></nav></footer>;
}
