import { imageMeta } from "./image-meta";
import { mediaBaseUrl } from "./media";

export type ImageSize = [width: number, height: number];

/**
 * Intrinsic size of a CDN image, or `undefined` if it is not in the generated
 * table (`npm run media:meta`, see `scripts/generate-image-meta.mjs`).
 *
 * A remote image gives Next nothing to infer an aspect ratio from, so without
 * this table every gallery tile reserved a guessed box and then snapped to the
 * real shape the moment the bytes landed. Knowing the shape up front is what
 * lets the skeleton occupy exactly the space the artwork will take, and what
 * lets the masonry layout place wide pieces on the first paint instead of
 * re-flowing after each image downloads.
 *
 * Call this from Server Components only: the table is a few hundred entries and
 * has no business in a client bundle.
 *
 * The key is taken through `URL` rather than sliced off the front of `src`,
 * because that is exactly what the generator does to build its keys
 * (`new URL(index).pathname`) and the two only meet if they agree. `mediaUrl`
 * pastes the path on raw, so a file whose name contains a space arrived here
 * with the space intact and missed a row written as `%20` — four marketing
 * banners fell through to the 4:3 placeholder and stood a third taller than the
 * 16:9 art they were paired with. Normalising here means any character that has
 * to be escaped is escaped the same way on both sides.
 */
export function imageSize(src: string): ImageSize | undefined {
  return imageMeta[new URL(src, mediaBaseUrl).pathname];
}
