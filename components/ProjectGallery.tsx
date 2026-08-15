"use client";

import { FiAlertTriangle, FiArrowLeft, FiArrowRight, FiImage, FiMinus, FiPlus, FiX } from "react-icons/fi";
import { Fragment, memo, useCallback, useMemo, useState, type CSSProperties } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { LightboxCaption, LightboxImage, MatureLightboxPrompt } from "@/components/LightboxImage";
import { useMatureGate } from "@/components/MatureGate";
import { MediaImage } from "@/components/MediaImage";
import type { ProjectImage } from "@/data/site";

type Layout = "grid" | "masonry";

/** Shape assumed for the handful of images whose size could not be read. */
const FALLBACK_SIZE: [number, number] = [1600, 1200];

const sizeOf = (image: ProjectImage) => image.size ?? FALLBACK_SIZE;
const ratioOf = (image: ProjectImage) => { const [width, height] = sizeOf(image); return width / height; };

/**
 * A piece counts as wide when it is at least 3:2, which in the masonry layout
 * earns it two columns. The name check covers exports that are panoramic by
 * intent even when the canvas is not.
 *
 * This used to be measured in the browser from `onLoad`, which meant the whole
 * gallery re-flowed once per image as the downloads landed. The intrinsic sizes
 * now ship with the page, so the layout is final on the first paint.
 */
const isWide = (image: ProjectImage) => /(?:^|[_-])wide(?:[_.\-]|$)/i.test(image.src) || ratioOf(image) >= 1.5;

/**
 * How the collage packs.
 *
 * A plain column grid gives every tile in a row the height of the tallest one,
 * and the illustrations are 2:3 portraits with three panoramas and a square
 * among them — so each of those left half a column of white under its
 * neighbours. Masonry closes that, and the way to get real masonry without
 * measuring anything in the browser is to lay the grid out in rows a hundredth
 * of a column tall and give each tile a span computed from the intrinsic size
 * that already ships with the page.
 *
 * Both numbers are shared with `.project-gallery.is-masonry` in `globals.css`
 * and only mean the same thing while they agree. `GAP_SHARE` is the gutter as a
 * fraction of one column — 4% is the 1rem gutter the gallery already had at its
 * full 1220px width, expressed in a way that does not change with the column
 * count, which is what keeps one span correct at every breakpoint.
 */
const GAP_SHARE = 0.04;
const ROWS_PER_COLUMN = 100;

/**
 * Rows a tile occupies: its own height plus the gutter below it, measured in
 * column widths. Rounded up, so the error is at most one row — a few pixels of
 * extra gutter, never a tile clipped by the one beneath it.
 */
const rowSpan = (image: ProjectImage, wide: boolean) => {
  // A wide piece is two columns *and* the gutter between them.
  const width = wide ? 2 + GAP_SHARE : 1;
  return Math.ceil(ROWS_PER_COLUMN * (width / ratioOf(image) + GAP_SHARE));
};

/**
 * `sizes` has to describe the slot the image actually occupies, not the widest
 * slot in the gallery. The grid is `min(1220px, 100% - 3rem)` wide: two columns
 * on desktop, one below 700px. The masonry gallery is three columns above
 * 900px and two below, so a wide piece spanning two of them is roughly double
 * a normal tile. Overstating any of this makes the browser pick a 1920px or
 * 3840px candidate for a ~400px slot, which is the single largest source of
 * wasted bytes on these pages.
 *
 * Widths are given in px rather than `calc()`/fractional `vw`: next/image only
 * recognises a bare `<n>vw` token when trimming the srcset, so `calc(50vw - 1rem)`
 * makes it emit every candidate down to 32w — markup no browser can ever use.
 */
const tileSizes = (layout: Layout, spansFullWidth: boolean, wide: boolean) => {
  if (layout === "masonry") {
    return wide
      ? "(max-width: 700px) 100vw, (max-width: 900px) 780px, 810px"
      : "(max-width: 700px) 100vw, (max-width: 900px) 390px, 400px";
  }
  if (spansFullWidth) return "(max-width: 700px) 100vw, 1220px";
  return "(max-width: 700px) 100vw, 610px";
};

/**
 * Memoised so that opening the lightbox, or one tile finishing its download,
 * does not reconcile every other tile in a 57-image gallery.
 */
const GalleryTile = memo(function GalleryTile({ image, index, className, sizes, span, locked, onOpen }: {
  image: ProjectImage;
  index: number;
  className: string;
  sizes: string;
  /** Rows to occupy in the collage. Absent in the plain grid, which has none. */
  span?: number;
  /** Flagged mature and not yet confirmed: covered, and opening it asks first. */
  locked: boolean;
  onOpen: (index: number) => void;
}) {
  const [width, height] = sizeOf(image);

  return <button
    className={className}
    // Built here rather than passed in: a fresh object from the parent on every
    // render would defeat the memo this component exists for.
    style={span ? { "--span": span } as CSSProperties : undefined}
    onClick={() => onOpen(index)}
    aria-label={locked ? `Mature content, image ${index + 1}. Opens a confirmation first.` : `Open image ${index + 1}${image.caption ? `: ${image.caption}` : ""}`}
  >
    {/* The wrapper carries the artwork's real aspect ratio so the skeleton
        occupies exactly the space the image will take — the layout is settled
        before a single byte of artwork arrives. */}
    <span className="project-shot-image" style={{ aspectRatio: width / height }}>
      <MediaImage
        src={image.src}
        alt=""
        width={width}
        height={height}
        sizes={sizes}
        fallback={<span className="project-shot-missing" aria-hidden="true"><FiImage /></span>}
      />
    </span>
    {locked && <span className="mature-content-card-notice" aria-hidden="true"><FiAlertTriangle /><span>Mature Content</span><small>Click to confirm</small></span>}
    <span className="project-shot-caption" aria-hidden="true">{image.caption}</span>
  </button>;
});

