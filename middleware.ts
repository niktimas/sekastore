import { NextRequest, NextResponse } from "next/server";

const TAVELO_HOSTS = new Set(["tavelo.ru", "www.tavelo.ru"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();

  if (!host || !TAVELO_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    const url = request.nextUrl.clone();
    url.pathname = `/tavelo${pathname}`;
    return NextResponse.rewrite(url);
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

  const url = request.nextUrl.clone();

  if (pathname === "/") {
    url.pathname = "/tavelo";
    return NextResponse.rewrite(url);
  }

  if (
    pathname.startsWith("/models") ||
    pathname === "/inventory" ||
    pathname === "/build-options" ||
    pathname === "/contacts"
  ) {
    url.pathname = `/tavelo${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
