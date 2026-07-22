import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seka-bike.ru";

  return {
    rules: [
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
          "Bytespider",
          "Amazonbot",
          "Applebot-Extended"
        ],
        disallow: "/"
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
