import { taveloModels } from "@/lib/tavelo-catalog";

export function GET() {
  const baseUrl = "https://tavelo.ru";
  const urls = [
    "",
    "/inventory",
    "/build-options",
    "/contacts",
    ...taveloModels.map((model) => `/models/${model.slug}`)
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${baseUrl}${path}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
