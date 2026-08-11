"use client";

import Image from "next/image";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type WheelEvent as ReactWheelEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ProjectImage } from "@/data/site";

const responsiveSizes = (orientation: ProjectImage["orientation"]) => orientation === "landscape"
  ? "(max-width: 700px) 100vw, 1220px"
  : "(max-width: 700px) 50vw, 602px";

const clampZoom = (value: number) => Math.min(4, Math.max(1, value));

export function ProjectGallery({ images, title }: { images: ProjectImage[]; title: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const resetZoom = () => {
    setZoom(1);
    setZoomOrigin("50% 50%");
  };

  const show = (index: number, trigger: HTMLButtonElement) => {
    resetZoom();
    triggerRef.current = trigger;
    setSelected(index);
  };

  const move = (direction: number) => {
    resetZoom();
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
        setSelected(null);
      }
      if (event.key === "ArrowRight") {
        resetZoom();
        setSelected((current) => current === null ? null : (current + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        resetZoom();
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

  return <>
    <div className="project-gallery">
      {images.map((image, index) => <button className={`project-shot ${index === 0 ? "project-shot-hero" : ""} ${image.orientation}`} key={`${image.src}-${index}`} onClick={(event) => show(index, event.currentTarget)} aria-label={`Open image ${index + 1}${image.caption ? `: ${image.caption}` : ""}`}>
        <span className="project-shot-image"><Image src={image.src} alt="" fill quality={95} sizes={responsiveSizes(image.orientation)} /></span>
        <span className="project-shot-caption" aria-hidden="true">{image.caption}</span>
      </button>)}
    </div>
    {current && <div className="lightbox project-lightbox" role="dialog" aria-modal="true" aria-label={current.caption || `${title} image ${selectedIndex + 1}`} onKeyDown={trapFocus} onMouseDown={(event) => { if (event.target === event.currentTarget) { resetZoom(); setSelected(null); } }}>
      <button ref={closeRef} className="lightbox-close" onClick={() => { resetZoom(); setSelected(null); }} aria-label="Close image"><FiX aria-hidden="true" /></button>
      <button className="lightbox-arrow prev" onClick={() => move(-1)} aria-label="Previous image">
        <FiArrowLeft aria-hidden="true" />
      </button>
      <figure className={zoom > 1 ? "is-zoomed" : undefined} tabIndex={0} role="button" aria-label="Click to zoom. Use the mouse wheel to adjust the zoom." onClick={toggleZoom} onWheel={wheelZoom} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setZoom((value) => value === 1 ? 2 : 1); } }}>
        <Image src={current.src} alt={current.alt} fill unoptimized sizes="100vw" style={{ transform: `scale(${zoom})`, transformOrigin: zoomOrigin }} />
        <figcaption>{current.caption}<small>{selectedIndex + 1} / {images.length} · {Math.round(zoom * 100)}%</small></figcaption>
      </figure>
      <button className="lightbox-arrow next" onClick={() => move(1)} aria-label="Next image">
        <FiArrowRight aria-hidden="true" />
      </button>
    </div>}
  </>;
}
