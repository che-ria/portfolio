"use client";

import Image from "next/image";
import { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { isImageSlide, type RenderSlideProps, stopNavigationEventsPropagation, useController, useLightboxState } from "yet-another-react-lightbox";
import { MatureNotice, useMatureGate } from "@/components/MatureGate";
// Type-only: brings in the Zoom plugin's augmentation of `RenderSlideProps`,
// which is where the `zoom` prop below comes from, without importing the plugin
// itself at runtime.
import type {} from "yet-another-react-lightbox/plugins/zoom";

declare module "yet-another-react-lightbox" {
  interface SlideImage {
    /**
     * The `sizes` string the grid tile used for this image. Handing the preview
     * layer the same value makes the browser resolve it to the very candidate
     * already sitting in cache — see the comment in `LightboxImage`.
     */
    tileSizes?: string;
    caption?: string;
    /** Keep the image covered until the viewer confirms they want to see it. */
    mature?: boolean;
  }
}

/**
 * The lightbox slide: `next/image` instead of the plain `<img>` the library
 * would render on its own.
 *
 * This is the whole reason the lightbox renders its own slides. A raw `<img
 * src>` would go straight to the bucket for the original file — multi-megabyte
 * PNGs — and throw away every byte the image pipeline saves elsewhere on the
 * site.
 */
export function LightboxImage({ slide, offset, rect, zoom }: RenderSlideProps) {
  const [ready, setReady] = useState(false);
  // Whether the artwork is covered is a decision about the whole session, not
  // about this slide. Keeping it local was the old bug: the carousel remounts a
  // slide once it leaves the preload window, so an image the viewer had already
  // uncovered came back blurred a few swipes later.
  const { consent } = useMatureGate();

  if (!isImageSlide(slide) || !slide.width || !slide.height) return null;

  // The box the artwork will occupy once contained in the slide. Knowing it
  // exactly is what lets `sizes` below be honest: for a tall portrait the
  // rendered width is a fraction of the viewport, and asking for a
  // viewport-wide candidate would fetch several times the pixels on screen.
  const scale = Math.min(rect.width / slide.width, rect.height / slide.height);
  const width = Math.round(slide.width * scale);
  const height = Math.round(slide.height * scale);

  // Zoom is quantised to whole steps on purpose. It changes on every frame of a
  // pinch, and feeding that straight into `sizes` would have the browser
  // re-evaluating the srcset continuously; rounding up leaves at most a handful
  // of distinct values, so exactly one larger candidate is fetched per step in.
  const detail = Math.ceil(zoom ?? 1);
  const current = offset === 0;
  const hidden = slide.mature && consent !== "granted";

  return <div className={hidden ? "lightbox-stage is-mature" : "lightbox-stage"} style={{ width, height }}>
    {/* Two layers of the same artwork. The first requests the exact size the
        grid tile already downloaded, so it is a cache hit that paints on the
        frame the dialog opens; blurring it hides that it is small. The
        full-resolution layer fades in on top once it arrives, which turns a
        blank dialog into a photograph coming into focus. */}
    <Image
      className="lightbox-preview"
      src={slide.src}
      alt=""
      aria-hidden="true"
      fill
      draggable={false}
      sizes={slide.tileSizes}
      data-hidden={ready ? "true" : undefined}
    />
    <Image
      className="lightbox-full"
      src={slide.src}
      alt={slide.alt ?? ""}
      fill
      quality={88}
      draggable={false}
      sizes={`${width * detail}px`}
      // Neighbouring slides are loaded too, which is what makes swiping feel
      // instant — but at low priority, so they never compete with the image the
      // viewer is actually waiting for.
      loading="eager"
      fetchPriority={current ? "high" : "low"}
      data-ready={ready ? "true" : undefined}
      onLoad={() => setReady(true)}
    />
    {!ready && !hidden && <span className="lightbox-spinner" role="status" aria-label="Loading image" />}
  </div>;
}

/**
 * The consent prompt for the open lightbox.
 *
 * Rendered once for the dialog rather than once per slide — it reads the
 * current slide out of the lightbox's own state — so swiping onto a flagged
 * piece raises it and swiping off lowers it, with nothing to reconcile in the
 * carousel. It sits over the artwork rather than in a modal of its own: a
 * second dialog on top of the lightbox would fight it for focus and for the
 * Escape key.
 */
export function MatureLightboxPrompt() {
  const { consent, decide } = useMatureGate();
  const { currentSlide, currentIndex } = useLightboxState();
  const { focus } = useController();
  const [expanded, setExpanded] = useState(consent === "unknown");
  const [promptedFor, setPromptedFor] = useState(currentIndex);

  // Each slide gets a fresh prompt. The full card opens by itself the first
  // time the viewer meets mature content; after they have declined it stays
  // collapsed to a single button, so paging past the rest of the flagged pieces
  // is not nine more interruptions. Adjusting during the render that brings the
  // new slide in, rather than in an effect afterwards, means the card is never
  // painted in the wrong state for a frame.
  if (promptedFor !== currentIndex) {
    setPromptedFor(currentIndex);
    setExpanded(consent === "unknown");
  }

  const answer = (granted: boolean) => {
    decide(granted);
    setExpanded(false);
    // Hand the keyboard back to the lightbox: the button that was focused is
    // about to unmount, and focus falling to <body> would leave the arrow keys
    // and Escape doing nothing.
    focus();
  };

  if (consent === "granted" || !currentSlide || !isImageSlide(currentSlide) || !currentSlide.mature) return null;

  // The wrapper spans the dialog only to centre the card; it takes no pointer
  // events, so swiping and wheel-zooming the artwork around it still work. The
  // card itself stops those events reaching the lightbox's gesture handlers,
  // which would otherwise read a click on a button as a swipe.
  return <div className="mature-overlay">
    <div className="mature-overlay-inner" {...stopNavigationEventsPropagation()}>
      {expanded
        ? <MatureNotice onConfirm={() => answer(true)} onDismiss={() => answer(false)} />
        : <button type="button" className="mature-overlay-toggle" onClick={() => setExpanded(true)}>
            <FiAlertTriangle aria-hidden="true" /><span>Mature Content</span><small>Click to confirm</small>
          </button>}
    </div>
  </div>;
}

/**
 * Caption and position indicator, rendered once for the lightbox rather than
 * once per slide, and outside the zoom container so it stays put while the
 * artwork is panned around behind it.
 */
export function LightboxCaption() {
  const { currentSlide, currentIndex, slides } = useLightboxState();
  if (!currentSlide) return null;

  return <div className="lightbox-caption">
    {isImageSlide(currentSlide) && currentSlide.caption}
    <small>{currentIndex + 1} / {slides.length}</small>
  </div>;
}
