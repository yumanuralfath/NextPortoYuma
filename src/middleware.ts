import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const publicPaths = ["/", "/project", "/yuma-app", "/blog", "/blog/:path*"];
  const protectedPaths = ["/app", "/app/:path*"];

  const accessToken = request.cookies.get("accessToken")?.value;

  if (publicPaths.includes(request.nextUrl.pathname)) {
    const response = NextResponse.next();
    if (accessToken) {
      response.headers.set("accessToken", accessToken);
    }
    return response;
  }

  const isProtectedPath = protectedPaths.some(
    (path) =>
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith(`${path}/`)
  );

  if (isProtectedPath) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/yuma-app", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/project",
    "/yuma-app",
    "/blog",
    "/blog/:path*",
    "/app",
    "/app/:path*",
  ],
};
