const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "");

/**
 * Returns a media URL from object storage when configured, otherwise a local
 * public path. This keeps local development simple while production does not
 * need portfolio assets in the application repository.
 */
export function mediaUrl(path: string): string {
  return mediaBaseUrl ? `${mediaBaseUrl}${path}` : path;
}