export function ProjectGallery({ images, title, layout = "grid", featuredFirst = false }: { images: ProjectImage[]; title: string; layout?: Layout; featuredFirst?: boolean }) {
  // -1 is closed. Everything the viewer does once it is open — swipe, pinch,
  // wheel-zoom, arrow keys, Escape, the scroll lock, the focus trap and handing
  // focus back to the tile on close — belongs to the lightbox from here on.
  const [index, setIndex] = useState(-1);
  const { consent, confirm } = useMatureGate();
  const close = useCallback(() => setIndex(-1), []);

  // Opening a flagged tile asks before it shows anything. Once the viewer has
  // said yes the answer holds for the session, so this is a question they meet
  // once rather than on every piece.
  const open = useCallback(async (next: number) => {
    if (images[next]?.mature && consent !== "granted" && !(await confirm())) return;
    setIndex(next);
  }, [images, consent, confirm]);

  const wideFlags = useMemo(() => images.map(isWide), [images]);

  const slotSizes = useMemo(
    () => images.map((image, position) => tileSizes(layout, (featuredFirst && position === 0) || !!image.fullWidth, wideFlags[position])),
    [images, layout, featuredFirst, wideFlags],
  );

  const spans = useMemo(
    () => (layout === "masonry" ? images.map((image, position) => rowSpan(image, wideFlags[position])) : null),
    [images, layout, wideFlags],
  );

  const slides = useMemo(() => images.map((image, position) => {
    const [width, height] = sizeOf(image);
    // The tile's `sizes` travels with the slide so the lightbox can request the
    // exact candidate this image's tile already downloaded.
    return { src: image.src, alt: image.alt, width, height, tileSizes: slotSizes[position], caption: image.caption, mature: image.mature };
  }), [images, slotSizes]);

  const standaloneIndexes = useMemo(() => {
    if (layout !== "grid") return new Set<number>();
    const indexes = new Set<number>();
    let occupiedColumns = 0;
    images.forEach((image, position) => {
      if (image.sectionTitle || (featuredFirst && position === 0) || image.centered || image.fullWidth) occupiedColumns = 0;
      if (featuredFirst && position === 0 || image.centered || image.fullWidth) return;
      const next = images[position + 1];
      if (occupiedColumns === 0 && (!next || next.sectionTitle || next.centered)) indexes.add(position);
      occupiedColumns = (occupiedColumns + 1) % 2;
    });
    return indexes;
  }, [images, layout, featuredFirst]);

  const gallery = <div className={`project-gallery ${layout === "masonry" ? "is-masonry" : ""}`}>
    {images.map((image, position) => {
      const isHero = featuredFirst && position === 0;
      const locked = !!image.mature && consent !== "granted";
      return <Fragment key={`${image.src}-${position}`}>
        {image.sectionTitle && <h2 className="project-gallery-section-title">{image.sectionTitle}</h2>}
        <GalleryTile
          image={image}
          index={position}
          className={`project-shot ${isHero ? "project-shot-hero" : ""} ${image.fullWidth ? "is-full-width" : ""} ${image.centered || standaloneIndexes.has(position) ? "is-standalone" : ""} ${locked ? "is-mature" : ""} ${wideFlags[position] ? "is-wide" : "is-paired"}`}
          sizes={slotSizes[position]}
          span={spans?.[position]}
          locked={locked}
          onOpen={open}
        />
      </Fragment>;
    })}
  </div>;

  return <>
    {/* The collage measures its rows against its own width, which only a
        container query can express — and an element cannot query itself, hence
        the wrapper. It carries the gallery's width so `100cqw` is the width the
        columns are really laid out in. */}
    {layout === "masonry" ? <div className="project-collage">{gallery}</div> : gallery}
    <Lightbox
      open={index >= 0}
      index={index < 0 ? 0 : index}
      close={close}
      slides={slides}
      plugins={[Zoom]}
      className="project-lightbox"
      // The originals run to ~4000px, so tying the ceiling to one image pixel
      // per screen pixel would stop well short on a large display. Doubling it
      // keeps roughly the 4x reach the gallery had before, and the `sizes` in
      // `LightboxImage` fetches the detail to back it up.
      zoom={{ maxZoomPixelRatio: 2, scrollToZoom: true, pinchZoomV4: true }}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      // Padding has to be given here rather than in CSS: the library both writes
      // it into the slide's inline style and derives the rect it hands to
      // `render.slide` from the same number, so a CSS override would size the
      // artwork from a box wider than the one it is drawn in. A percentage is
      // what makes it responsive — it resolves against the container width in
      // JavaScript exactly as it does in CSS.
      carousel={{ preload: 1, padding: "5%" }}
      labels={{ Previous: "Previous image", Next: "Next image", Close: "Close image", "Photo gallery": title }}
      render={{
        slide: (props) => <LightboxImage {...props} />,
        controls: () => <><LightboxCaption /><MatureLightboxPrompt /></>,
        iconPrev: () => <FiArrowLeft />,
        iconNext: () => <FiArrowRight />,
        iconClose: () => <FiX />,
        iconZoomIn: () => <FiPlus />,
        iconZoomOut: () => <FiMinus />,
      }}
    />
  </>;
}
