import type { MetadataRoute } from "next";
import { BIZ } from "@/lib/data";

/**
 * Emitted as sitemap.xml at build time.
 *
 * Public marketing pages only — /portal is a private staff tool and has
 * nothing a search engine should index.
 */
export const dynamic = "force-static";

const ROUTES: {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/programs", priority: 0.9, changeFrequency: "monthly" },
  { path: "/schedule", priority: 0.9, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "yearly" },
  { path: "/reviews", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((r) => ({
    url: `${BIZ.siteUrl}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
