export type ArtworkCategory = "illustration" | "concept" | "miniature";

export interface NavItem { label: string; href: string }
export interface Artwork {
  id: string;
  title: string;
  category: ArtworkCategory;
  src: string;
  alt: string;
  orientation: "portrait" | "landscape" | "square";
}
export interface Project {
  id: string;
  title: string;
  description: string;
  cover: string;
  logo?: string;
}
export interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
  orientation: "portrait" | "landscape" | "square";
}

export const navItems: NavItem[] = [
  { label: "Projects", href: "/" },
  { label: "Illustrations", href: "/illustrations" },
  { label: "Contact", href: "/contact" },
];

export const projects: Project[] = [
  { id: "cozy-tiny-home", title: "Cozy Tiny Home", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/art/hero-observatory.png" },
  { id: "cottonville", title: "Cottonville", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/portfolio/projects/cottonville/cover/cover.png", logo: "/portfolio/projects/cottonville/logo/logo.png" },
  { id: "neko-gelato", title: "Neko Gelato", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/art/celestial-keys.png" },
  { id: "cozy-packing", title: "Cozy Packing", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/art/spiral-library.png" },
  { id: "summer-unpacked", title: "Summer Unpacked", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/art/botanical-alchemist.png" },
  { id: "cozy-cooking", title: "Cozy Cooking", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/art/moon-tea.png" },
  { id: "love-elysium", title: "Love Elysium", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/art/hero-moth.png" },
  { id: "hentai-golf", title: "Hentai Golf", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/art/quiet-orrery.png" },
  { id: "hentai-fantasy", title: "Hentai Fantasy", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/art/thorn-road.png" },
  { id: "hentai-girls", title: "Hentai Girls", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/art/tiny-observatory.png" },
];

export const artworks: Artwork[] = [
  { id: "moon-gardener", title: "The Moon Gardener", category: "illustration", src: "/art/moon-gardener.png", alt: "A moon gardener tending luminous irises in a glass conservatory", orientation: "portrait" },
  { id: "quiet-orrery", title: "The Quiet Orrery", category: "illustration", src: "/art/quiet-orrery.png", alt: "An antique brass orrery floating over a dark reflective pool", orientation: "landscape" },
  { id: "thorn-road", title: "The Thorn Road", category: "illustration", src: "/art/thorn-road.png", alt: "A cloaked traveler carrying a crescent lantern through silver thorn trees", orientation: "portrait" },
  { id: "celestial-keys", title: "Keys to the Firmament", category: "concept", src: "/art/celestial-keys.png", alt: "Three ornate celestial keys arranged around an eclipse", orientation: "square" },
  { id: "spiral-library", title: "A Library After Midnight", category: "concept", src: "/art/spiral-library.png", alt: "A moonlit library spiraling into a star-filled dome", orientation: "landscape" },
  { id: "botanical-alchemist", title: "Botanical Alchemist", category: "concept", src: "/art/botanical-alchemist.png", alt: "A botanical alchemist holding a glass vessel with a moonlit flower", orientation: "portrait" },
  { id: "moon-tea", title: "Tea at Moonrise", category: "miniature", src: "/art/moon-tea.png", alt: "A tiny midnight tea table in a crescent moon garden", orientation: "square" },
  { id: "tiny-observatory", title: "The Stargazer's Workshop", category: "miniature", src: "/art/tiny-observatory.png", alt: "A tiny masked stargazer repairing a telescope in a dollhouse observatory", orientation: "square" },
];

const cottonvilleGallery: ProjectImage[] = ["01", "02", "03", "04", "05", "5", ...Array.from({ length: 27 }, (_, index) => String(index + 6).padStart(2, "0"))].map((file) => {
  const number = Number(file);
  return {
    src: `/portfolio/projects/cottonville/gallery/${file}.png`,
    alt: `Cottonville project artwork ${file}`,
    caption: "",
    orientation: number >= 13 && number <= 19 ? "square" as const : "landscape" as const,
  };
});

export const projectImages: Record<string, ProjectImage[]> = {
  observatory: [
    { src: "/art/hero-observatory.png", alt: "A ruined observatory beneath a luminous night sky", caption: "The observatory", orientation: "landscape" },
    { src: "/art/quiet-orrery.png", alt: "An antique brass orrery floating over dark water", caption: "Orrery study", orientation: "landscape" },
    { src: "/art/tiny-observatory.png", alt: "A tiny stargazer repairing a telescope", caption: "The stargazer's workshop", orientation: "square" },
    { src: "/art/hero-astronomer.png", alt: "An astronomer surrounded by celestial instruments", caption: "Keeper of the instruments", orientation: "landscape" },
  ],
  nocturne: [
    { src: "/art/moon-gardener.png", alt: "A moon gardener tending luminous irises", caption: "The Moon Gardener", orientation: "portrait" },
    { src: "/art/thorn-road.png", alt: "A cloaked traveler on a road of silver thorns", caption: "The Thorn Road", orientation: "portrait" },
    { src: "/art/hero-moth.png", alt: "A celestial moth drifting across a burgundy sky", caption: "Nocturne moth", orientation: "landscape" },
    { src: "/art/moon-tea.png", alt: "A midnight tea table in a crescent moon garden", caption: "Tea at Moonrise", orientation: "square" },
  ],
  firmament: [
    { src: "/art/celestial-keys.png", alt: "Three ornate celestial keys arranged around an eclipse", caption: "Final key set", orientation: "square" },
    { src: "/art/quiet-orrery.png", alt: "An antique brass orrery", caption: "Material and mechanism study", orientation: "landscape" },
    { src: "/art/botanical-alchemist.png", alt: "An alchemist holding a moonlit glass vessel", caption: "The key bearer", orientation: "portrait" },
  ],
  library: [
    { src: "/art/spiral-library.png", alt: "A moonlit library spiraling into a star-filled dome", caption: "The central archive", orientation: "landscape" },
    { src: "/art/hero-astronomer.png", alt: "A scholar studying celestial instruments", caption: "Night reader", orientation: "landscape" },
    { src: "/art/celestial-keys.png", alt: "Ornamental keys arranged on engraved paper", caption: "Archive keys", orientation: "square" },
    { src: "/art/thorn-road.png", alt: "A traveler approaching a distant moonlit place", caption: "Road to the archive", orientation: "portrait" },
  ],
  garden: [
    { src: "/art/botanical-alchemist.png", alt: "A botanical alchemist holding a moonlit flower", caption: "The botanist", orientation: "portrait" },
    { src: "/art/moon-gardener.png", alt: "A gardener among luminous flowers", caption: "Glasshouse at moonrise", orientation: "portrait" },
    { src: "/art/thorn-road.png", alt: "A silver thorn garden beneath the moon", caption: "Beyond the garden wall", orientation: "portrait" },
    { src: "/art/hero-moth.png", alt: "A celestial moth above dark flowers", caption: "Garden visitor", orientation: "landscape" },
  ],
  miniatures: [
    { src: "/art/moon-tea.png", alt: "A tiny midnight tea table in a crescent moon garden", caption: "Tea at Moonrise", orientation: "square" },
    { src: "/art/tiny-observatory.png", alt: "A dollhouse observatory with a tiny stargazer", caption: "Stargazer's workshop", orientation: "square" },
    { src: "/art/celestial-keys.png", alt: "Small celestial keys around an eclipse", caption: "Pocket firmament", orientation: "square" },
    { src: "/art/quiet-orrery.png", alt: "A quiet orrery reflected in black water", caption: "One quiet hour", orientation: "landscape" },
  ],
};

Object.assign(projectImages, {
  "cozy-tiny-home": projectImages.observatory,
  cottonville: cottonvilleGallery,
  "neko-gelato": projectImages.firmament,
  "cozy-packing": projectImages.library,
  "summer-unpacked": projectImages.garden,
  "cozy-cooking": projectImages.miniatures,
  "love-elysium": projectImages.nocturne,
  "hentai-golf": projectImages.observatory,
  "hentai-fantasy": projectImages.library,
  "hentai-girls": projectImages.garden,
});
