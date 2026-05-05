import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPrefixes = ["/dashboard", "/cases"];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  // Check for Supabase session cookie (real auth)
  const supabaseCookie = request.cookies.getAll().find(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  // Check for demo user marker
  // Note: localStorage is not accessible in middleware — we use a cookie set by client
  const demoCookie = request.cookies.get("scamdam_demo_user");

  if (!supabaseCookie && !demoCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/cases/:path*"],
};
