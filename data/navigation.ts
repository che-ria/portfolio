export interface NavItem { label: string; href: string }

/**
 * Kept apart from `site.ts` on purpose: `Header` and `Footer` are Client
 * Components, so anything they import is bundled for the browser. Importing the
 * navigation from the full catalogue module would ship every artwork path too.
 */
export const navItems: NavItem[] = [
  { label: "Game Projects", href: "/" },
  { label: "Marketing Art", href: "/marketing-art" },
  { label: "Illustrations", href: "/illustrations" },
  { label: "Contact", href: "/contact" },
];
