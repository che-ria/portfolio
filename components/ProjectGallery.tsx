"use client";

import Image from "next/image";
import { FiAlertTriangle, FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
import {
  Fragment,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type WheelEvent as ReactWheelEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ProjectImage } from "@/data/site";

const clampZoom = (value: number) => Math.min(4, Math.max(1, value));

export function ProjectGallery({ images, title, layout = "grid", featuredFirst = false }: { images: ProjectImage[]; title: string; layout?: "grid" | "masonry"; featuredFirst?: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [wideImages, setWideImages] = useState<Record<number, boolean>>({});
  const [revealedMatureIndex, setRevealedMatureIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const resetZoom = () => {
    setZoom(1);
    setZoomOrigin("50% 50%");
  };

  const show = (index: number, trigger: HTMLButtonElement) => {
    resetZoom();
    triggerRef.current = trigger;
    setRevealedMatureIndex(images[index].mature ? index : null);
    setSelected(index);
  };

  const move = (direction: number) => {
    resetZoom();
    setRevealedMatureIndex(null);
    setSelected((current) => current === null ? null : (current + direction + images.length) % images.length);
  };

  const setOriginFromPointer = (event: ReactMouseEvent<HTMLElement> | ReactWheelEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  const toggleZoom = (event: ReactMouseEvent<HTMLElement>) => {
    setOriginFromPointer(event);
    setZoom((current) => current === 1 ? 2 : 1);
  };

  const wheelZoom = (event: ReactWheelEvent<HTMLElement>) => {
    event.preventDefault();
    setOriginFromPointer(event);
    setZoom((current) => clampZoom(current + (event.deltaY < 0 ? 0.25 : -0.25)));
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

  useEffect(() => {
    if (selected === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        resetZoom();
        setRevealedMatureIndex(null);
        setSelected(null);
      }
      if (event.key === "ArrowRight") {
        resetZoom();
        setRevealedMatureIndex(null);
        setSelected((current) => current === null ? null : (current + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        resetZoom();
        setRevealedMatureIndex(null);
        setSelected((current) => current === null ? null : (current - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [selected, images.length]);

  const selectedIndex = selected ?? 0;
  const current = selected === null ? null : images[selectedIndex];
  const matureContentHidden = current?.mature && revealedMatureIndex !== selectedIndex;
  const standaloneIndexes = layout === "grid" ? (() => {
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
  })() : new Set<number>();

  return <>
    <div className={`project-gallery ${layout === "masonry" ? "is-masonry" : ""}`}>
      {images.map((image, index) => <Fragment key={`${image.src}-${index}`}>
        {image.sectionTitle && <h2 className="project-gallery-section-title">{image.sectionTitle}</h2>}
        <button className={`project-shot ${featuredFirst && index === 0 ? "project-shot-hero" : ""} ${image.fullWidth ? "is-full-width" : ""} ${image.centered || standaloneIndexes.has(index) ? "is-standalone" : ""} ${image.mature ? "is-mature" : ""} ${wideImages[index] ? "is-wide" : "is-paired"}`} onClick={(event) => show(index, event.currentTarget)} aria-label={`Open image ${index + 1}${image.caption ? `: ${image.caption}` : ""}`}>
        <span className="project-shot-image"><Image src={image.src} alt="" width={2000} height={2000} quality={95} sizes="(max-width: 700px) 100vw, 1220px" onLoad={(event) => { const byName = /(?:^|[_-])wide(?:[_.\-]|$)/i.test(image.src); const isWide = byName || event.currentTarget.naturalWidth / event.currentTarget.naturalHeight >= 1.5; setWideImages((current) => current[index] === isWide ? current : { ...current, [index]: isWide }); }} /></span>
        {image.mature && <span className="mature-content-card-notice" aria-hidden="true"><FiAlertTriangle /><span>Mature Content</span><small>Click to Show</small></span>}
        <span className="project-shot-caption" aria-hidden="true">{image.caption}</span>
        </button>
      </Fragment>)}
    </div>
    {current && <div className="lightbox project-lightbox" role="dialog" aria-modal="true" aria-label={current.caption || `${title} image ${selectedIndex + 1}`} onKeyDown={trapFocus} onMouseDown={(event) => { if (event.target === event.currentTarget) { resetZoom(); setRevealedMatureIndex(null); setSelected(null); } }}>
      <button ref={closeRef} className="lightbox-close" onClick={() => { resetZoom(); setRevealedMatureIndex(null); setSelected(null); }} aria-label="Close image"><FiX aria-hidden="true" /></button>
      <button className="lightbox-arrow prev" onClick={() => move(-1)} aria-label="Previous image">
        <FiArrowLeft aria-hidden="true" />
      </button>
      <figure className={`${zoom > 1 ? "is-zoomed " : ""}${matureContentHidden ? "is-mature-hidden" : ""}`} tabIndex={matureContentHidden ? undefined : 0} role={matureContentHidden ? undefined : "button"} aria-label={matureContentHidden ? undefined : "Click to zoom. Use the mouse wheel to adjust the zoom."} onClick={matureContentHidden ? undefined : toggleZoom} onWheel={matureContentHidden ? undefined : wheelZoom} onKeyDown={matureContentHidden ? undefined : (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setZoom((value) => value === 1 ? 2 : 1); } }}>
        <Image src={current.src} alt={current.alt} fill unoptimized sizes="100vw" style={{ transform: `scale(${zoom})`, transformOrigin: zoomOrigin }} />
        {matureContentHidden && <button className="mature-content-reveal" onClick={() => setRevealedMatureIndex(selectedIndex)}><FiAlertTriangle aria-hidden="true" /><span>Mature Content</span><small>Click to Show</small></button>}
        <figcaption>{current.caption}<small>{selectedIndex + 1} / {images.length} · {Math.round(zoom * 100)}%</small></figcaption>
      </figure>
      <button className="lightbox-arrow next" onClick={() => move(1)} aria-label="Next image">
        <FiArrowRight aria-hidden="true" />
      </button>
    </div>}
  </>;
}
