import { NextRequest, NextResponse } from "next/server";

const TAVELO_HOSTS = new Set(["tavelo.ru", "www.tavelo.ru"]);

function rewriteToTavelo(request: NextRequest, pathname: string) {
  const url = new URL(request.url);

  url.pathname = pathname;
  url.protocol = "http:";
  url.hostname = "127.0.0.1";
  url.port = process.env.PORT ?? "3000";

  return NextResponse.rewrite(url);
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();

  if (!host || !TAVELO_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return rewriteToTavelo(request, `/tavelo${pathname}`);
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/media") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return rewriteToTavelo(request, "/tavelo");
  }

  if (
    pathname.startsWith("/models") ||
    pathname === "/inventory" ||
    pathname === "/build-options" ||
    pathname === "/contacts"
  ) {
    return rewriteToTavelo(request, `/tavelo${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
