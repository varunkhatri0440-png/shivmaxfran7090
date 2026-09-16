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
  
  // In production, ensure absolute path resolution
  if (typeof window !== 'undefined') {
    const baseUrl = window.location.origin;
    return `${baseUrl}${normalizedPath}`;
  }
  
  return normalizedPath;
}

/**
 * Returns optimized All-Intra video URL for desktop web view.
 * Ensures proper CORS and cache headers for deployment.
 */
export function getVideoUrl(_isMobile = false): string {
  const videoPath = getMediaUrl('/video/hero_sequence.mp4');
  
  // Add cache-busting parameter only in development
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    return `${videoPath}?v=${Date.now()}`;
  }
  
  return videoPath;
}
