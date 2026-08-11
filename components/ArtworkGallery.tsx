"use client";

import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";
import { artworks } from "@/data/site";

export function ArtworkGallery() {
  const [selected, setSelected] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current = artworks.find((art) => art.id === selected);

  useEffect(() => {
    if (!current) return;
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      const index = artworks.findIndex((art) => art.id === current.id);
      if (event.key === "ArrowRight") setSelected(artworks[(index + 1) % artworks.length].id);
      if (event.key === "ArrowLeft") setSelected(artworks[(index - 1 + artworks.length) % artworks.length].id);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); triggerRef.current?.focus(); };
  }, [current]);

  const move = (direction: number) => {
    if (!current) return;
    const index = artworks.findIndex((art) => art.id === current.id);
    setSelected(artworks[(index + direction + artworks.length) % artworks.length].id);
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

  return <>
    <div className="art-grid personal-art-grid">{artworks.map((art) => <button key={art.id} className={`art-card ${art.orientation}`} onClick={(event) => { triggerRef.current = event.currentTarget; setSelected(art.id); }} aria-label={`Open artwork: ${art.title}`}><Image src={art.src} alt="" fill sizes="(max-width: 700px) 100vw, 42vw" /><span aria-hidden="true"><small>{art.category}</small>{art.title}</span></button>)}</div>
    {current && <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.title} onKeyDown={trapFocus} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <button ref={closeRef} className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close artwork"><FiX aria-hidden="true" /></button>
      <button className="lightbox-arrow prev" onClick={() => move(-1)} aria-label="Previous artwork"><FiChevronLeft aria-hidden="true" /></button>
      <figure><Image src={current.src} alt={current.alt} fill sizes="90vw" /><figcaption><small>{current.category}</small>{current.title}</figcaption></figure>
      <button className="lightbox-arrow next" onClick={() => move(1)} aria-label="Next artwork"><FiChevronRight aria-hidden="true" /></button>
    </div>}
  </>;
}
