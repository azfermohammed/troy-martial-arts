/**
 * Prefixes files in /public with the deploy basePath.
 *
 * Next.js prefixes basePath onto routes, CSS and JS automatically, but NOT
 * onto next/image sources when `images.unoptimized` is set — which a static
 * export requires. Without this, every image 404s on GitHub Pages, where the
 * site is served from /troy-martial-arts rather than the domain root.
 *
 * NEXT_PUBLIC_* is inlined at build time, so this works in both server and
 * client components.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
