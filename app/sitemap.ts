import type { MetadataRoute } from "next";
import { bikeModels } from "@/lib/catalog";
import { legalDocs } from "@/lib/legal-docs";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seka-bike.ru";
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      priority: 1
    },
    {
      url: `${siteUrl}/models`,
      lastModified: now,
      priority: 0.9
    },
    ...bikeModels.map((model) => ({
      url: `${siteUrl}/models/${model.slug}`,
      lastModified: now,
      priority: 0.8
    })),
    {
      url: `${siteUrl}/inventory`,
      lastModified: now,
      priority: 0.7
    },
    {
      url: `${siteUrl}/build-options`,
      lastModified: now,
      priority: 0.6
    },
    {
      url: `${siteUrl}/contacts`,
      lastModified: now,
      priority: 0.6
    },
    {
      url: `${siteUrl}/offer`,
      lastModified: now,
      priority: 0.4
    },
    ...legalDocs.map((doc) => ({
      url: `${siteUrl}/${doc.slug}`,
      lastModified: now,
      priority: 0.4
    }))
  ];
}
