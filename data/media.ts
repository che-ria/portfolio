export const mediaBaseUrl = "https://pub-9f988e3ef4e845fdb2e4f9c57ab4b44b.r2.dev";

/** Returns an absolute URL for an asset stored in the public Cloudflare R2 bucket. */
export function mediaUrl(path: string): string {
  return `${mediaBaseUrl}${path}`;
}
