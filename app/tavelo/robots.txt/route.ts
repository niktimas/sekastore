export function GET() {
  return new Response(
    [
      "User-agent: GPTBot",
      "Disallow: /",
      "User-agent: ChatGPT-User",
      "Disallow: /",
      "User-agent: CCBot",
      "Disallow: /",
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "Disallow: /api",
      "Sitemap: https://tavelo.ru/sitemap.xml"
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    }
  );
}
