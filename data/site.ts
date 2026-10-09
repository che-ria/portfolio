import { type ImageSize, imageSize } from "./image-size";
import { mediaUrl } from "./media";

export type { NavItem } from "./navigation";
export { navItems } from "./navigation";

export interface Project {
  id: string;
  title: string;
  description: string;
  cover: string;
  logo?: string;
  /** Height of the logo box on a card, as a percentage — see `logoBoxHeight`. */
  logoHeight?: number;
}

/**
 * One image in a gallery. `src` is already resolved through `mediaUrl`, so it
 * points at the CDN in production and at `public/` when no media base URL is
 * configured. Every field beyond `src`/`alt` is optional because these objects
 * are serialised into the RSC payload once per image — a project page carries
 * up to ~60 of them, so absent keys are bytes not sent.
 */
export interface ProjectImage {
  src: string;
  alt: string;
  /**
   * Intrinsic `[width, height]`, from the generated table in `image-size.ts`.
   * Absent only when the file could not be read from the bucket, in which case
   * the gallery falls back to a 4:3 placeholder box.
   */
  size?: ImageSize;
  caption?: string;
  sectionTitle?: string;
  centered?: boolean;
  fullWidth?: boolean;
  mature?: boolean;
}

type GalleryOptions = Record<string, Pick<ProjectImage, "sectionTitle" | "centered" | "fullWidth" | "mature">>;

const projectMeta = [
  { id: "cozy-tiny-home", title: "Cozy Tiny Home", cover: "cover/cover.jpg", logo: "logo/logo.png" },
  { id: "cottonville", title: "Cottonville", cover: "cover/cover.png", logo: "logo/logo.png" },
  { id: "neko-gelato", title: "Neko Gelato", cover: "cover/cover.png", logo: "logo/logo.png" },
  { id: "summer-unpacked", title: "Summer Unpacked", cover: "cover/cover.png", logo: "logo/Logo.png" },
  { id: "cozy-cooking", title: "Cozy Cooking", cover: "cover/cover.png", logo: "logo/logo.png" },
  { id: "love-elysium", title: "Love Elysium", cover: "cover/cover.png", logo: "logo/logo.png" },
  { id: "hentai-golf", title: "Hentai Golf", cover: "cover/cover.png", logo: "logo/logo.png" },
  { id: "hentai-girls", title: "Hentai Girls", cover: "cover/cover.png", logo: "logo/logo.png" },
] as const;

/**
 * How tall a card's logo box should be, as a percentage of the card.
 *
 * The box is a fixed share of the card wide, so `object-fit: contain` sizes a
 * wide wordmark by that width and a squarer mark by the box height instead — at
 * the flat 64% the box used to have, a square mark (Neko Gelato, Love Elysium)
 * came out half the width of a 2:1 one and read as an afterthought beside it.
 * Growing the box by `ar^-1/4` — 64% at 2:1, 76% at 1:1 — hands the squarer
 * marks back most of that width. It deliberately stops short of matching the
 * wide marks' *area*: on a 16:9 card that would take ~90% of the card height and
 * leave a square mark almost no margin above or below. Anything wider than 2:1
 * is pinned by the box width however short the box gets, so those are clamped at
 * 64% rather than allowed to trail off.
 */
const logoBoxHeight = (size: ImageSize | undefined) => size && Math.round(Math.max(64, 76 / (size[0] / size[1]) ** .25));

/**
 * Logos whose file carries a transparent margin the shape alone cannot reveal.
 * Love Elysium's mark covers 83% × 73% of its 2000 × 2000 canvas, so the box it
 * earns as a "square" logo is spent partly on empty pixels and the ink lands a
 * quarter shorter than Neko Gelato's. The box is grown until the two marks read
 * the same size; trim the canvas and this entry can go.
 */
const logoBoxOverride: Record<string, number> = { "love-elysium": 88 };

export const projects: Project[] = projectMeta.map(({ id, title, cover, logo }) => {
  const logoSrc = mediaUrl(`/portfolio/projects/${id}/${logo}`);
  return {
    id,
    title,
    description: "A selected portfolio project by Daryna Chernysheva.",
    cover: mediaUrl(`/portfolio/projects/${id}/${cover}`),
    logo: logoSrc,
    logoHeight: logoBoxOverride[id] ?? logoBoxHeight(imageSize(logoSrc)),
  };
});

const projectTitles = new Map<string, string>(projectMeta.map(({ id, title }) => [id, title]));

const gallery = (projectId: string, files: string[], options: GalleryOptions = {}): ProjectImage[] => files.map((file) => {
  const src = mediaUrl(`/portfolio/projects/${projectId}/gallery/${file}`);
  return { src, alt: `${projectTitles.get(projectId) ?? "Project"} artwork`, size: imageSize(src), ...options[file] };
});

const artwork = (folder: string, alt: string) => (file: string): ProjectImage => {
  const src = mediaUrl(`/portfolio/${folder}/${file}`);
  return { src, alt, size: imageSize(src) };
};

const numbered = (count: number, name: (index: number) => string) => Array.from({ length: count }, (_, index) => name(index));
const pad = (value: number) => String(value).padStart(2, "0");

export const artworks: ProjectImage[] = [
  "chrollo_2k.png", "miku_serafim_2k.png", "rei2k.png", "angel_devil_2k.jpg", "bomb23.jpg", "coco_2K.jpg", "fern2k.jpg", "frieren2k.jpg", "higuruma_2k.jpg", "maki2KK.png", "makima02_4k.jpg", "makima_2k.jpg", "makima_naked_2k.jpg", "reze2k.jpg", "yuki2k.jpg", "aponia.png", "ashaf.png", "final_no_type_small.png", "fu_xuan.png", "hua_cheng70.png", "inumaki.png", "itadori1.png", "kafka.png", "makima01.png", "maomao_jinshi1finish.png", "scara01.png", "Toji.png", "twins.png", "uqi_fanart.png", "yuta.png",
].map(artwork("illustrations", "Illustration by Daryna Chernysheva"));

