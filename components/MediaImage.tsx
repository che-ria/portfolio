"use client";

import Image, { type ImageProps } from "next/image";
import { type ReactNode, useState } from "react";

type State = "loading" | "ready" | "failed";

/**
 * `next/image` with a loading state attached to the element itself.
 *
 * The skeleton is painted as the `<img>`'s own background, so it fills exactly
 * the box the artwork will occupy and needs no wrapper, no absolutely
 * positioned overlay and no second element to keep in sync. It disappears the
 * moment the image has pixels to show, because the image paints over it.
 *
 * The fade-in is skipped for images the page preloads or loads eagerly: those
 * are the Largest Contentful Paint candidates, and starting them at `opacity: 0`
 * would delay the very metric they exist to win.
 */
export function MediaImage({ alt, className, fallback, onError, onLoad, ...props }: ImageProps & { fallback?: ReactNode }) {
  const [state, setState] = useState<State>("loading");

  if (state === "failed" && fallback) return <>{fallback}</>;

  const instant = props.preload || props.loading === "eager";

  return <Image
    {...props}
    alt={alt}
    className={className ? `media-image ${className}` : "media-image"}
    data-state={state}
    data-instant={instant ? "true" : undefined}
    onLoad={(event) => { setState("ready"); onLoad?.(event); }}
    onError={(event) => { setState("failed"); onError?.(event); }}
  />;
}
