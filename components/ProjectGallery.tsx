"use client";

import Image from "next/image";
import { FiAlertTriangle, FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
import {
  Fragment,
  memo,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ProjectImage } from "@/data/site";

const clampZoom = (value: number) => Math.min(4, Math.max(1, value));

type Layout = "grid" | "masonry";

/**
 * `sizes` has to describe the slot the image actually occupies, not the widest
 * slot in the gallery. The grid is `min(1220px, 100% - 3rem)` wide: two columns
 * on desktop, one below 700px. Overstating this makes the browser pick a 1920px
 * or 3840px candidate for a ~600px slot, which is the single largest source of
 * wasted bytes on these pages.
 *
 * Widths are given in px rather than `calc()`/fractional `vw`: next/image only
 * recognises a bare `<n>vw` token when trimming the srcset, so `calc(50vw - 1rem)`
 * makes it emit every candidate down to 32w — markup no browser can ever use.
 */
const tileSizes = (layout: Layout, spansFullWidth: boolean) => {
  if (layout === "masonry") return "(max-width: 700px) 100vw, (max-width: 900px) 420px, 812px";
  if (spansFullWidth) return "(max-width: 700px) 100vw, 1220px";
  return "(max-width: 700px) 100vw, 610px";
};

/**
 * Memoised so that a `wideImages` update from one image's `onLoad` does not
 * force React to reconcile every other tile in a 57-image gallery.
 */
const GalleryTile = memo(function GalleryTile({ image, index, className, sizes, measure, onOpen }: {
  image: ProjectImage;
  index: number;
  className: string;
  sizes: string;
  measure: ((index: number, isWide: boolean) => void) | null;
  onOpen: (index: number, trigger: HTMLButtonElement) => void;
}) {
  return <button className={className} onClick={(event) => onOpen(index, event.currentTarget)} aria-label={`Open image ${index + 1}${image.caption ? `: ${image.caption}` : ""}`}>
    <span className="project-shot-image">
      <Image
        src={image.src}
        alt=""
        width={2000}
        height={2000}
        quality={95}
        sizes={sizes}
        onLoad={measure ? (event) => {
          const byName = /(?:^|[_-])wide(?:[_.\-]|$)/i.test(image.src);
          measure(index, byName || event.currentTarget.naturalWidth / event.currentTarget.naturalHeight >= 1.5);
        } : undefined}
      />
    </span>
    {image.mature && <span className="mature-content-card-notice" aria-hidden="true"><FiAlertTriangle /><span>Mature Content</span><small>Click to Show</small></span>}
    <span className="project-shot-caption" aria-hidden="true">{image.caption}</span>
  </button>;
});

export function ProjectGallery({ images, title, layout = "grid", featuredFirst = false }: { images: ProjectImage[]; title: string; layout?: Layout; featuredFirst?: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [wideImages, setWideImages] = useState<Record<number, boolean>>({});
  const [revealedMatureIndex, setRevealedMatureIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const figureRef = useRef<HTMLElement>(null);

  const isOpen = selected !== null;

  const resetZoom = useCallback(() => {
    setZoom(1);
    setZoomOrigin("50% 50%");
  }, []);

  const close = useCallback(() => {
    resetZoom();
    setRevealedMatureIndex(null);
    setSelected(null);
  }, [resetZoom]);

  const show = useCallback((index: number, trigger: HTMLButtonElement) => {
    resetZoom();
    triggerRef.current = trigger;
    setRevealedMatureIndex(images[index].mature ? index : null);
    setSelected(index);
  }, [images, resetZoom]);

  const move = useCallback((direction: number) => {
    resetZoom();
    setRevealedMatureIndex(null);
    setSelected((current) => current === null ? null : (current + direction + images.length) % images.length);
  }, [images.length, resetZoom]);

  // Only the masonry layout reacts to an image being wide (`is-wide` spans two
  // columns there). In the two-column grid `is-wide` resolves to the same
  // `grid-column: span 1` as the base rule, so measuring would cost one state
  // update per image for no visible effect.
  const measure = useMemo(() => layout !== "masonry" ? null : (index: number, isWide: boolean) => {
    setWideImages((current) => current[index] === isWide ? current : { ...current, [index]: isWide });
  }, [layout]);

  const setOriginFromPointer = useCallback((clientX: number, clientY: number, element: HTMLElement) => {
    const bounds = element.getBoundingClientRect();
    setZoomOrigin(`${((clientX - bounds.left) / bounds.width) * 100}% ${((clientY - bounds.top) / bounds.height) * 100}%`);
  }, []);

  const toggleZoom = (event: ReactMouseEvent<HTMLElement>) => {
    setOriginFromPointer(event.clientX, event.clientY, event.currentTarget);
    setZoom((current) => current === 1 ? 2 : 1);
  };

  const trapFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), [href], [tabindex]:not([tabindex='-1'])"));
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  // Keyed on `isOpen` rather than `selected`: keying on the index re-ran the
  // cleanup on every arrow press, which handed focus back to the grid button
  // behind the dialog and scrolled the page under it.
  useEffect(() => {
    if (!isOpen) return;
    // Lock the root, not the body: globals.css gives <html> `overflow-y: scroll`,
    // which makes it the scroll container, so hiding body overflow would no
    // longer stop the page behind the dialog from scrolling.
    const root = document.documentElement;
    const { overflow: previousOverflow, paddingRight: previousPadding } = root.style;
    // Hiding overflow reclaims the scrollbar track; pad by the same width so the
    // page underneath does not jump sideways as the dialog opens.
    const trackWidth = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (trackWidth > 0) root.style.paddingRight = `${trackWidth}px`;
    closeRef.current?.focus();
    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close, move]);

  // React registers `wheel` on the root as a passive listener, so an onWheel
  // handler cannot call preventDefault(). Bind it directly to keep the browser
  // from scrolling (or page-zooming) while the pointer is over the image.
  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setOriginFromPointer(event.clientX, event.clientY, figure);
      setZoom((current) => clampZoom(current + (event.deltaY < 0 ? 0.25 : -0.25)));
    };
    figure.addEventListener("wheel", onWheel, { passive: false });
    return () => figure.removeEventListener("wheel", onWheel);
  }, [isOpen, setOriginFromPointer]);

  const selectedIndex = selected ?? 0;
  const current = selected === null ? null : images[selectedIndex];
  const matureContentHidden = current?.mature && revealedMatureIndex !== selectedIndex;

  const standaloneIndexes = useMemo(() => {
    if (layout !== "grid") return new Set<number>();
    const indexes = new Set<number>();
    let occupiedColumns = 0;
    images.forEach((image, index) => {
      if (image.sectionTitle || (featuredFirst && index === 0) || image.centered || image.fullWidth) occupiedColumns = 0;
      if (featuredFirst && index === 0 || image.centered || image.fullWidth) return;
      const next = images[index + 1];
      if (occupiedColumns === 0 && (!next || next.sectionTitle || next.centered)) indexes.add(index);
      occupiedColumns = (occupiedColumns + 1) % 2;
    });
    return indexes;
  }, [images, layout, featuredFirst]);

  return <>
    <div className={`project-gallery ${layout === "masonry" ? "is-masonry" : ""}`}>
      {images.map((image, index) => {
        const isHero = featuredFirst && index === 0;
        const spansFullWidth = isHero || !!image.fullWidth;
        return <Fragment key={`${image.src}-${index}`}>
          {image.sectionTitle && <h2 className="project-gallery-section-title">{image.sectionTitle}</h2>}
          <GalleryTile
            image={image}
            index={index}
            className={`project-shot ${isHero ? "project-shot-hero" : ""} ${image.fullWidth ? "is-full-width" : ""} ${image.centered || standaloneIndexes.has(index) ? "is-standalone" : ""} ${image.mature ? "is-mature" : ""} ${wideImages[index] ? "is-wide" : "is-paired"}`}
            sizes={tileSizes(layout, spansFullWidth)}
            measure={measure}
            onOpen={show}
          />
        </Fragment>;
      })}
    </div>
    {current && <div className="lightbox project-lightbox" role="dialog" aria-modal="true" aria-label={current.caption || `${title} image ${selectedIndex + 1}`} onKeyDown={trapFocus} onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <button ref={closeRef} className="lightbox-close" onClick={close} aria-label="Close image"><FiX aria-hidden="true" /></button>
      <button className="lightbox-arrow prev" onClick={() => move(-1)} aria-label="Previous image">
        <FiArrowLeft aria-hidden="true" />
      </button>
      <figure ref={figureRef} className={`${zoom > 1 ? "is-zoomed " : ""}${matureContentHidden ? "is-mature-hidden" : ""}`} tabIndex={matureContentHidden ? undefined : 0} role={matureContentHidden ? undefined : "button"} aria-label={matureContentHidden ? undefined : "Click to zoom. Use the mouse wheel to adjust the zoom."} onClick={matureContentHidden ? undefined : toggleZoom} onKeyDown={matureContentHidden ? undefined : (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setZoom((value) => value === 1 ? 2 : 1); } }}>
        {/* `sizes` deliberately overshoots the viewport so the browser picks a
            candidate with headroom for the 4x zoom. Serving the untouched source
            instead would mean multi-megabyte PNGs for a single view. */}
        <Image src={current.src} alt={current.alt} fill quality={95} sizes="200vw" style={{ transform: `scale(${zoom})`, transformOrigin: zoomOrigin }} />
        {matureContentHidden && <button className="mature-content-reveal" onClick={() => setRevealedMatureIndex(selectedIndex)}><FiAlertTriangle aria-hidden="true" /><span>Mature Content</span><small>Click to Show</small></button>}
        <figcaption>{current.caption}<small>{selectedIndex + 1} / {images.length} · {Math.round(zoom * 100)}%</small></figcaption>
      </figure>
      <button className="lightbox-arrow next" onClick={() => move(1)} aria-label="Next image">
        <FiArrowRight aria-hidden="true" />
      </button>
    </div>}
  </>;
}