export const marketingArtworks: ProjectImage[] = [
  "01_eShop_Banner.jpg", "02_Illustration01.png", "03_banner.png", "04_4k_companion_logo.png", "05_banner_eng.jpg", "06_eShop_Banner.jpg", "07_16x9.jpg", "08_cover.png", "09_new_banner01.png", "10_banner_eng (2).jpg", "11_16x9_eng.jpg", "12_banner_jap (2).jpg", "13_16x9 (3).jpg", "14_eShop_Banner (3).jpg", "15_17.jpg", "16_16x9.jpg", "17_banner_eng.jpg", "18_banner_eng.jpg", "18_red_panda.jpg", "19_sountrack.jpg", "20_eShop_Banner.jpg", "21_eShop_Banner.jpg", "22_16x9.jpg", "23_16x9.jpg", "24_eShop_Banner.jpg", "25_16x9.jpg", "26_1x1.png", "27_1x1_2.png", "28_1x1_discord.png", "29_3D_Generalist.png", "30_christmas_card.png", "31_easter02.png", "32_elemetals_eu.png", "33_giveaway.png", "34_grafika_konkursowa.png", "35_rdg_dogs.png", "36_SWMD_1x1.png", "37_RDG_lunar.png",
].map(artwork("marketing-art", "Marketing artwork by Daryna Chernysheva"));

export const projectImages: Record<string, ProjectImage[]> = {
  "cozy-tiny-home": gallery("cozy-tiny-home", ["01.avif", "02_room30.png", "03_room21.png", "04_pinkroom.png", "05_room25.png", "06_room09.png", "07_room27.png", "08_room04.png", "09_room01.png", "10_character2.png", "11_character3.png", "12_character.png", "13_character1.png", "14_character4.png", "15_bed.png", "16_bed1.png", "17_bed2.png", "18_cabinet.png", "19_cabinet1.png", "20_cabinet2.png", "21_carpet.png", "22_bath.png", "23_bath1.png", "24_bath2.png", "25_device.png", "26_device1.png", "27_device2.png", "28_door.png", "29_door1.png", "30_door2.png", "31_table.png", "32_table1.png", "33_table2.png", "34_DLC_room_christmas.png", "35_christmas.png", "36_christmas1.png", "37_DLC_room_winter.png", "38_winter.png", "39_winter1.png", "50_DLC_room_japan.png", "51_japan.png", "52_japan1.png", "53_japan2.png"], {
    "10_character2.png": { sectionTitle: "Game Assets" },
    "34_DLC_room_christmas.png": { sectionTitle: "Special Game Assets", centered: true },
    "37_DLC_room_winter.png": { centered: true },
    "50_DLC_room_japan.png": { centered: true },
  }),
  cottonville: gallery("cottonville", numbered(33, (index) => `${pad(index + 1)}.png`), {
    "05.png": { sectionTitle: "Game Assets" },
    "20.png": { sectionTitle: "Screens & UI Concepts" },
  }),
  "neko-gelato": gallery("neko-gelato", ["00_EkranPowitalny_eng.png", ...numbered(7, (index) => `${pad(index + 1)}_concepts_${pad(index + 1)}.png`)], {
    "01_concepts_01.png": { sectionTitle: "Game Assets" },
  }),
  "summer-unpacked": gallery("summer-unpacked", ["01_SM_01.png", "02_SM_02.png", "03_SM_03.png", "04_SM_04.png", "05_SM_05.png", "06_SM_12.png", "07_SM_06.png", "08_SM_11.png", "09_SM_08.png", "10_SM_10.png", "11_SM_07.png", "12_SM_13.png", "13_SM_09.png"], {
    "01_SM_01.png": { sectionTitle: "Level Concepts" },
  }),
  "cozy-cooking": gallery("cozy-cooking", numbered(6, (index) => `${pad(index + 1)}_cooking${pad(index + 1)}.png`), {
    "01_cooking01.png": { sectionTitle: "Game Assets" },
  }),
  "love-elysium": gallery("love-elysium", ["01_banner16x9_eng.jpg", "02_Illustration.png", "03_cover_final.png", "04_second_cover_final.png", "05_1.png", "06_2.png", "07_3.png", "08_4.png", "09_1.png", "10_2.png", "11_5.png", "12_6.png", "13_7.png", "14_8.png", "15_9.png", "16_10.png", "17_11.png", "18_1.png", "19_2.png", "20_3.png", "21_4.png", "22_5.png", "23_6.png", "24_7.png", "25_8.png", "26_5.png", "27_6.png", "28_9.png", "29_10.png", "30_11.png", "31_12.png", "32_15.png", "33_16.png", "34_17.png", "35_13.png", "36_14.png", "37_Eris_Aphrodite_School.png", "38_3.png", "39_4.png", "40_5.png", "41_6.png", "42_1.png", "43_2.png", "44_7.png", "45_8.png", "46_1.png", "47_2.png", "48_3.png", "49_4.png", "50_5.png", "51_6.png"], {
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
  "hentai-golf": gallery("hentai-golf", ["01_gf.png", ...numbered(18, (index) => `golf_${pad(index + 1)}.png`)], {
    "golf_01.png": { sectionTitle: "Game Illustrations" },
  }),
  "hentai-girls": gallery("hentai-girls", ["01_banner_eng.jpg", ...numbered(6, (index) => `HG_0${index + 1}.png`)], {
    "HG_01.png": { sectionTitle: "Game Illustrations" },
  }),
};
