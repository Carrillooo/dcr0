import type { MetadataRoute } from "next";
import { CATEGORIES, PRODUCTS } from "@/data/products";

const BASE = "https://dcro.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: BASE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/vehicle`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    ...CATEGORIES.map((c) => ({
      url: `${BASE}/shop/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${BASE}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
