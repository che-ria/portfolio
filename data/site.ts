import { mediaUrl } from "./media";

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
  sectionTitle?: string;
  centered?: boolean;
  fullWidth?: boolean;
  mature?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Game Projects", href: "/" },
  { label: "Marketing Art", href: "/marketing-art" },
  { label: "Illustrations", href: "/illustrations" },
  { label: "Contact", href: "/contact" },
];

export const projects: Project[] = [
  { id: "cozy-tiny-home", title: "Cozy Tiny Home", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/portfolio/projects/cozy-tiny-home/cover/cover.jpg", logo: "/portfolio/projects/cozy-tiny-home/logo/logo.png" },
  { id: "cottonville", title: "Cottonville", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/portfolio/projects/cottonville/cover/cover.png", logo: "/portfolio/projects/cottonville/logo/logo.png" },
  { id: "neko-gelato", title: "Neko Gelato", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/portfolio/projects/neko-gelato/cover/cover.png", logo: "/portfolio/projects/neko-gelato/logo/logo.png" },
  { id: "cozy-packing", title: "Cozy Packing", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/portfolio/projects/cozy-packing/cover/cover.png", logo: "/portfolio/projects/cozy-packing/logo/logo.png" },
  { id: "summer-unpacked", title: "Summer Unpacked", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/portfolio/projects/summer-unpacked/cover/cover.png", logo: "/portfolio/projects/summer-unpacked/logo/Logo.png" },
  { id: "cozy-cooking", title: "Cozy Cooking", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/portfolio/projects/cozy-cooking/cover/cover.png", logo: "/portfolio/projects/cozy-cooking/logo/logo.png" },
  { id: "love-elysium", title: "Love Elysium", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/portfolio/projects/love-elysium/cover/cover.png", logo: "/portfolio/projects/love-elysium/logo/logo.png" },
  { id: "hentai-golf", title: "Hentai Golf", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/portfolio/projects/hentai-golf/cover/cover.png", logo: "/portfolio/projects/hentai-golf/logo/logo.png" },
  { id: "hentai-fantasy", title: "Hentai Fantasy", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/portfolio/projects/hentai-fantasy/cover/cover.png", logo: "/portfolio/projects/hentai-fantasy/logo/logo_eng.png" },
  { id: "hentai-girls", title: "Hentai Girls", description: "A selected portfolio project by Daryna Chernysheva.", cover: "/portfolio/projects/hentai-girls/cover/cover.png", logo: "/portfolio/projects/hentai-girls/logo/logo.png" },
];

export const artworks: Artwork[] = [
  ...["angel_devil_2k.jpg", "bomb23.jpg", "coco_2K.jpg", "fern2k.jpg", "frieren2k.jpg", "higuruma_2k.jpg", "maki2KK.png", "makima02_4k.jpg", "makima_2k.jpg", "makima_naked_2k.jpg", "reze2k.jpg", "yuki2k.jpg", "aponia.png", "ashaf.png", "final_no_type_small.png", "fu_xuan.png", "hua_cheng70.png", "inumaki.png", "itadori1.png", "kafka.png", "makima01.png", "maomao_jinshi1finish.png", "scara01.png", "Toji.png", "twins.png", "uqi_fanart.png", "yuta.png"].map((file) => ({
    id: file,
    title: file.replace(/[_-]/g, " ").replace(/\.[^.]+$/, ""),
    category: "illustration" as const,
    src: `/portfolio/illustrations/${file}`,
    alt: "Illustration by Daryna Chernysheva",
    orientation: ["fu_xuan.png", "hua_cheng70.png", "scara01.png"].includes(file) ? "landscape" as const : "portrait" as const,
  })),
];

export const marketingArtworks: Artwork[] = [
  "01_eShop_Banner.jpg", "02_Illustration01.png", "03_banner.png", "04_4k_companion_logo.png", "05_banner_eng.jpg", "06_eShop_Banner.jpg", "07_16x9.jpg", "08_cover.png", "09_new_banner01.png", "10_banner_eng (2).jpg", "11_16x9_eng.jpg", "12_banner_jap (2).jpg", "13_16x9 (3).jpg", "14_eShop_Banner (3).jpg", "15_17.jpg", "16_16x9.jpg", "17_banner_eng.jpg", "18_banner_eng.jpg", "18_red_panda.jpg", "19_sountrack.jpg", "20_eShop_Banner.jpg", "21_eShop_Banner.jpg", "22_16x9.jpg", "23_16x9.jpg", "24_eShop_Banner.jpg", "25_16x9.jpg", "26_1x1.png", "27_1x1_2.png", "28_1x1_discord.png", "29_3D_Generalist.png", "30_christmas_card.png", "31_easter02.png", "32_elemetals_eu.png", "33_giveaway.png", "34_grafika_konkursowa.png", "35_rdg_dogs.png", "36_SWMD_1x1.png", "37_RDG_lunar.png",
].map((file) => ({ id: file, title: file.replace(/[_-]/g, " ").replace(/\.[^.]+$/, ""), category: "illustration" as const, src: `/portfolio/marketing-art/${file}`, alt: "Marketing artwork by Daryna Chernysheva", orientation: "square" as const }));

for (const project of projects) {
  project.cover = mediaUrl(project.cover);
  if (project.logo) project.logo = mediaUrl(project.logo);
}

for (const artwork of [...artworks, ...marketingArtworks]) {
  artwork.src = mediaUrl(artwork.src);
}

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

const actualGallery = (projectId: string, files: string[], options: Record<string, Pick<ProjectImage, "sectionTitle" | "centered" | "fullWidth" | "mature">> = {}): ProjectImage[] => files.map((file) => ({
  src: `/portfolio/projects/${projectId}/gallery/${file}`,
  alt: `${projects.find((project) => project.id === projectId)?.title ?? "Project"} artwork`,
  caption: "",
  orientation: "landscape" as const,
  ...options[file],
}));

Object.assign(projectImages, {
  "cozy-tiny-home": actualGallery("cozy-tiny-home", ["01.avif", "02_room30.png", "03_room21.png", "04_pinkroom.png", "05_room25.png", "06_room09.png", "07_room27.png", "08_room04.png", "09_room01.png", "10_character2.png", "11_character3.png", "12_character.png", "13_character1.png", "14_character4.png", "15_bed.png", "16_bed1.png", "17_bed2.png", "18_cabinet.png", "19_cabinet1.png", "20_cabinet2.png", "21_carpet.png", "22_bath.png", "23_bath1.png", "24_bath2.png", "25_device.png", "26_device1.png", "27_device2.png", "28_door.png", "29_door1.png", "30_door2.png", "31_table.png", "32_table1.png", "33_table2.png", "34_DLC_room_christmas.png", "35_christmas.png", "36_christmas1.png", "37_DLC_room_winter.png", "38_winter.png", "39_winter1.png", "40_DLC_room_magic.png", "41_magic.png", "42_magic1.png", "43_DLC_room_spa.png", "44_spa.png", "45_spa1.png", "46_spa2.png", "47_DLC_room_pets.png", "48_pets.png", "49_pets1.png", "50_DLC_room_japan.png", "51_japan.png", "52_japan1.png", "53_japan2.png", "54_DLC_room_tropical.png", "55_tropical.png", "56_tropical1.png", "57_tropical2.png"], {
    "10_character2.png": { sectionTitle: "Game Assets" },
    "34_DLC_room_christmas.png": { sectionTitle: "Special Game Assets", centered: true },
    "37_DLC_room_winter.png": { centered: true },
    "40_DLC_room_magic.png": { centered: true },
    "43_DLC_room_spa.png": { centered: true },
    "47_DLC_room_pets.png": { centered: true },
    "50_DLC_room_japan.png": { centered: true },
    "54_DLC_room_tropical.png": { centered: true },
  }),
  cottonville: actualGallery("cottonville", Array.from({ length: 33 }, (_, index) => `${String(index + 1).padStart(2, "0")}.png`), {
    "05.png": { sectionTitle: "Game Assets" },
    "20.png": { sectionTitle: "Screens & UI Concepts" },
  }),
  "cozy-cooking": actualGallery("cozy-cooking", Array.from({ length: 6 }, (_, index) => `${String(index + 1).padStart(2, "0")}_cooking${String(index + 1).padStart(2, "0")}.png`), {
    "01_cooking01.png": { sectionTitle: "Game Assets" },
  }),
  "cozy-packing": actualGallery("cozy-packing", [...Array.from({ length: 12 }, (_, index) => `${String(index + 1).padStart(2, "0")}_concept_${index + 5}.png`), ...Array.from({ length: 4 }, (_, index) => `${String(index + 13).padStart(2, "0")}_concept_${index + 1}.png`), "17_menu.png", "18_controls.png", "19_pause.png", "20_settings.png"], {
    "02_concept_6.png": { sectionTitle: "Level Concepts" },
    "17_menu.png": { sectionTitle: "Screens & UI Concepts" },
  }),
  "neko-gelato": actualGallery("neko-gelato", ["00_EkranPowitalny_eng.png", ...Array.from({ length: 7 }, (_, index) => `${String(index + 1).padStart(2, "0")}_concepts_${String(index + 1).padStart(2, "0")}.png`)], {
    "01_concepts_01.png": { sectionTitle: "Game Assets" },
  }),
  "summer-unpacked": actualGallery("summer-unpacked", ["01_SM_01.png", "02_SM_02.png", "03_SM_03.png", "04_SM_04.png", "05_SM_05.png", "06_SM_12.png", "07_SM_06.png", "08_SM_11.png", "09_SM_08.png", "10_SM_10.png", "11_SM_07.png", "12_SM_13.png", "13_SM_09.png"], {
    "01_SM_01.png": { sectionTitle: "Level Concepts" },
  }),
  "hentai-girls": actualGallery("hentai-girls", ["01_banner_eng.jpg", ...Array.from({ length: 6 }, (_, index) => `HG_0${index + 1}.png`)], {
    "HG_01.png": { sectionTitle: "Game Illustrations" },
  }),
  "hentai-golf": actualGallery("hentai-golf", ["01_gf.png", ...Array.from({ length: 18 }, (_, index) => `golf_${String(index + 1).padStart(2, "0")}.png`)], {
    "golf_01.png": { sectionTitle: "Game Illustrations" },
  }),
  "hentai-fantasy": actualGallery("hentai-fantasy", ["01_banner_jap.jpg", "black_girl.png", "black_girl01.png", "black_girl02.png", "blue_girl.png", "blue_girl01.png", "blue_girl02.png", "red_girl.png", "red_girl01.png", "red_girl02.png", "x_menu.png"], {
    "black_girl.png": { sectionTitle: "Game Illustrations" },
  }),
  "love-elysium": actualGallery("love-elysium", ["01_banner16x9_eng.jpg", "02_Illustration.png", "03_cover_final.png", "04_second_cover_final.png", "05_1.png", "06_2.png", "07_3.png", "08_4.png", "09_1.png", "10_2.png", "11_5.png", "12_6.png", "13_7.png", "14_8.png", "15_9.png", "16_10.png", "17_11.png", "18_1.png", "19_2.png", "20_3.png", "21_4.png", "22_5.png", "23_6.png", "24_7.png", "25_8.png", "26_5.png", "27_6.png", "28_9.png", "29_10.png", "30_11.png", "31_12.png", "32_15.png", "33_16.png", "34_17.png", "35_13.png", "36_14.png", "37_Eris_Aphrodite_School.png", "38_3.png", "39_4.png", "40_5.png", "41_6.png", "42_1.png", "43_2.png", "44_7.png", "45_8.png", "46_1.png", "47_2.png", "48_3.png", "49_4.png", "50_5.png", "51_6.png"], {
    "02_Illustration.png": { fullWidth: true },
    "05_1.png": { sectionTitle: "Character Concepts - Eris" },
    "13_7.png": { centered: true },
    "14_8.png": { fullWidth: true },
    "15_9.png": { mature: true },
    "16_10.png": { mature: true },
    "17_11.png": { mature: true },
    "18_1.png": { sectionTitle: "Character Concepts - Aphrodite" },
    "30_11.png": { centered: true },
    "31_12.png": { fullWidth: true },
    "32_15.png": { mature: true },
    "33_16.png": { mature: true },
    "34_17.png": { mature: true },
    "35_13.png": { mature: true },
    "36_14.png": { centered: true, mature: true },
    "37_Eris_Aphrodite_School.png": { fullWidth: true },
    "38_3.png": { sectionTitle: "Character Concepts - Helen" },
    "46_1.png": { sectionTitle: "Character Concepts - Sota" },
  }),
});

for (const images of Object.values(projectImages)) {
  for (const image of images) image.src = mediaUrl(image.src);
}
