import type { MetadataRoute } from "next";
import { BIZ } from "@/lib/data";

/**
 * Emitted as robots.txt at build time.
 *
 * /portal is disallowed: it is a staff tool, and indexing a login screen only
 * competes with the marketing pages for the same searches.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/portal/" }],
    sitemap: `${BIZ.siteUrl}/sitemap.xml`,
  };
}
