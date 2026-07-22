import { NextRequest, NextResponse } from "next/server";

const TAVELO_HOSTS = new Set(["tavelo.ru", "www.tavelo.ru"]);

function rewriteToTavelo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  url.pathname = pathname;

  if (forwardedHost) {
    url.host = forwardedHost;
  }

  url.protocol = `${forwardedProto}:`;

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
