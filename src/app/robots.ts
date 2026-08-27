import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Utility routes carry no indexable content and often personal state.
      disallow: ["/cart", "/checkout", "/account"],
    },
    sitemap: "https://dcro.example/sitemap.xml",
  };
}
