/**
 * Enterprise Media Delivery & Adaptive Frame Configuration
 * Supports Cloudflare R2 / AWS CloudFront CDN offloading with local fallback.
 */

const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/$/, '') || '';

/**
 * Resolves a media asset URL through the configured CDN or local public assets.
 */
export function getMediaUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (CDN_BASE_URL) {
    return `${CDN_BASE_URL}${normalizedPath}`;
  }
  return normalizedPath;
}

/**
 * Returns optimized All-Intra video URL for desktop web view.
 */
export function getVideoUrl(_isMobile = false): string {
  return getMediaUrl('/video/hero_sequence.mp4');
}
